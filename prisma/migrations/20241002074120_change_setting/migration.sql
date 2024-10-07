/*
  Warnings:

  - You are about to drop the column `maximumWorkTime` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `minimumWorkTime` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `standardBreakTime` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `standardWorkTime` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "maximumWorkTime",
DROP COLUMN "minimumWorkTime",
DROP COLUMN "standardBreakTime",
DROP COLUMN "standardWorkTime",
ADD COLUMN     "maximumWorkHour" INTEGER,
ADD COLUMN     "maximumWorkMinute" INTEGER,
ADD COLUMN     "minimumWorkHour" INTEGER,
ADD COLUMN     "minimumWorkMinute" INTEGER,
ADD COLUMN     "standardBreakHour" INTEGER,
ADD COLUMN     "standardBreakMinute" INTEGER,
ADD COLUMN     "standardWorkHour" INTEGER,
ADD COLUMN     "standardWorkMinute" INTEGER;
