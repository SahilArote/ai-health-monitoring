import { prisma } from '../../config/prisma';
import { DevicePlatform, DeviceStatus } from '@prisma/client';
import { AppError } from '../../common/middleware/error-handler';

export class DevicesService {
  static async connectDevice(
    patientId: string,
    data: { platform: DevicePlatform; deviceName: string }
  ) {
    return prisma.device.create({
      data: {
        patientId,
        platform: data.platform,
        deviceName: data.deviceName,
        status: DeviceStatus.connected,
        connectedAt: new Date(),
      },
    });
  }

  static async listDevices(patientId: string) {
    return prisma.device.findMany({
      where: { patientId },
      orderBy: { connectedAt: 'desc' },
    });
  }

  static async syncDevice(deviceId: string, patientId: string) {
    const device = await prisma.device.findFirst({
      where: { id: deviceId, patientId },
    });

    if (!device) {
      throw new AppError('Device not found or access denied', 404);
    }

    return prisma.device.update({
      where: { id: deviceId },
      data: {
        lastSyncAt: new Date(),
        status: DeviceStatus.connected,
      },
    });
  }
}
