/*
  Warnings:

  - You are about to drop the column `server_id` on the `nodes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serverId]` on the table `nodes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serverId` to the `nodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tx` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_server_id_fkey";

-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "server_id",
ADD COLUMN     "serverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "tx" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "nodes_serverId_key" ON "nodes"("serverId");

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
