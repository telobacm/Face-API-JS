/*
  Warnings:

  - You are about to drop the column `unitId` on the `subunit` table. All the data in the column will be lost.
  - You are about to drop the column `kampusId` on the `unit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subunit" DROP CONSTRAINT "subunit_unitId_fkey";

-- DropForeignKey
ALTER TABLE "unit" DROP CONSTRAINT "unit_kampusId_fkey";

-- AlterTable
ALTER TABLE "subunit" DROP COLUMN "unitId";

-- AlterTable
ALTER TABLE "unit" DROP COLUMN "kampusId";
