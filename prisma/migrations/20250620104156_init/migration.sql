/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_password_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";
