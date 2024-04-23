-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "validator_id" INTEGER;

-- RenameForeignKey
ALTER TABLE "payments" RENAME CONSTRAINT "payments_validator_id_fkey" TO "payments_id_fkey";

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_validator_id_fkey" FOREIGN KEY ("validator_id") REFERENCES "validators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
