/*
  Warnings:

  - You are about to drop the column `userId` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `workTypeCode` on the `Setting` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[projectId]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_userId_fkey";

-- DropIndex
DROP INDEX "Setting_userId_key";

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "userId",
DROP COLUMN "workTypeCode",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';

-- CreateIndex
CREATE UNIQUE INDEX "Setting_projectId_key" ON "Setting"("projectId");

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
