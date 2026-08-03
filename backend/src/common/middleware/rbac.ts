import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { AuthUser } from './auth';

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthUser;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Insufficient permissions',
      });
    }

    // For patient-scoped routes, verify the user owns the resource
    if (user.role === 'patient') {
      const patient = await prisma.patient.findUnique({
        where: { userId: user.uid },
        select: { id: true },
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          data: null,
          error: 'Patient profile not found',
        });
      }

      // Attach patientId to request for use in controllers
      (req as any).patientId = patient.id;
    }

    next();
  };
};

export const requirePatientAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as AuthUser;
  
  if (user.role === 'patient') {
    const patient = await prisma.patient.findUnique({
      where: { userId: user.uid },
      select: { id: true },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Patient profile not found',
      });
    }

    // Check if the requested patientId matches the authenticated patient
    const requestedPatientId = req.params.patientId || req.body.patientId || req.query.patientId;
    
    if (requestedPatientId && requestedPatientId !== patient.id) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Access denied: can only access own data',
      });
    }

    (req as any).patientId = patient.id;
  }

  next();
};