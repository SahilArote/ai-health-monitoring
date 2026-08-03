import { Router } from 'express';
import { VitalsController } from './vitals.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { requireRole } from '../../common/middleware/rbac';
import { validate } from '../../common/middleware/validate';
import { vitalsRateLimiter } from '../../common/middleware/rate-limit';
import { ingestVitalsSchema, queryVitalsSchema } from '../../common/validators/vitals.validators';

const router = Router();

// POST /vitals/ingest (patient only, rate limited)
router.post(
  '/ingest',
  authMiddleware,
  requireRole('patient'),
  vitalsRateLimiter,
  validate(ingestVitalsSchema),
  VitalsController.ingest
);

// GET /vitals/:patientId/trends (daily aggregated trend data)
router.get(
  '/:patientId/trends',
  authMiddleware,
  requireRole('patient', 'doctor'),
  VitalsController.queryTrends
);

// GET /vitals/:patientId (patient self or doctor)
router.get(
  '/:patientId',
  authMiddleware,
  requireRole('patient', 'doctor'),
  validate(queryVitalsSchema),
  VitalsController.query
);

export default router;
