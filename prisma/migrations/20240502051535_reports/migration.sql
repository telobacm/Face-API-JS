/*
  Warnings:

  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_userId_fkey";

-- DropTable
DROP TABLE "report";

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "enterExit" "ENTER_EXIT" NOT NULL,
    "isPunctual" TEXT NOT NULL,
    "ShiftSatpam" "SHIFT_SATPAM",
    "ekspresi" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
