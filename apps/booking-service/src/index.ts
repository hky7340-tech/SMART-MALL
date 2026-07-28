import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3014;

app.use(cors());
app.use(express.json());

interface Booking {
    id: string; userId: number; storeId: string; type: 'restaurant' | 'room' | 'sports' | 'service' | 'event';
    date: string; startTime: string; endTime: string; guests: number; status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    note: string; createdAt: string;
}

const bookings: Booking[] = [];
let nextId = 1;

app.get('/', (req, res) => {
    let r = [...bookings]; const { userId, type, status, date } = req.query;
    if (userId) r = r.filter(b => b.userId === Number(userId));
    if (type) r = r.filter(b => b.type === type);
    if (status) r = r.filter(b => b.status === status);
    if (date) r = r.filter(b => b.date === date);
    res.json({ success: true, data: r });
});

app.post('/', (req, res) => {
    const { userId, storeId, type, date, startTime, endTime, guests, note } = req.body;
    if (!userId || !type || !date || !startTime) return res.status(400).json({ success: false, message: 'userId, type, date and startTime required' });
    const booking: Booking = { id: `bk_${nextId++}`, userId: Number(userId), storeId: storeId || '', type, date, startTime, endTime: endTime || '', guests: guests || 1, status: 'pending', note: note || '', createdAt: new Date().toISOString() };
    bookings.push(booking); res.status(201).json({ success: true, data: booking });
});

app.get('/:id', (req, res) => {
    const b = bookings.find(b => b.id === req.params.id);
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: b });
});

app.put('/:id/status', (req, res) => {
    const b = bookings.find(b => b.id === req.params.id);
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found' });
    b.status = req.body.status || b.status;
    res.json({ success: true, data: b });
});

app.get('/slots/:storeId', (req, res) => {
    const { date } = req.query;
    const storeBookings = bookings.filter(b => b.storeId === req.params.storeId && b.date === date && b.status !== 'cancelled');
    const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const available = slots.filter(s => !storeBookings.some(b => b.startTime <= s && b.endTime > s));
    res.json({ success: true, data: { slots, available } });
});

app.listen(PORT, () => console.log(`📅 Booking Service running on port ${PORT}`));
export default app;