/*
  Warnings:

  - You are about to drop the column `status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `has_wallet` on the `servers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blockchains" ADD COLUMN     "has_wallet" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "servers" DROP COLUMN "has_wallet";

-- DropEnum
DROP TYPE "Role";
