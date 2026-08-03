import { Request, Response, NextFunction } from 'express';
import { AlertsService } from './alerts.service';
import { sendSuccess } from '../../common/utils/response';
import { AppError } from '../../common/middleware/error-handler';

export class AlertsController {
  static async listAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const { status, severity, page, limit } = req.query as any;
      const result = await AlertsService.listAlerts(patientId, { status, severity, page, limit });

      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async acknowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      const { id } = req.params;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const updated = await AlertsService.acknowledgeAlert(id, patientId);
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async feedback(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      const { id } = req.params;
      const { label } = req.body;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const updated = await AlertsService.submitFeedback(id, patientId, label);
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async triggerSOS(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const { latitude, longitude } = req.body || {};
      const alert = await AlertsService.createSOS(patientId, { latitude, longitude });

      return sendSuccess(res, alert, 201);
    } catch (err) {
      next(err);
    }
  }
}
