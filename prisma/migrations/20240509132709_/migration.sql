/*
  Warnings:

  - You are about to drop the column `kampus` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `reports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `reports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "kampus",
DROP COLUMN "unit",
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "isPunctual" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reports_id_key" ON "reports"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_nip_key" ON "user"("nip");
