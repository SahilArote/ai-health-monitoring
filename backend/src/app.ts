import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import patientsRoutes from './modules/patients/patients.routes';
import devicesRoutes from './modules/devices/devices.routes';
import vitalsRoutes from './modules/vitals/vitals.routes';
import alertsRoutes from './modules/alerts/alerts.routes';
import { errorHandler } from './common/middleware/error-handler';
import { sendSuccess } from './common/utils/response';

const app = express();

// Security & Body Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/health', (req, res) => {
  return sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ai-health-backend',
  });
});

// API Routes (Phase 1)
app.use('/patients', patientsRoutes);
app.use('/devices', devicesRoutes);
app.use('/vitals', vitalsRoutes);
app.use('/alerts', alertsRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
