import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'customer' | 'store_owner' | 'staff';
    status: 'active' | 'locked' | 'pending';
    orders: number;
    spent: number;
    joined: string;
    lastActive: string;
}

const users = new Map<number, User>();
let nextId = 1;

// GET /users
app.get('/', (req, res) => {
    let filtered = Array.from(users.values());
    const { role, status, search, page = '1', limit = '10' } = req.query;

    if (role && role !== 'all') filtered = filtered.filter(u => u.role === role);
    if (status && status !== 'all') filtered = filtered.filter(u => u.status === status);
    if (search) {
        const q = (search as string).toLowerCase();
        filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q));
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    res.json({
        success: true, data: paginated,
        pagination: { page: pageNum, limit: limitNum, total: filtered.length, totalPages: Math.ceil(filtered.length / limitNum) },
    });
});

// GET /users/:id
app.get('/:id', (req, res) => {
    const user = users.get(Number(req.params.id));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
});

// POST /users
app.post('/', (req, res) => {
    const { name, email, phone, role } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });

    const user: User = {
        id: nextId++, name, email, phone: phone || '', role: role || 'customer',
        status: 'active', orders: 0, spent: 0,
        joined: new Date().toISOString().split('T')[0],
        lastActive: 'Vừa tạo',
    };
    users.set(user.id, user);
    res.status(201).json({ success: true, message: 'User created', data: user });
});

// PUT /users/:id
app.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.get(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updated = { ...user, ...req.body, id };
    users.set(id, updated);
    res.json({ success: true, message: 'User updated', data: updated });
});

// PUT /users/:id/toggle-lock
app.put('/:id/toggle-lock', (req, res) => {
    const id = Number(req.params.id);
    const user = users.get(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = user.status === 'active' ? 'locked' : 'active';
    users.set(id, user);
    res.json({ success: true, message: user.status === 'locked' ? 'User locked' : 'User unlocked', data: user });
});

// DELETE /users/:id
app.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!users.has(id)) return res.status(404).json({ success: false, message: 'User not found' });
    users.delete(id);
    res.json({ success: true, message: 'User deleted' });
});

// PUT /users/bulk/lock
app.put('/bulk/lock', (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids required' });
    ids.forEach((id: number) => {
        const user = users.get(id);
        if (user) { user.status = 'locked'; users.set(id, user); }
    });
    res.json({ success: true, message: `${ids.length} users locked` });
});

// POST /users/bulk/delete
app.post('/bulk/delete', (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids required' });
    ids.forEach((id: number) => users.delete(id));
    res.json({ success: true, message: `${ids.length} users deleted` });
});

app.listen(PORT, () => console.log(`👥 User Service running on port ${PORT}`));
export default app;