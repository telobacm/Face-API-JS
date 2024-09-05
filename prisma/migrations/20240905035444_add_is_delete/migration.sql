/*
  Warnings:

  - Added the required column `kampusId` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "kampusId" INTEGER NOT NULL,
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_kampusId_fkey" FOREIGN KEY ("kampusId") REFERENCES "kampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
