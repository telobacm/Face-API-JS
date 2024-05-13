/*
  Warnings:

  - You are about to drop the column `datang` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `pulang` on the `report` table. All the data in the column will be lost.
  - Added the required column `enterExit` to the `report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ENTER_EXIT" AS ENUM ('Masuk', 'Pulang');

-- CreateEnum
CREATE TYPE "SHIFT_SATPAM" AS ENUM ('Shift1', 'Shift2', 'Shift3');

-- AlterTable
ALTER TABLE "report" DROP COLUMN "datang",
DROP COLUMN "pulang",
ADD COLUMN     "ShiftSatpam" "SHIFT_SATPAM",
ADD COLUMN     "enterExit" "ENTER_EXIT" NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Roles";
