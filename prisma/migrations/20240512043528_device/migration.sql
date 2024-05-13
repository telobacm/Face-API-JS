-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "kampus" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "mac" TEXT NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_id_key" ON "devices"("id");
