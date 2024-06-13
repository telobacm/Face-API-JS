/*
  Warnings:

  - A unique constraint covering the columns `[mac]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "devices_mac_key" ON "devices"("mac");
