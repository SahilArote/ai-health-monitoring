-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('patient', 'doctor', 'hospital_admin', 'super_admin');

-- CreateEnum
CREATE TYPE "DevicePlatform" AS ENUM ('health_connect', 'healthkit', 'ble', 'synthetic');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('connected', 'disconnected', 'error');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('heart_rate', 'spo2', 'sleep', 'steps', 'calories', 'distance', 'temperature');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('warning', 'critical');

-- CreateEnum
CREATE TYPE "AlertSource" AS ENUM ('rule', 'ml');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('open', 'acknowledged', 'resolved');

-- CreateEnum
CREATE TYPE "FeedbackLabel" AS ENUM ('true_positive', 'false_positive');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "sex" TEXT NOT NULL,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "conditions" JSONB,
    "assignedDoctorId" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "platform" "DevicePlatform" NOT NULL,
    "deviceName" TEXT NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncAt" TIMESTAMP(3),
    "status" "DeviceStatus" NOT NULL DEFAULT 'connected',

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vitals_readings" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "metricType" "MetricType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vitals_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "source" "AlertSource" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedById" TEXT,
    "feedbackLabel" "FeedbackLabel",

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relation" TEXT NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUid_key" ON "users"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE INDEX "vitals_readings_patientId_metricType_recordedAt_idx" ON "vitals_readings"("patientId", "metricType", "recordedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "vitals_readings_patientId_deviceId_metricType_recordedAt_key" ON "vitals_readings"("patientId", "deviceId", "metricType", "recordedAt");

-- CreateIndex
CREATE INDEX "alerts_patientId_status_createdAt_idx" ON "alerts"("patientId", "status", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_assignedDoctorId_fkey" FOREIGN KEY ("assignedDoctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals_readings" ADD CONSTRAINT "vitals_readings_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals_readings" ADD CONSTRAINT "vitals_readings_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
