/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `TransactionID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `Amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "TransactionID",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "Amount" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
