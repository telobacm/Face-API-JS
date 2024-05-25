/*
  Warnings:

  - Made the column `name` on table `subunit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_subunitId_fkey";

-- AlterTable
ALTER TABLE "subunit" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "subunitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subunitId_fkey" FOREIGN KEY ("subunitId") REFERENCES "subunit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
