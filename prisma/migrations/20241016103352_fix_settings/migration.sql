/*
  Warnings:

  - You are about to drop the column `maximumWorkHour` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `maximumWorkMinute` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `minimumWorkHour` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `minimumWorkMinute` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `standardWorkHour` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `standardWorkMinute` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "maximumWorkHour" INTEGER,
ADD COLUMN     "maximumWorkMinute" INTEGER,
ADD COLUMN     "minimumWorkHour" INTEGER,
ADD COLUMN     "minimumWorkMinute" INTEGER,
ADD COLUMN     "standardWorkHour" INTEGER,
ADD COLUMN     "standardWorkMinute" INTEGER;

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "maximumWorkHour",
DROP COLUMN "maximumWorkMinute",
DROP COLUMN "minimumWorkHour",
DROP COLUMN "minimumWorkMinute",
DROP COLUMN "standardWorkHour",
DROP COLUMN "standardWorkMinute",
ADD COLUMN     "useStandardTime" BOOLEAN NOT NULL DEFAULT false;
