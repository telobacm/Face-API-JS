/*
  Warnings:

  - You are about to drop the `descriptor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "descriptor";

-- CreateTable
CREATE TABLE "descriptors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "faceData" JSONB NOT NULL,

    CONSTRAINT "descriptors_pkey" PRIMARY KEY ("id")
);
