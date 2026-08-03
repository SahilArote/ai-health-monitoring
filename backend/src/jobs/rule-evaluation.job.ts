import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis';

export const RULE_EVAL_QUEUE_NAME = 'rule-evaluation-queue';

export const ruleEvalQueue = new Queue(RULE_EVAL_QUEUE_NAME, {
  connection: redis as any,
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: true,
  },
});

export const enqueueRuleEvalJob = async (payload: {
  patientId: string;
  readingsCount: number;
}) => {
  try {
    await ruleEvalQueue.add('evaluate-vitals-rules', payload);
  } catch (err) {
    console.warn('[Job Stub] Rule eval queue bypass:', payload);
  }
};

// Worker stub (Phase 1 placeholder — inline rule check in vitals.service covers Phase 1)
export const ruleEvalWorker = new Worker(
  RULE_EVAL_QUEUE_NAME,
  async (job) => {
    console.log(`[Worker Stub] Processing rule evaluation job ${job.id}:`, job.data);
  },
  { connection: redis as any, autorun: false }
);
