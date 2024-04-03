/*
  Warnings:

  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `elfsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nip` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `user` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "USER_ROLES" AS ENUM ('SUPERADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "POSITIONS" AS ENUM ('DOSEN', 'STAFF', 'SATPAM');

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "fullname",
DROP COLUMN "image",
DROP COLUMN "password",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nip" TEXT NOT NULL,
ADD COLUMN     "position" "POSITIONS" NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "USER_ROLES" NOT NULL;

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "content";

-- DropTable
DROP TABLE "elfsight";

-- DropTable
DROP TABLE "media";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "social";

-- DropTable
DROP TABLE "team";

-- CreateTable
CREATE TABLE "report" (
    "id" SERIAL NOT NULL,
    "datang" TIMESTAMP(3) NOT NULL,
    "pulang" TIMESTAMP(3) NOT NULL,
    "ekspresi" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
