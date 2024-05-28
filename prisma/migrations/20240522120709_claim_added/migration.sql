/*
  Warnings:

  - You are about to alter the column `price` on the `blockchains` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "SERVER_TYPE" AS ENUM ('MULTI_NODE', 'SINGLE_NODE');

-- CreateEnum
CREATE TYPE "PAY_TYPE" AS ENUM ('FULL', 'PARTIAL');

-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_server_id_fkey";

-- AlterTable
ALTER TABLE "blockchains" ADD COLUMN     "floor_price" INTEGER,
ADD COLUMN     "pay_type" "PAY_TYPE" NOT NULL DEFAULT 'FULL',
ADD COLUMN     "reward_lock_time" INTEGER,
ADD COLUMN     "reward_per_month" INTEGER,
ADD COLUMN     "reward_wallet" TEXT,
ADD COLUMN     "staking" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "nodes" ALTER COLUMN "server_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "servers" ADD COLUMN     "type" "SERVER_TYPE" NOT NULL DEFAULT 'MULTI_NODE';

-- CreateTable
CREATE TABLE "claims" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tax_reward" INTEGER,
    "reflection_reward" INTEGER,
    "node_reward_withdraw_time" TIMESTAMP(3),

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
