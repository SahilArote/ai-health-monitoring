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
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Missing or invalid authorization header',
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const role = decodedToken.role || '';

    // Look up the DB user by Firebase UID
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: { patient: { select: { id: true } } },
    });

    // For POST /patients (signup), the user may not exist in DB yet
    // In that case, attach minimal info and let the route handle it
    if (!dbUser) {
      req.user = {
        uid: decodedToken.uid,
        role: role,
        userId: '',
      };
      return next();
    }

    req.user = {
      uid: decodedToken.uid,
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