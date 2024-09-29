/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'DOING', 'DONE');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_statusCode_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';

-- DropTable
DROP TABLE "Status";
