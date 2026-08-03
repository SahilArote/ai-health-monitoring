import { Router } from 'express';
import { AlertsController } from './alerts.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { requireRole } from '../../common/middleware/rbac';
import { validate } from '../../common/middleware/validate';
import { queryAlertsSchema, feedbackBodySchema, sosAlertSchema } from '../../common/validators/alert.validators';

const router = Router();

// GET /alerts (patient self)
router.get(
  '/',
  authMiddleware,
  requireRole('patient'),
  validate(queryAlertsSchema),
  AlertsController.listAlerts
);

// PATCH /alerts/:id/acknowledge
router.patch(
  '/:id/acknowledge',
  authMiddleware,
  requireRole('patient'),
  AlertsController.acknowledge
);

// PATCH /alerts/:id/feedback
router.patch(
  '/:id/feedback',
  authMiddleware,
  requireRole('patient'),
  validate(feedbackBodySchema),
  AlertsController.feedback
);

// POST /alerts/sos
router.post(
  '/sos',
  authMiddleware,
  requireRole('patient'),
  validate(sosAlertSchema),
  AlertsController.triggerSOS
);

export default router;
