/*
  Warnings:

  - You are about to drop the column `node_reward_withdraw_time` on the `rewards` table. All the data in the column will be lost.
  - You are about to drop the column `tax_reward` on the `rewards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rewards" DROP COLUMN "node_reward_withdraw_time",
DROP COLUMN "tax_reward",
ADD COLUMN     "reward_withdraw_time" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "tax_histories" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "total_opsec" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_histories_pkey" PRIMARY KEY ("id")
);
