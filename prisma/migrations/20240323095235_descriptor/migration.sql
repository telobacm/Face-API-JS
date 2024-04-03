-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "faceData" JSONB NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);
