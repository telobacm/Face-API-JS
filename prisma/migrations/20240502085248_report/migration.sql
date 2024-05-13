/*
  Warnings:

  - You are about to drop the column `ShiftSatpam` on the `reports` table. All the data in the column will be lost.
  - Added the required column `kampus` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `kampus` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "ShiftSatpam",
ADD COLUMN     "kampus" TEXT NOT NULL,
ADD COLUMN     "shiftSatpam" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "kampus",
ADD COLUMN     "kampus" TEXT NOT NULL;

-- DropEnum
DROP TYPE "KAMPUS";

-- DropEnum
DROP TYPE "SHIFT_SATPAM";
