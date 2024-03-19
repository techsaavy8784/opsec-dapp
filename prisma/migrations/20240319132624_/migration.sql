-- DropForeignKey
ALTER TABLE "reward_reserved" DROP CONSTRAINT "reward_reserved_node_id_fkey";

-- AddForeignKey
ALTER TABLE "reward_reserved" ADD CONSTRAINT "reward_reserved_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
