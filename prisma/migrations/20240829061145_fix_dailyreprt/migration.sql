/*
  Warnings:

  - Made the column `breakTime` on table `DailyReport` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DailyReport" ALTER COLUMN "breakTime" SET NOT NULL;
