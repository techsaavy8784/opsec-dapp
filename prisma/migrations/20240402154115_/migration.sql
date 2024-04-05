-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "stake_id" TEXT;

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_node_id_fkey";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "stakings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stake_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stakings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stakings" ADD CONSTRAINT "stakings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
