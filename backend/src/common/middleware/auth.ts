import { Request, Response, NextFunction } from 'express';
import { auth } from '../../config/firebase';
import { prisma } from '../../config/prisma';

export interface AuthUser {
  uid: string;        // Firebase UID
  role: string;
  userId: string;     // DB User.id
  patientId?: string; // DB Patient.id (only if role=patient)
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    // In development mode, fallback to first patient in DB if header is missing
    if (process.env.NODE_ENV === 'development') {
      const devPatient = await prisma.patient.findFirst({
        include: { user: true },
      });
      if (devPatient) {
        req.user = {
          uid: devPatient.user.firebaseUid,
          role: devPatient.user.role,
          userId: devPatient.user.id,
          patientId: devPatient.id,
        };
        return next();
      }
    }
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Missing or invalid authorization header',
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    let decodedUid = token;
    let decodedRole = 'patient';

    try {
      const decodedToken = await auth.verifyIdToken(token);
      decodedUid = decodedToken.uid;
      decodedRole = decodedToken.role || 'patient';
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // Fallback for dev mode
        const devPatient = await prisma.patient.findFirst({
          include: { user: true },
        });
        if (devPatient) {
          req.user = {
            uid: devPatient.user.firebaseUid,
            role: devPatient.user.role,
            userId: devPatient.user.id,
            patientId: devPatient.id,
          };
          return next();
        }
      }
      throw err;
    }

    // Look up the DB user by Firebase UID
    let dbUser = await prisma.user.findUnique({
      where: { firebaseUid: decodedUid },
      include: { patient: { select: { id: true } } },
    });

    // Dev fallback if user by token UID not found
    if (!dbUser && process.env.NODE_ENV === 'development') {
      dbUser = await prisma.user.findFirst({
        where: { role: 'patient' },
        include: { patient: { select: { id: true } } },
      });
    }

    if (!dbUser) {
      req.user = {
        uid: decodedUid,
        role: decodedRole,
        userId: '',
      };
      return next();
    }

    req.user = {
      uid: dbUser.firebaseUid,
      role: dbUser.role,
      userId: dbUser.id,
      patientId: dbUser.patient?.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid or expired token',
    });
  }
};