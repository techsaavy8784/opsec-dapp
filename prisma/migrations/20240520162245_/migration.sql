/*
  Warnings:

  - You are about to drop the column `node_reward_withdraw_time` on the `rewards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rewards" DROP COLUMN "node_reward_withdraw_time",
ADD COLUMN     "reward_withdraw_time" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "distributor_receive" (
    "id" SERIAL NOT NULL,
    "received_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributor_receive_pkey" PRIMARY KEY ("id")
);
