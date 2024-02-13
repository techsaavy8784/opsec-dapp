/*
  Warnings:

  - You are about to drop the column `command` on the `servers` table. All the data in the column will be lost.
  - You are about to drop the column `ssh` on the `servers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "servers" DROP COLUMN "command",
DROP COLUMN "ssh",
ADD COLUMN     "host" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "port" INTEGER NOT NULL DEFAULT 22,
ADD COLUMN     "username" TEXT NOT NULL DEFAULT '';
