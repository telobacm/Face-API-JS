/*
  Warnings:

  - You are about to drop the column `faceData` on the `descriptors` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `descriptors` table. All the data in the column will be lost.
  - You are about to drop the column `nip` on the `descriptors` table. All the data in the column will be lost.
  - Added the required column `descriptors` to the `descriptors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `descriptors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "descriptors" DROP COLUMN "faceData",
DROP COLUMN "name",
DROP COLUMN "nip",
ADD COLUMN     "descriptors" JSONB NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL;
