/*
  Warnings:

  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Transactions";

-- CreateTable
CREATE TABLE "Transaction" (
    "TransactionID" TEXT NOT NULL,
    "CustomerName" TEXT NOT NULL,
    "TransactionDate" TIMESTAMP(3) NOT NULL,
    "Amount" DECIMAL(65,30) NOT NULL,
    "Status" TEXT,
    "InvoiceURL" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("TransactionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_TransactionID_key" ON "Transaction"("TransactionID");
