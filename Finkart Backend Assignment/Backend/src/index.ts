import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;
const prisma = new PrismaClient();

const upload = multer({ dest: 'uploads/' });

interface TransactionData {
    TransactionID:string,
  CustomerName: string;
  TransactionDate: string;
  Amount: string;
  Status?: string;
  InvoiceURL?: string;
}
app.get('/transactions', async (req, res) => {
    try {
      const transactions = await prisma.transaction.findMany();
      res.json(transactions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      res.status(500).send('Error retrieving transactions.');
    }
  });
app.post('/upload', upload.single('csvfile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', async (row: TransactionData) => {
      const transaction = {
        TransactionID:row.TransactionID,
        CustomerName: row.CustomerName,
        TransactionDate: (new Date(row.TransactionDate)).toISOString(),
        Amount: parseFloat(row.Amount),
        Status: row.Status,
        InvoiceURL: row.InvoiceURL,
      };

      try {
        await prisma.transaction.create({
          data: transaction,
        });
      } catch (error) {
        console.error('Error saving transaction:', error);
        return res.status(500).send('Error saving transaction.');
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed.');
      res.status(200).send('CSV file successfully processed.');
    });
});

app.use(express.json());

app.put('/transactions', async (req, res) => {
    const { TransactionID, CustomerName, TransactionDate, Amount, Status, InvoiceURL } = req.body;
  
    try {
      const updatedTransaction = await prisma.transaction.update({
        where: { TransactionID },
        data: {
          CustomerName,
          TransactionDate: new Date(TransactionDate),
          Amount,
          Status,
          InvoiceURL,
        },
      });
      res.json(updatedTransaction);
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).send('Error updating transaction.');
    }
  });
  
app.delete('/transactions', async (req, res) => {
    const { TransactionID } = req.body;
  
    try {
      await prisma.transaction.delete({
        where: { TransactionID },
      });
      res.send('Transaction deleted successfully.');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).send('Error deleting transaction.');
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
