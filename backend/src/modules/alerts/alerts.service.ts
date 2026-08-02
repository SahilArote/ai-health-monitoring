import { prisma } from '../../config/prisma';
import { AlertSeverity, AlertSource, AlertStatus, FeedbackLabel } from '@prisma/client';
import { AppError } from '../../common/middleware/error-handler';
import { enqueueNotificationJob } from '../../jobs/notification.job';

export class AlertsService {
  static async listAlerts(
    patientId: string,
    filter: { status?: AlertStatus; severity?: AlertSeverity; page?: number; limit?: number }
  ) {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    const skip = (page - 1) * limit;

    const where: any = { patientId };
    if (filter.status) where.status = filter.status;
    if (filter.severity) where.severity = filter.severity;

    const [total, alerts] = await Promise.all([
      prisma.alert.count({ where }),
      prisma.alert.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      alerts,
    };
  }

  static async acknowledgeAlert(alertId: string, patientId: string) {
    const alert = await prisma.alert.findFirst({
      where: { id: alertId, patientId },
    });

    if (!alert) {
      throw new AppError('Alert not found or access denied', 404);
    }

    return prisma.alert.update({
      where: { id: alertId },
      data: { status: AlertStatus.acknowledged },
    });
  }

  static async submitFeedback(alertId: string, patientId: string, label: FeedbackLabel) {
    const alert = await prisma.alert.findFirst({
      where: { id: alertId, patientId },
    });

    if (!alert) {
      throw new AppError('Alert not found or access denied', 404);
    }

    return prisma.alert.update({
      where: { id: alertId },
      data: { feedbackLabel: label },
    });
  }

  static async createSOS(
    patientId: string,
    location?: { latitude?: number; longitude?: number }
  ) {
    const alert = await prisma.alert.create({
      data: {
        patientId,
        metricType: 'sos',
        value: 1.0,
        severity: AlertSeverity.critical,
        source: AlertSource.rule,
        status: AlertStatus.open,
      },
    });

    // Enqueue immediate stub notification job
    try {
      await enqueueNotificationJob({
        alertId: alert.id,
        patientId,
        type: 'sos',
        severity: 'critical',
        location,
      });
    } catch (err) {
      console.warn('Failed to enqueue notification job (Redis offline?):', err);
    }

    return alert;
  }
}
