import { prisma } from '../../config/prisma';
import { auth } from '../../config/firebase';
import { AppError } from '../../common/middleware/error-handler';
import { UserRole, Prisma } from '@prisma/client';

export class PatientsService {
  static async createPatientProfile(
    firebaseUid: string,
    email: string,
    data: {
      dob: string;
      sex: string;
      heightCm?: number;
      weightKg?: number;
      conditions?: any;
      phone?: string;
    }
  ) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid },
      include: { patient: true },
    });

    if (existingUser?.patient) {
      throw new AppError('Patient profile already exists for this account', 400);
    }

    // Set custom claim in Firebase Admin SDK
    try {
      if (auth) {
        await auth.setCustomUserClaims(firebaseUid, { role: 'patient' });
      }
    } catch (err) {
      console.warn('Could not set custom claim in Firebase (offline or mock):', err);
    }

    // Create User & Patient in transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = existingUser
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: { role: UserRole.patient, phone: data.phone || existingUser.phone },
          })
        : await tx.user.create({
            data: {
              firebaseUid,
              email,
              role: UserRole.patient,
              phone: data.phone,
            },
          });

      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          dob: new Date(data.dob),
          sex: data.sex.toLowerCase(),
          heightCm: data.heightCm,
          weightKg: data.weightKg,
          conditions: data.conditions || [],
        },
        include: {
          user: {
            select: { id: true, email: true, role: true, phone: true, createdAt: true },
          },
        },
      });

      return patient;
    });

    return result;
  }

  static async getPatientByUserId(userId: string) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, phone: true, role: true } },
        emergencyContacts: true,
        devices: true,
      },
    });

    if (!patient) {
      throw new AppError('Patient profile not found', 44);
    }

    return patient;
  }

  static async updatePatientProfile(
    patientId: string,
    data: {
      dob?: string;
      sex?: string;
      heightCm?: number;
      weightKg?: number;
      conditions?: any;
      phone?: string;
    }
  ) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    if (data.phone) {
      await prisma.user.update({
        where: { id: patient.userId },
        data: { phone: data.phone },
      });
    }

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: {
        ...(data.dob && { dob: new Date(data.dob) }),
        ...(data.sex && { sex: data.sex.toLowerCase() }),
        ...(data.heightCm !== undefined && { heightCm: data.heightCm }),
        ...(data.weightKg !== undefined && { weightKg: data.weightKg }),
        ...(data.conditions !== undefined && { conditions: data.conditions }),
      },
      include: {
        user: { select: { id: true, email: true, phone: true } },
      },
    });

    return updated;
  }

  static async addEmergencyContact(
    patientId: string,
    data: { name: string; phone: string; relation: string }
  ) {
    const count = await prisma.emergencyContact.count({ where: { patientId } });
    if (count >= 3) {
      throw new AppError('Maximum of 3 emergency contacts allowed', 400);
    }

    return prisma.emergencyContact.create({
      data: {
        patientId,
        name: data.name,
        phone: data.phone,
        relation: data.relation,
      },
    });
  }

  static async getEmergencyContacts(patientId: string) {
    return prisma.emergencyContact.findMany({
      where: { patientId },
    });
  }
}
