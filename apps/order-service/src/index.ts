import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

interface Order {
  id: string;
  customer: string;
  customerId: number;
  total: number;
  status: 'completed' | 'processing' | 'pending' | 'cancelled' | 'delivered';
  store: string;
  items: number;
  time: string;
  createdAt: string;
}

const orders = new Map<string, Order>();

// GET /orders
app.get('/', (req, res) => {
  let result = Array.from(orders.values());
  const { status, search, page = '1', limit = '20' } = req.query;

  if (status && status !== 'all') {
    result = result.filter(o => o.status === status);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = result.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true, data: paginated,
    pagination: { page: pageNum, limit: limitNum, total: result.length, totalPages: Math.ceil(result.length / limitNum) },
  });
});

// GET /orders/track/:code
app.get('/track/:code', (req, res) => {
  const order = orders.get(req.params.code);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
});

// GET /orders/:id
app.get('/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
});

// POST /orders
app.post('/', (req, res) => {
  const { customer, total, store, items } = req.body;
  if (!customer || !total) return res.status(400).json({ success: false, message: 'Customer and total are required' });

  const order: Order = {
    id: `DH${String(orders.size + 1).padStart(3, '0')}`,
    customer,
    customerId: req.body.customerId || 0,
    total: Number(total),
    status: 'pending',
    store: store || '',
    items: items || 1,
    time: 'Vừa xong',
    createdAt: new Date().toISOString(),
  };
  orders.set(order.id, order);
  res.status(201).json({ success: true, message: 'Order created', data: order });
});

// PUT /orders/:id/status
app.put('/:id/status', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.status = req.body.status || order.status;
  orders.set(order.id, order);
  res.json({ success: true, message: 'Order status updated', data: order });
});

app.listen(PORT, () => console.log(`📋 Order Service running on port ${PORT}`));
export default app;