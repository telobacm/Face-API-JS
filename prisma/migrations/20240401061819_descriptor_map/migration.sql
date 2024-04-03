/*
  Warnings:

  - You are about to drop the `Descriptor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Descriptor";

-- CreateTable
CREATE TABLE "descriptor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "faceData" JSONB NOT NULL,

    CONSTRAINT "descriptor_pkey" PRIMARY KEY ("id")
);
