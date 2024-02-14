/*
  Warnings:

  - You are about to drop the column `is_live` on the `nodes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "is_live";
