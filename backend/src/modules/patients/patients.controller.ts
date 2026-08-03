import { Request, Response, NextFunction } from 'express';
import { PatientsService } from './patients.service';
import { sendSuccess } from '../../common/utils/response';
import { AppError } from '../../common/middleware/error-handler';

export class PatientsController {
  static async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) {
        throw new AppError('Unauthorized: Firebase UID missing', 401);
      }

      // Email might come from decoded token or body
      const email = (req as any).userEmail || `${firebaseUid}@patient.local`;

      const patient = await PatientsService.createPatientProfile(
        firebaseUid,
        email,
        req.body
      );

      return sendSuccess(res, patient, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Patient profile not found or user not linked', 404);
      }

      const patient = await PatientsService.getPatientByUserId(userId);
      return sendSuccess(res, patient);
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const updated = await PatientsService.updatePatientProfile(patientId, req.body);
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async addEmergencyContact(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const contact = await PatientsService.addEmergencyContact(patientId, req.body);
      return sendSuccess(res, contact, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getEmergencyContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const contacts = await PatientsService.getEmergencyContacts(patientId);
      return sendSuccess(res, contacts);
    } catch (err) {
      next(err);
    }
  }

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user?.patientId;
      if (!patientId) {
        throw new AppError('Patient profile not found', 404);
      }

      const summary = await PatientsService.getPatientSummary(patientId);
      return sendSuccess(res, summary);
    } catch (err) {
      next(err);
    }
  }
}
