/*
  Warnings:

  - You are about to drop the column `CardBgColor` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "CardBgColor",
ADD COLUMN     "cardBgColor" TEXT;
