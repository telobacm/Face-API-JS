/*
  Warnings:

  - You are about to drop the column `link` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "content" DROP COLUMN "link",
DROP COLUMN "tag",
ADD COLUMN     "sub" TEXT;
