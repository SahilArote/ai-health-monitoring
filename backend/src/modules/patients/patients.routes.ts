import { Router } from 'express';
import { PatientsController } from './patients.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { requireRole } from '../../common/middleware/rbac';
import { validate } from '../../common/middleware/validate';
import {
  createPatientSchema,
  updatePatientSchema,
  createEmergencyContactSchema,
} from '../../common/validators/patient.validators';

const router = Router();

// POST /patients (post-signup registration, no role check yet)
router.post(
  '/',
  authMiddleware,
  validate(createPatientSchema),
  PatientsController.createPatient
);

// GET /patients/me (own profile)
router.get(
  '/me',
  authMiddleware,
  requireRole('patient'),
  PatientsController.getMe
);

// PATCH /patients/me (update profile)
router.patch(
  '/me',
  authMiddleware,
  requireRole('patient'),
  validate(updatePatientSchema),
  PatientsController.updateMe
);

// POST /patients/me/emergency-contacts
router.post(
  '/me/emergency-contacts',
  authMiddleware,
  requireRole('patient'),
  validate(createEmergencyContactSchema),
  PatientsController.addEmergencyContact
);

// GET /patients/me/emergency-contacts
router.get(
  '/me/emergency-contacts',
  authMiddleware,
  requireRole('patient'),
  PatientsController.getEmergencyContacts
);

export default router;
