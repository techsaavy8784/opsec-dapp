-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'REWARD_RESERVED';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "stake_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "reward_reserved" (
    "id" SERIAL NOT NULL,
    "node_id" INTEGER NOT NULL,
    "stake_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_reserved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reward_reserved_node_id_key" ON "reward_reserved"("node_id");

-- AddForeignKey
ALTER TABLE "reward_reserved" ADD CONSTRAINT "reward_reserved_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
