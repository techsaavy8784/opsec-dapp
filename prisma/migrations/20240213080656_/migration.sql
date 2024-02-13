-- CreateEnum
CREATE TYPE "Role" AS ENUM ('NEW', 'PENDING', 'SIGNED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "Role" NOT NULL DEFAULT 'NEW';