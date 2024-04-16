-- CreateTable
CREATE TABLE "temp_claims" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "temp_claims_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "temp_claims" ADD CONSTRAINT "temp_claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
