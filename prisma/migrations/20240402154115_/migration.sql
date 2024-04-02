-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "stake_id" TEXT;

-- CreateTable
CREATE TABLE "stakings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stake_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stakings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stakings" ADD CONSTRAINT "stakings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
