import { z } from 'zod';

export const createPatientSchema = z.object({
  body: z.object({
    dob: z.string().datetime({ message: 'Invalid ISO date string for dob' }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    sex: z.enum(['male', 'female', 'other', 'Male', 'Female', 'Other']),
    heightCm: z.number().positive().optional(),
    weightKg: z.number().positive().optional(),
    conditions: z.any().optional(),
    phone: z.string().optional(),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    dob: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    sex: z.enum(['male', 'female', 'other', 'Male', 'Female', 'Other']).optional(),
    heightCm: z.number().positive().optional(),
    weightKg: z.number().positive().optional(),
    conditions: z.any().optional(),
    phone: z.string().optional(),
  }),
});

export const createEmergencyContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(5, 'Valid phone number required'),
    relation: z.string().min(1, 'Relation is required'),
  }),
});
