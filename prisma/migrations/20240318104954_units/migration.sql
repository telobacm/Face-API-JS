/*
  Warnings:

  - Changed the type of `unit` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UNITS" AS ENUM ('Sleman', 'Bantul', 'Yogyakarta', 'GunungKidul', 'Kulonprogo');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "unit",
ADD COLUMN     "unit" "UNITS" NOT NULL;
