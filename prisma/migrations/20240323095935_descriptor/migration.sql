/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "Descriptor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "faceData" JSONB NOT NULL,

    CONSTRAINT "Descriptor_pkey" PRIMARY KEY ("id")
);
