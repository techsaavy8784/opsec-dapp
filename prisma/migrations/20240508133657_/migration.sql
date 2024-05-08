/*
  Warnings:

  - You are about to drop the column `validator_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `validator_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `validators` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SERVER_TYPE" AS ENUM ('MULTI_NODE', 'SINGLE_NODE');

-- CreateEnum
CREATE TYPE "PAY_TYPE" AS ENUM ('FULL', 'PARTIAL');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_id_fkey";

-- DropForeignKey
ALTER TABLE "validators" DROP CONSTRAINT "validators_server_id_fkey";

-- DropForeignKey
ALTER TABLE "validators" DROP CONSTRAINT "validators_type_id_fkey";

-- AlterTable
ALTER TABLE "blockchains" ADD COLUMN     "floor_price" DOUBLE PRECISION,
ADD COLUMN     "pay_type" "PAY_TYPE" NOT NULL DEFAULT 'FULL',
ADD COLUMN     "reward_lock_time" INTEGER,
ADD COLUMN     "reward_per_month" INTEGER,
ADD COLUMN     "reward_wallet" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "validator_id";

-- AlterTable
ALTER TABLE "servers" ADD COLUMN     "type" "SERVER_TYPE" NOT NULL DEFAULT 'MULTI_NODE';

-- DropTable
DROP TABLE "validator_types";

-- DropTable
DROP TABLE "validators";
