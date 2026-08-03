import { z } from 'zod';
import { AlertSeverity, AlertStatus, FeedbackLabel } from '@prisma/client';

export const queryAlertsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(AlertStatus).optional(),
    severity: z.nativeEnum(AlertSeverity).optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  }),
});

export const feedbackBodySchema = z.object({
  body: z.object({
    label: z.nativeEnum(FeedbackLabel),
  }),
});

export const sosAlertSchema = z.object({
  body: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
});
