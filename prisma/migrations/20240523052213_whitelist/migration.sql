/*
  Warnings:

  - You are about to drop the column `kampus` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `kampus` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subunit` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `users` table. All the data in the column will be lost.
  - Added the required column `kampusId` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kampusId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subunitId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "kampus",
DROP COLUMN "unit",
ADD COLUMN     "kampusId" INTEGER NOT NULL,
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "kampus",
DROP COLUMN "subunit",
DROP COLUMN "unit",
ADD COLUMN     "kampusId" INTEGER NOT NULL,
ADD COLUMN     "subunitId" INTEGER NOT NULL,
ADD COLUMN     "unitId" INTEGER NOT NULL,
ADD COLUMN     "whitelist" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "kampus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "kampus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "kampusId" INTEGER NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subunit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "subunit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kampus_id_key" ON "kampus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "unit_id_key" ON "unit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "subunit_id_key" ON "subunit"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_kampusId_fkey" FOREIGN KEY ("kampusId") REFERENCES "kampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subunitId_fkey" FOREIGN KEY ("subunitId") REFERENCES "subunit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_kampusId_fkey" FOREIGN KEY ("kampusId") REFERENCES "kampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subunit" ADD CONSTRAINT "subunit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_kampusId_fkey" FOREIGN KEY ("kampusId") REFERENCES "kampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
