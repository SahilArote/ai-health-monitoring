import { z } from 'zod';
import { MetricType } from '@prisma/client';

export const vitalReadingSchema = z.object({
  metric: z.nativeEnum(MetricType),
  value: z.number(),
  unit: z.string(),
  source: z.string().optional().default('wearable'),
  recordedAt: z.string().datetime({ message: 'recordedAt must be a valid ISO date string' }),
});

export const ingestVitalsSchema = z.object({
  body: z.object({
    deviceId: z.string().min(1, 'deviceId is required'),
    readings: z.array(vitalReadingSchema).min(1, 'At least one reading is required'),
  }),
});

export const queryVitalsSchema = z.object({
  params: z.object({
    patientId: z.string().min(1, 'patientId path parameter is required'),
  }),
  query: z.object({
    metric: z.nativeEnum(MetricType).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }),
});
