-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpCodeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "otpEnable" BOOLEAN NOT NULL DEFAULT false;
