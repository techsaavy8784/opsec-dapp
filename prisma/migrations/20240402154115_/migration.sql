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

-- CreateTable
CREATE TABLE "claims" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TYPE "Unit" AS ENUM ('ETH');
-- CreateTable
CREATE TABLE "validator_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reward_lock_time" INTEGER NOT NULL,
    "reward_per_month" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "price_unit" "Unit" NOT NULL DEFAULT 'ETH',
    "reward_wallet" TEXT NOT NULL,
    "floor_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "validator_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "validators" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "server_id" INTEGER NULL,
    "purchase_time" TIMESTAMP(3) NULL DEFAULT NULL,

    CONSTRAINT "validators_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rewards" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tax_reward" INTEGER NULL,
    "reflection_reward" INTEGER NULL,
    "node_reward_withdraw_time" TIMESTAMP(3) NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "payments" ADD COLUMN     "validator_id" INTEGER;
ALTER TABLE "payments" ADD COLUMN     "user_id" INTEGER;
-- AddForeignKey
ALTER TABLE "validators" ADD CONSTRAINT "validators_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "validator_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "validators" ADD CONSTRAINT "validators_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_validator_id_fkey" FOREIGN KEY ("validator_id") REFERENCES "validators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
