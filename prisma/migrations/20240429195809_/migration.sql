-- RenameForeignKey
ALTER TABLE "payments" RENAME CONSTRAINT "payments_validator_id_fkey" TO "payments_id_fkey";
