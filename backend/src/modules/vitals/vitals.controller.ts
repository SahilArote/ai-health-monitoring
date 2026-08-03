import { Request, Response, NextFunction } from 'express';
import { VitalsService } from './vitals.service';
import { sendSuccess } from '../../common/utils/response';
import { AppError } from '../../common/middleware/error-handler';

export class VitalsController {
  static async ingest(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const { deviceId, readings } = req.body;
      const result = await VitalsService.ingestReadings(patientId, deviceId, readings);

      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async query(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.params;
      const { metric, from, to } = req.query as any;

      // Ownership check for patients
      if (req.user?.role === 'patient' && req.user.patientId !== patientId) {
        throw new AppError('Forbidden: Patients can only view their own vitals', 403);
      }

      const readings = await VitalsService.queryVitals(patientId, { metric, from, to });
      return sendSuccess(res, readings);
    } catch (err) {
      next(err);
    }
  }
}
