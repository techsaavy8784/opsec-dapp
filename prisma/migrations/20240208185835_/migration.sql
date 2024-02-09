/*
  Warnings:

  - You are about to drop the column `paymentId` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `serverId` on the `nodes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `nodes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[server_id]` on the table `nodes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_id` to the `nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `server_id` to the `nodes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_serverId_fkey";

-- DropIndex
DROP INDEX "nodes_paymentId_key";

-- DropIndex
DROP INDEX "nodes_serverId_key";

-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "paymentId",
DROP COLUMN "serverId",
ADD COLUMN     "payment_id" INTEGER NOT NULL,
ADD COLUMN     "server_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "nodes_payment_id_key" ON "nodes"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_server_id_key" ON "nodes"("server_id");

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
