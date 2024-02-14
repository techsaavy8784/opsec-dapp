-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'INSTALLING', 'LIVE', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nodes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "server_id" INTEGER NOT NULL,
    "wallet" TEXT,
    "status" "Status" NOT NULL DEFAULT 'CREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_histories" (
    "id" SERIAL NOT NULL,
    "node_id" INTEGER NOT NULL,
    "message" TEXT,
    "status" "Status" NOT NULL DEFAULT 'CREATED',

    CONSTRAINT "node_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" SERIAL NOT NULL,
    "host" TEXT NOT NULL DEFAULT '',
    "port" INTEGER NOT NULL DEFAULT 22,
    "username" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL,
    "blockchain_id" INTEGER NOT NULL,

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "tx" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchains" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "has_wallet" BOOLEAN NOT NULL DEFAULT false,
    "launched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blockchains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_payment_id_key" ON "nodes"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_server_id_key" ON "nodes"("server_id");

-- CreateIndex
CREATE UNIQUE INDEX "node_histories_node_id_key" ON "node_histories"("node_id");

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_histories" ADD CONSTRAINT "node_histories_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_blockchain_id_fkey" FOREIGN KEY ("blockchain_id") REFERENCES "blockchains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
