-- CreateTable
CREATE TABLE "validator_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reward_lock_time" INTEGER NOT NULL,
    "reward_per_month" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "price_unit" DOUBLE PRECISION NOT NULL,
    "reward_wallet" TEXT NOT NULL,

    CONSTRAINT "validator_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "validators" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NULL,
    "purchase_time" TIMESTAMP(3) DEFAULT NULL,

    CONSTRAINT "validators_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "payments" ADD COLUMN     "validator_id" TEXT;
