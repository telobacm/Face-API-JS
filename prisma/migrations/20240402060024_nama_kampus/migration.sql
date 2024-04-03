/*
  Warnings:

  - The values [Sleman,Bantul,Yogyakarta,Kulonprogo] on the enum `KAMPUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KAMPUS_new" AS ENUM ('Karangmalang', 'JlKenari', 'JlBantul', 'Wates', 'GunungKidul');
ALTER TABLE "user" ALTER COLUMN "kampus" TYPE "KAMPUS_new" USING ("kampus"::text::"KAMPUS_new");
ALTER TYPE "KAMPUS" RENAME TO "KAMPUS_old";
ALTER TYPE "KAMPUS_new" RENAME TO "KAMPUS";
DROP TYPE "KAMPUS_old";
COMMIT;
