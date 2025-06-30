/*
  Warnings:

  - The `lang` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('pt', 'en');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lang",
ADD COLUMN     "lang" "Language" NOT NULL DEFAULT 'pt';
