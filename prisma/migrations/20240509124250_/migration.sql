/*
  Warnings:

  - Made the column `node_id` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_server_id_fkey";

-- AlterTable
ALTER TABLE "nodes" ALTER COLUMN "server_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "node_id" SET NOT NULL;

-- DropEnum
DROP TYPE "Unit";

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
