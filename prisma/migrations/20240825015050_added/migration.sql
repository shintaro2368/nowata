/*
  Warnings:

  - You are about to drop the column `completed` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[selecterId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "selecterId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "completed";

-- CreateIndex
CREATE UNIQUE INDEX "Project_selecterId_key" ON "Project"("selecterId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_selecterId_fkey" FOREIGN KEY ("selecterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
