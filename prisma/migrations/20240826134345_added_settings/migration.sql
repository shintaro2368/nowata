-- AlterTable
ALTER TABLE "DailyReport" ALTER COLUMN "breakTime" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "standardStartWorkTime" TIMESTAMP(3),
    "standardEndWorkTime" TIMESTAMP(3),
    "standardBreakTime" DECIMAL(65,30),
    "defaultWorkDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_userId_key" ON "Setting"("userId");

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
