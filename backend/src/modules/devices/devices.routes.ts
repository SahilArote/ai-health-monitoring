import { Router } from 'express';
import { DevicesController } from './devices.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { requireRole } from '../../common/middleware/rbac';
import { validate } from '../../common/middleware/validate';
import { connectDeviceSchema } from '../../common/validators/device.validators';

const router = Router();

// POST /devices/connect
router.post(
  '/connect',
  authMiddleware,
  requireRole('patient'),
  validate(connectDeviceSchema),
  DevicesController.connectDevice
);

// GET /devices
router.get(
  '/',
  authMiddleware,
  requireRole('patient'),
  DevicesController.listDevices
);

// PATCH /devices/:id/sync
router.patch(
  '/:id/sync',
  authMiddleware,
  requireRole('patient'),
  DevicesController.syncDevice
);

export default router;
