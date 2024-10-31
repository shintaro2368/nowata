/*
  Warnings:

  - You are about to alter the column `totalTime` on the `Work` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Work" ALTER COLUMN "totalTime" SET DATA TYPE INTEGER;
