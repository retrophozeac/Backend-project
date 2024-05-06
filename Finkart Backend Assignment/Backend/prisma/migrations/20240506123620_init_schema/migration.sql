/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Transactions" (
    "TransactionID" TEXT NOT NULL,
    "CustomerName" TEXT NOT NULL,
    "TransactionDate" TIMESTAMP(3) NOT NULL,
    "Amount" DECIMAL(65,30) NOT NULL,
    "Status" TEXT,
    "InvoiceURL" TEXT,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("TransactionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_TransactionID_key" ON "Transactions"("TransactionID");
