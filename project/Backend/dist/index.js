"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const port = 3000;
const prisma = new client_1.PrismaClient();
// Multer setup for file upload
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.get('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.transaction.findMany();
        res.json(transactions);
    }
    catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).send('Error retrieving transactions.');
    }
}));
// Endpoint for file upload
app.post('/upload', upload.single('csvfile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Parse CSV file
    fs_1.default.createReadStream(req.file.path)
        .pipe((0, csv_parser_1.default)())
        .on('data', (row) => __awaiter(void 0, void 0, void 0, function* () {
        // Process each transaction
        const transaction = {
            TransactionID: row.TransactionID,
            CustomerName: row.CustomerName,
            TransactionDate: (new Date(row.TransactionDate)).toISOString(),
            Amount: parseFloat(row.Amount),
            Status: row.Status,
            InvoiceURL: row.InvoiceURL,
        };
        // Save transaction to database using Prisma
        try {
            yield prisma.transaction.create({
                data: transaction,
            });
        }
        catch (error) {
            console.error('Error saving transaction:', error);
            return res.status(500).send('Error saving transaction.');
        }
    }))
        .on('end', () => {
        // Handle end of file
        // Here you can perform any cleanup or additional logic
        console.log('CSV file successfully processed.');
        res.status(200).send('CSV file successfully processed.');
    });
}));
app.use(express_1.default.json());
// Update a particular transaction based on the TransactionID passed in the body
app.put('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TransactionID, CustomerName, TransactionDate, Amount, Status, InvoiceURL } = req.body;
    try {
        const updatedTransaction = yield prisma.transaction.update({
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
    }
    catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).send('Error updating transaction.');
    }
}));
// Delete a particular transaction based on the TransactionID passed in the body
app.delete('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TransactionID } = req.body;
    try {
        yield prisma.transaction.delete({
            where: { TransactionID },
        });
        res.send('Transaction deleted successfully.');
    }
    catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).send('Error deleting transaction.');
    }
}));
app.delete('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.transaction.deleteMany();
        res.send('All transactions deleted successfully.');
    }
    catch (error) {
        console.error('Error deleting transactions:', error);
        res.status(500).send('Error deleting transactions.');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
