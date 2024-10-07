/*
  Warnings:

  - You are about to drop the column `standardEndWorkTime` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `standardStartWorkTime` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "standardEndWorkTime",
DROP COLUMN "standardStartWorkTime",
ADD COLUMN     "standardEndWorkHour" INTEGER,
ADD COLUMN     "standardEndWorkMinute" INTEGER,
ADD COLUMN     "standardStartWorkHour" INTEGER,
ADD COLUMN     "standardStartWorkMinute" INTEGER;
