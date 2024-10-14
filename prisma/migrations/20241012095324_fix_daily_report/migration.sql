/*
  Warnings:

  - You are about to drop the column `breakTime` on the `DailyReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyReport" DROP COLUMN "breakTime",
ADD COLUMN     "breakTimeHour" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "breakTimeMinute" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workTimeHour" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workTimeMinute" INTEGER NOT NULL DEFAULT 0;
