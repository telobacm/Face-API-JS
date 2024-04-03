/*
  Warnings:

  - The `unit` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `kampus` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KAMPUS" AS ENUM ('Sleman', 'Bantul', 'Yogyakarta', 'GunungKidul', 'Kulonprogo');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "kampus" "KAMPUS" NOT NULL,
ADD COLUMN     "subunit" TEXT,
DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT;

-- DropEnum
DROP TYPE "UNITS";
