-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'INSTALLING', 'LIVE', 'FAILED');

-- CreateTable
CREATE TABLE "node_histories" (
    "id" SERIAL NOT NULL,
    "node_id" INTEGER NOT NULL,
    "message" TEXT,
    "status" "Status" NOT NULL DEFAULT 'CREATED',

    CONSTRAINT "node_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "node_histories_node_id_key" ON "node_histories"("node_id");

-- AddForeignKey
ALTER TABLE "node_histories" ADD CONSTRAINT "node_histories_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
