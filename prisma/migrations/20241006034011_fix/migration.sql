/*
  Warnings:

  - Added the required column `reportType` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('Common', 'Project');

-- AlterTable
ALTER TABLE "DailyReport" ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "reportType" "ReportType" NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
