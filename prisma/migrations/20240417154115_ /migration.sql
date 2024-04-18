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

    CONSTRAINT "validator_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "validators" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "server_id" INTEGER NULL,
    "purchase_time" TIMESTAMP(3) NULL DEFAULT NULL,

    CONSTRAINT "validators_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "payments" ADD COLUMN     "validator_id" INTEGER;
-- AddForeignKey
ALTER TABLE "validators" ADD CONSTRAINT "validators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "validators" ADD CONSTRAINT "validators_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "validator_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "validators" ADD CONSTRAINT "validators_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_id_fkey" FOREIGN KEY ("validator_id") REFERENCES "validators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;