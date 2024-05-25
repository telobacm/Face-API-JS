/*
  Warnings:

  - Added the required column `position` to the `subunit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subunit" ADD COLUMN     "position" "POSITIONS" NOT NULL;
