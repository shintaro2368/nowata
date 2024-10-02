/*
  Warnings:

  - You are about to drop the column `workTypeCode` on the `DailyReport` table. All the data in the column will be lost.
  - You are about to drop the `WorkType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workStyle` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkStyle" AS ENUM ('AtCompany', 'AtHome', 'Absent', 'DayOff');

-- DropForeignKey
ALTER TABLE "DailyReport" DROP CONSTRAINT "DailyReport_workTypeCode_fkey";

-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_workTypeCode_fkey";

-- AlterTable
ALTER TABLE "DailyReport" DROP COLUMN "workTypeCode",
ADD COLUMN     "workStyle" "WorkStyle" NOT NULL;

-- DropTable
DROP TABLE "WorkType";
