/*
  Warnings:

  - You are about to drop the column `desc` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "desc",
ADD COLUMN     "description" TEXT;
