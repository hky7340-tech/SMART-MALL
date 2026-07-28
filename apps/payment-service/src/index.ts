import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json());

interface Transaction {
    id: string;
    userId: number;
    type: 'payment' | 'refund' | 'deposit' | 'withdraw';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    method: string;
    description: string;
    createdAt: string;
}

const transactions: Transaction[] = [];

// POST /payments
app.post('/', (req, res) => {
    const { userId, amount, method, description } = req.body;
    if (!userId || !amount) return res.status(400).json({ success: false, message: 'userId and amount are required' });

    const transaction: Transaction = {
        id: `TXN${String(transactions.length + 1).padStart(6, '0')}`,
        userId: Number(userId),
        type: 'payment',
        amount: Number(amount),
        status: 'completed',
        method: method || 'COD',
        description: description || '',
        createdAt: new Date().toISOString(),
    };
    transactions.push(transaction);
    res.json({ success: true, data: transaction });
});

// GET /payments/transactions
app.get('/transactions', (req, res) => {
    let result = [...transactions];
    if (req.query.userId) {
        result = result.filter(t => t.userId === Number(req.query.userId));
    }
    res.json({ success: true, data: result });
});

app.listen(PORT, () => console.log(`💳 Payment Service running on port ${PORT}`));
export default app;