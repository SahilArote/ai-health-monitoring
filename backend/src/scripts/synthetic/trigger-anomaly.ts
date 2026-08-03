import { prisma } from '../../config/prisma';
import { VitalsService, VitalInputReading } from '../../modules/vitals/vitals.service';
import { MetricType } from '@prisma/client';
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

const DEFAULT_ANOMALY_VALUES: Record<string, { value: number; unit: string }> = {
  heart_rate: { value: 145, unit: 'bpm' },
  spo2: { value: 88, unit: '%' },
  temperature: { value: 40.0, unit: '°C' },
};

export async function triggerAnomaly() {
  const cliArgs = parseArgs();
  const fileConfig = loadConfig();

  const patientId = cliArgs.patientId || fileConfig?.patientId;
  const deviceId = cliArgs.deviceId || fileConfig?.deviceId;

  if (!patientId || !deviceId) {
    console.error(
      '❌ Missing patientId or deviceId. Please run `npm run simulate:seed` first or provide --patientId and --deviceId.'
    );
    process.exit(1);
  }

  const metricName = (cliArgs.metric || 'heart_rate').toLowerCase();
  const validMetrics = ['heart_rate', 'spo2', 'temperature'];

  if (!validMetrics.includes(metricName)) {
    console.error(`❌ Invalid metric "${metricName}". Valid metrics: ${validMetrics.join(', ')}`);
    process.exit(1);
  }

  const metricEnum = metricName as MetricType;
  const defaults = DEFAULT_ANOMALY_VALUES[metricName];
  const value = cliArgs.value ? parseFloat(cliArgs.value) : defaults.value;
  const unit = defaults.unit;

  console.log(`🚨 Triggering Anomaly Reading...`);
  console.log(`- Metric:     ${metricName}`);
  console.log(`- Value:      ${value} ${unit}`);
  console.log(`- Patient ID: ${patientId}`);
  console.log(`- Device ID:  ${deviceId}\n`);

  const nowStr = new Date().toISOString();
  const reading: VitalInputReading = {
    metric: metricEnum,
    value,
    unit,
    source: 'synthetic-anomaly-trigger',
    recordedAt: nowStr,
  };

  // Push reading through existing ingest service
  const ingestResult = await VitalsService.ingestReadings(patientId, deviceId, [reading]);

  console.log(`📊 Ingestion Result: Accepted: ${ingestResult.accepted}, Alerts Triggered: ${ingestResult.alertsTriggered}`);

  // Query latest alert from DB
  const latestAlert = await prisma.alert.findFirst({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
  });

  if (latestAlert && ingestResult.alertsTriggered > 0) {
    console.log('\n🚨 Alert Successfully Created in Database!');
    console.log(`- Alert ID:   ${latestAlert.id}`);
    console.log(`- Metric:     ${latestAlert.metricType}`);
    console.log(`- Value:      ${latestAlert.value}`);
    console.log(`- Severity:   ${latestAlert.severity}`);
    console.log(`- Source:     ${latestAlert.source}`);
    console.log(`- Status:     ${latestAlert.status}`);
    console.log(`- Created At: ${latestAlert.createdAt.toISOString()}\n`);
  } else {
    console.log('\n⚠️ Reading inserted, but no new Alert record was created.');
  }
}

if (require.main === module) {
  triggerAnomaly()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error('❌ Error triggering anomaly:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
