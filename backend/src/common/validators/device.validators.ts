import { z } from 'zod';
import { DevicePlatform } from '@prisma/client';

export const connectDeviceSchema = z.object({
  body: z.object({
    platform: z.nativeEnum(DevicePlatform),
    deviceName: z.string().min(1, 'Device name is required'),
  }),
});
