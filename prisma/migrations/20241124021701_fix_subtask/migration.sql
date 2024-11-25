/*
  Warnings:

  - Added the required column `updateAt` to the `SubTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
