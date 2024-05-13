/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_userId_fkey";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "kampus" TEXT NOT NULL,
    "role" "USER_ROLES" NOT NULL,
    "position" "POSITIONS" NOT NULL,
    "gender" TEXT NOT NULL,
    "unit" TEXT,
    "subunit" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_nip_key" ON "users"("nip");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
