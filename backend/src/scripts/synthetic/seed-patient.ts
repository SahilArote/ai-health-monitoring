import { prisma } from '../../config/prisma';
import { UserRole, DevicePlatform, DeviceStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export const CONFIG_FILE_PATH = path.join(__dirname, 'synthetic-config.json');

export async function seedPatient() {
  console.log('🌱 Checking for synthetic demo patient...');

  const syntheticEmail = 'synthetic@demo.local';
  const syntheticUid = 'synthetic-demo-uid';

  // 1. Check or create User
  let user = await prisma.user.findUnique({
    where: { firebaseUid: syntheticUid },
    include: { patient: { include: { devices: true } } },
  });

  if (!user) {
    console.log('👤 Creating synthetic User & Patient rows...');
    user = await prisma.user.create({
      data: {
        firebaseUid: syntheticUid,
        email: syntheticEmail,
        role: UserRole.patient,
        phone: '+15550009999',
        patient: {
          create: {
            dob: new Date('1992-06-15'),
            sex: 'male',
            heightCm: 178,
            weightKg: 74,
            conditions: ['Mild Hypertension'],
          },
        },
      },
      include: { patient: { include: { devices: true } } },
    });
  } else {
    console.log('✅ Synthetic User & Patient already exist.');
  }

  const patient = user.patient;
  if (!patient) {
    throw new Error('User exists but Patient relation is missing.');
  }

  // 2. Check or create Device
  let device = patient.devices.find((d) => d.platform === DevicePlatform.synthetic);
  if (!device) {
    console.log('⌚ Creating synthetic Device row...');
    device = await prisma.device.create({
      data: {
        patientId: patient.id,
        platform: DevicePlatform.synthetic,
        deviceName: 'Synthetic Demo Device',
        status: DeviceStatus.connected,
        connectedAt: new Date(),
      },
    });
  } else {
    console.log('✅ Synthetic Device already exists.');
  }

  const configData = {
    patientId: patient.id,
    deviceId: device.id,
    email: user.email,
    firebaseUid: user.firebaseUid,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configData, null, 2), 'utf-8');

  console.log('\n🎉 Synthetic patient & device ready!');
  console.log(`- Patient ID: ${patient.id}`);
  console.log(`- Device ID:  ${device.id}`);
  console.log(`- Config saved to: ${CONFIG_FILE_PATH}\n`);

  return configData;
}

if (require.main === module) {
  seedPatient()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error('❌ Error seeding synthetic patient:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
