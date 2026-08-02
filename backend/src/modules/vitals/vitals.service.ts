import { prisma } from '../../config/prisma';
import { MetricType, AlertSeverity, AlertSource, AlertStatus } from '@prisma/client';
import { AppError } from '../../common/middleware/error-handler';

export interface VitalInputReading {
  metric: MetricType;
  value: number;
  unit: string;
  source?: string;
  recordedAt: string;
}

export class VitalsService {
  static async ingestReadings(
    patientId: string,
    deviceId: string,
    readings: VitalInputReading[]
  ) {
    // Verify device exists and belongs to patient
    const device = await prisma.device.findFirst({
      where: { id: deviceId, patientId },
    });

    if (!device) {
      throw new AppError('Device not found or access denied', 404);
    }

    let accepted = 0;
    let duplicates = 0;
    const alertBreaches: { metric: MetricType; value: number; severity: AlertSeverity }[] = [];

    // Ingest readings one by one or via createMany
    for (const r of readings) {
      const recordedAtDate = new Date(r.recordedAt);
      try {
        await prisma.vitalsReading.create({
          data: {
            patientId,
            deviceId,
            metricType: r.metric,
            value: r.value,
            unit: r.unit,
            source: r.source || device.deviceName || 'wearable',
            recordedAt: recordedAtDate,
          },
        });
        accepted++;

        // Inline rule threshold check
        const alert = this.checkThresholds(r.metric, r.value);
        if (alert) {
          alertBreaches.push({ metric: r.metric, value: r.value, severity: alert });
        }
      } catch (err: any) {
        // Unique constraint violation (P2002)
        if (err.code === 'P2002') {
          duplicates++;
        } else {
          throw err;
        }
      }
    }

    // Create alert rows for breached thresholds
    for (const b of alertBreaches) {
      await prisma.alert.create({
        data: {
          patientId,
          metricType: b.metric,
          value: b.value,
          severity: b.severity,
          source: AlertSource.rule,
          status: AlertStatus.open,
        },
      });
    }

    // Update device lastSyncAt
    await prisma.device.update({
      where: { id: deviceId },
      data: { lastSyncAt: new Date(), status: 'connected' },
    });

    return {
      accepted,
      duplicates,
      alertsTriggered: alertBreaches.length,
    };
  }

  private static checkThresholds(metric: MetricType, value: number): AlertSeverity | null {
    switch (metric) {
      case MetricType.heart_rate:
        if (value > 130 || value < 40) return AlertSeverity.critical;
        if (value > 110 || value < 50) return AlertSeverity.warning;
        break;
      case MetricType.spo2:
        if (value < 92) return AlertSeverity.critical;
        if (value < 95) return AlertSeverity.warning;
        break;
      case MetricType.temperature:
        if (value > 39.5) return AlertSeverity.critical;
        if (value > 38.0) return AlertSeverity.warning;
        break;
    }
    return null;
  }

  static async queryVitals(
    targetPatientId: string,
    filter: { metric?: MetricType; from?: string; to?: string }
  ) {
    const where: any = { patientId: targetPatientId };

    if (filter.metric) {
      where.metricType = filter.metric;
    }

    if (filter.from || filter.to) {
      where.recordedAt = {};
      if (filter.from) where.recordedAt.gte = new Date(filter.from);
      if (filter.to) where.recordedAt.lte = new Date(filter.to);
    }

    return prisma.vitalsReading.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 100, // Reasonable cap
    });
  }
}
