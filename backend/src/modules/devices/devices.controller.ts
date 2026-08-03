import { Request, Response, NextFunction } from 'express';
import { DevicesService } from './devices.service';
import { sendSuccess } from '../../common/utils/response';
import { AppError } from '../../common/middleware/error-handler';

export class DevicesController {
  static async connectDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const device = await DevicesService.connectDevice(patientId, req.body);
      return sendSuccess(res, device, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const devices = await DevicesService.listDevices(patientId);
      return sendSuccess(res, devices);
    } catch (err) {
      next(err);
    }
  }

  static async syncDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      const { id } = req.params;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const updated = await DevicesService.syncDevice(id, patientId);
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }
}
