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

export async function startLiveSimulation() {
  const cliArgs = parseArgs();
  const fileConfig = loadConfig();

  const intervalSeconds = parseInt(cliArgs.interval || '30', 10);
  const patientId = cliArgs.patientId || fileConfig?.patientId;
  const deviceId = cliArgs.deviceId || fileConfig?.deviceId;

  if (!patientId || !deviceId) {
    console.error(
      '❌ Missing patientId or deviceId. Please run `npm run simulate:seed` first or provide --patientId and --deviceId.'
    );
    process.exit(1);
  }

  console.log(`⚡ Starting Live Synthetic Vitals Stream...`);
  console.log(`- Interval:   Every ${intervalSeconds} seconds`);
  console.log(`- Patient ID: ${patientId}`);
  console.log(`- Device ID:  ${deviceId}`);
  console.log(`- Press Ctrl+C to stop.\n`);

  let cumulativeSteps = 1250; // Starting baseline for live stream

  const tick = async () => {
    const now = new Date();
    const isoTime = now.toISOString();

    cumulativeSteps = patterns.steps(now, cumulativeSteps);

    const readings: VitalInputReading[] = [
      {
        metric: MetricType.heart_rate,
        value: patterns.heartRate(now),
        unit: 'bpm',
        source: 'synthetic-live-stream',
        recordedAt: isoTime,
      },
      {
        metric: MetricType.spo2,
        value: patterns.spo2(now),
        unit: '%',
        source: 'synthetic-live-stream',
        recordedAt: isoTime,
      },
      {
        metric: MetricType.temperature,
        value: patterns.temperature(now),
        unit: '°C',
        source: 'synthetic-live-stream',
        recordedAt: isoTime,
      },
      {
        metric: MetricType.steps,
        value: cumulativeSteps,
        unit: 'steps',
        source: 'synthetic-live-stream',
        recordedAt: isoTime,
      },
    ];

    try {
      const res = await VitalsService.ingestReadings(patientId, deviceId, readings);
      const timeStr = now.toLocaleTimeString();
      const alertMsg = res.alertsTriggered > 0 ? ` 🚨 (${res.alertsTriggered} ALERT CREATED)` : '';
      console.log(
        `[${timeStr}] Ingested ${readings.length} readings | Accepted: ${res.accepted} | Dups: ${res.duplicates}${alertMsg}`
      );
    } catch (err: any) {
      console.error(`[${now.toLocaleTimeString()}] ❌ Ingestion error:`, err.message || err);
    }
  };

  // Run initial tick immediately
  await tick();

  // Set interval timer
  const intervalTimer = setInterval(tick, intervalSeconds * 1000);

  // Graceful shutdown on Ctrl+C
  process.on('SIGINT', async () => {
    console.log('\n🛑 Stopping Live Simulation...');
    clearInterval(intervalTimer);
    await prisma.$disconnect();
    process.exit(0);
  });
}

if (require.main === module) {
  startLiveSimulation().catch((err) => {
    console.error('❌ Error starting live simulation:', err);
    prisma.$disconnect();
    process.exit(1);
  });
}
