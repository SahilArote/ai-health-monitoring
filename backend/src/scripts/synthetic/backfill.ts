import { prisma } from '../../config/prisma';
import { VitalsService, VitalInputReading } from '../../modules/vitals/vitals.service';
import { MetricType } from '@prisma/client';
import * as patterns from './patterns';
import * as fs from 'fs';
import * as path from 'path';

function parseArgs() {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {};

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || 'true';
    }
  }
  return options;
}

function loadConfig() {
  const configPath = path.join(__dirname, 'synthetic-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  return null;
}

export async function backfill() {
  const cliArgs = parseArgs();
  const fileConfig = loadConfig();

  const days = parseInt(cliArgs.days || '14', 10);
  const patientId = cliArgs.patientId || fileConfig?.patientId;
  const deviceId = cliArgs.deviceId || fileConfig?.deviceId;

  if (!patientId || !deviceId) {
    console.error(
      '❌ Missing patientId or deviceId. Please run `npm run simulate:seed` first or provide --patientId and --deviceId.'
    );
    process.exit(1);
  }

  console.log(`⏳ Starting synthetic backfill for ${days} days...`);
  console.log(`- Patient ID: ${patientId}`);
  console.log(`- Device ID:  ${deviceId}\n`);

  const now = new Date();
  const startTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  let totalReadingsGenerated = 0;
  let totalAccepted = 0;
  let totalDuplicates = 0;
  let totalAlertsCreated = 0;

  let pendingReadings: VitalInputReading[] = [];
  const BATCH_SIZE = 100;

  // Process day by day
  for (let d = 0; d < days; d++) {
    const currentDayStart = new Date(startTime.getTime() + d * 24 * 60 * 60 * 1000);
    let cumulativeStepsToday = 0;

    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(currentDayStart.getTime() + hour * 60 * 60 * 1000);
      if (timestamp > now) break;

      // Heart Rate
      pendingReadings.push({
        metric: MetricType.heart_rate,
        value: patterns.heartRate(timestamp),
        unit: 'bpm',
        source: 'synthetic-generator',
        recordedAt: timestamp.toISOString(),
      });

      // SpO2
      pendingReadings.push({
        metric: MetricType.spo2,
        value: patterns.spo2(timestamp),
        unit: '%',
        source: 'synthetic-generator',
        recordedAt: timestamp.toISOString(),
      });

      // Temperature
      pendingReadings.push({
        metric: MetricType.temperature,
        value: patterns.temperature(timestamp),
        unit: '°C',
        source: 'synthetic-generator',
        recordedAt: timestamp.toISOString(),
      });

      // Steps
      cumulativeStepsToday = patterns.steps(timestamp, cumulativeStepsToday);
      pendingReadings.push({
        metric: MetricType.steps,
        value: cumulativeStepsToday,
        unit: 'steps',
        source: 'synthetic-generator',
        recordedAt: timestamp.toISOString(),
      });

      // Sleep (emitted at 6 AM)
      const sleepDuration = patterns.sleepDuration(timestamp);
      if (sleepDuration !== null) {
        pendingReadings.push({
          metric: MetricType.sleep,
          value: sleepDuration,
          unit: 'hours',
          source: 'synthetic-generator',
          recordedAt: timestamp.toISOString(),
        });
      }

      // Flush batch if size reached
      if (pendingReadings.length >= BATCH_SIZE) {
        totalReadingsGenerated += pendingReadings.length;
        const result = await VitalsService.ingestReadings(patientId, deviceId, pendingReadings);
        totalAccepted += result.accepted;
        totalDuplicates += result.duplicates;
        totalAlertsCreated += result.alertsTriggered;
        pendingReadings = [];
      }
    }
  }

  // Flush remaining readings
  if (pendingReadings.length > 0) {
    totalReadingsGenerated += pendingReadings.length;
    const result = await VitalsService.ingestReadings(patientId, deviceId, pendingReadings);
    totalAccepted += result.accepted;
    totalDuplicates += result.duplicates;
    totalAlertsCreated += result.alertsTriggered;
    pendingReadings = [];
  }

  console.log('✅ Backfill Completed Successfully!');
  console.log(`- Total Readings Processed: ${totalReadingsGenerated}`);
  console.log(`- Readings Accepted:         ${totalAccepted}`);
  console.log(`- Duplicates Skipped:        ${totalDuplicates}`);
  console.log(`- Alerts Triggered:          ${totalAlertsCreated}\n`);
}

if (require.main === module) {
  backfill()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error('❌ Error during backfill:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
