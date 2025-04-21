-- CreateTable
CREATE TABLE "users" (
    "TransactionID" TEXT NOT NULL,
    "CustomerName" TEXT NOT NULL,
    "TransactionDate" TIMESTAMP(3) NOT NULL,
    "Amount" DECIMAL(65,30) NOT NULL,
    "Status" TEXT,
    "InvoiceURL" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("TransactionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_TransactionID_key" ON "users"("TransactionID");
