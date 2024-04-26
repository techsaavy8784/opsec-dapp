/*
  Warnings:

  - You are about to drop the column `validator_id` on the `claims` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `claims` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "claims" DROP CONSTRAINT "claims_validator_id_fkey";

-- AlterTable
ALTER TABLE "claims" DROP COLUMN "validator_id",
ALTER COLUMN "amount" SET DATA TYPE INTEGER;
