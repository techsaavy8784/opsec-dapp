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
    "server_id" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "wallet" TEXT,
    "is_live" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" SERIAL NOT NULL,
    "ssh" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "has_wallet" BOOLEAN NOT NULL,
    "blockchain_id" INTEGER NOT NULL,

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchains" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "launched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blockchains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_paymentId_key" ON "nodes"("paymentId");

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_blockchain_id_fkey" FOREIGN KEY ("blockchain_id") REFERENCES "blockchains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
