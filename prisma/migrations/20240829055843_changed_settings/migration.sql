/*
  Warnings:

  - Added the required column `workTypeCode` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "workTypeCode" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_workTypeCode_fkey" FOREIGN KEY ("workTypeCode") REFERENCES "WorkType"("code") ON DELETE CASCADE ON UPDATE CASCADE;
