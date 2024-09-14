-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "maximumWorkTime" DECIMAL(65,30),
ADD COLUMN     "minimumWorkTime" DECIMAL(65,30),
ADD COLUMN     "standardWorkTime" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Work" ALTER COLUMN "totalTime" SET DATA TYPE DECIMAL(65,30);
