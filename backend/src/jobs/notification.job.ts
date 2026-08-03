import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis';

export const NOTIFICATION_QUEUE_NAME = 'notification-queue';

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: redis as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
});

export const enqueueNotificationJob = async (payload: {
  alertId: string;
  patientId: string;
  type: string;
  severity: string;
  location?: { latitude?: number; longitude?: number };
}) => {
  try {
    await notificationQueue.add('send-alert-notification', payload);
    console.log(`[Job Enqueued] Notification job for alert ${payload.alertId}`);
  } catch (err) {
    console.warn('[Job Stub] Notification fallback log (Redis queue bypass):', payload);
  }
};

// Worker stub (Phase 1 placeholder — full worker in later phase)
export const notificationWorker = new Worker(
  NOTIFICATION_QUEUE_NAME,
  async (job) => {
    console.log(`[Worker Stub] Processing notification job ${job.id}:`, job.data);
    // Future Phase: trigger FCM push notification, SMS (Twilio/MSG91), email (SendGrid)
  },
  { connection: redis as any, autorun: false }
);
