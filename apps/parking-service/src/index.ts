import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3010;

app.use(cors());
app.use(express.json());

interface ParkingSlot {
    id: string;
    floor: number;
    zone: string;
    number: string;
    type: 'car' | 'motorcycle' | 'bicycle' | 'ev';
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
    isEVCharging: boolean;
    pricePerHour: number;
}

interface ParkingTicket {
    id: string;
    plateNumber: string;
    vehicleType: 'car' | 'motorcycle' | 'bicycle' | 'ev';
    slotId: string;
    entryTime: string;
    exitTime?: string;
    amount?: number;
    status: 'active' | 'completed' | 'cancelled';
    paymentMethod?: string;
    paymentStatus: 'pending' | 'paid';
    qrCode: string;
}

interface ParkingRate {
    id: string;
    vehicleType: 'car' | 'motorcycle' | 'bicycle' | 'ev';
    firstHour: number;
    subsequentHour: number;
    dailyMax: number;
    monthlyPrice: number;
}

const slots: ParkingSlot[] = [];
const tickets: ParkingTicket[] = [];
let nextTicketId = 1;

// Generate parking slots
for (let f = -1; f <= 0; f++) {
    for (let z = 0; z < 4; z++) {
        const zone = String.fromCharCode(65 + z);
        for (let n = 1; n <= 20; n++) {
            slots.push({
                id: `slot_${f}_${zone}_${n}`,
                floor: f,
                zone,
                number: `${zone}${n}`,
                type: f === -1 ? 'car' : 'motorcycle',
                status: 'available',
                isEVCharging: n <= 4,
                pricePerHour: f === -1 ? 15000 : 5000,
            });
        }
    }
}

const rates: ParkingRate[] = [
    { id: 'rate_1', vehicleType: 'car', firstHour: 15000, subsequentHour: 10000, dailyMax: 80000, monthlyPrice: 1500000 },
    { id: 'rate_2', vehicleType: 'motorcycle', firstHour: 5000, subsequentHour: 3000, dailyMax: 20000, monthlyPrice: 300000 },
    { id: 'rate_3', vehicleType: 'bicycle', firstHour: 2000, subsequentHour: 1000, dailyMax: 10000, monthlyPrice: 100000 },
    { id: 'rate_4', vehicleType: 'ev', firstHour: 20000, subsequentHour: 15000, dailyMax: 100000, monthlyPrice: 2000000 },
];

app.get('/slots', (req, res) => {
    let result = [...slots];
    const { floor, type, status, zone } = req.query;
    if (floor) result = result.filter(s => s.floor === Number(floor));
    if (type) result = result.filter(s => s.type === type);
    if (status) result = result.filter(s => s.status === status);
    if (zone) result = result.filter(s => s.zone === zone);
    const available = result.filter(s => s.status === 'available').length;
    const total = result.length;
    res.json({ success: true, data: { slots: result, summary: { total, available, occupied: total - available } } });
});

app.get('/slots/:id', (req, res) => {
    const slot = slots.find(s => s.id === req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, data: slot });
});

app.post('/entry', (req, res) => {
    const { plateNumber, vehicleType, slotId } = req.body;
    if (!plateNumber || !vehicleType) return res.status(400).json({ success: false, message: 'plateNumber and vehicleType are required' });
    const slot = slotId ? slots.find(s => s.id === slotId) : slots.find(s => s.type === vehicleType && s.status === 'available');
    if (!slot) return res.status(400).json({ success: false, message: 'No available slot' });
    slot.status = 'occupied';
    const ticket: ParkingTicket = {
        id: `PK_${String(nextTicketId++).padStart(6, '0')}`,
        plateNumber, vehicleType, slotId: slot.id,
        entryTime: new Date().toISOString(),
        status: 'active', paymentStatus: 'pending',
        qrCode: `QR_PK_${Date.now()}_${plateNumber}`,
    };
    tickets.push(ticket);
    res.json({ success: true, message: 'Vehicle entered', data: { ticket, slot } });
});

app.post('/exit', (req, res) => {
    const { ticketId } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, message: 'ticketId is required' });
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.status !== 'active') return res.status(400).json({ success: false, message: 'Ticket is not active' });
    const exitTime = new Date();
    ticket.exitTime = exitTime.toISOString();
    const entryTime = new Date(ticket.entryTime);
    const hours = Math.ceil((exitTime.getTime() - entryTime.getTime()) / 3600000);
    const rate = rates.find(r => r.vehicleType === ticket.vehicleType);
    const amount = rate ? rate.firstHour + Math.max(0, hours - 1) * rate.subsequentHour : 0;
    ticket.amount = amount;
    ticket.status = 'completed';
    const slot = slots.find(s => s.id === ticket.slotId);
    if (slot) slot.status = 'available';
    res.json({ success: true, data: { ticket, amount, hours } });
});

app.get('/tickets', (req, res) => {
    let result = [...tickets];
    const { status, plateNumber, page = '1', limit = '20' } = req.query;
    if (status) result = result.filter(t => t.status === status);
    if (plateNumber) result = result.filter(t => t.plateNumber.toLowerCase().includes((plateNumber as string).toLowerCase()));
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    res.json({
        success: true, data: result.slice(startIndex, startIndex + limitNum),
        pagination: { page: pageNum, limit: limitNum, total: result.length },
    });
});

app.get('/tickets/:id', (req, res) => {
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, data: ticket });
});

app.post('/pay', (req, res) => {
    const { ticketId, paymentMethod } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, message: 'ticketId is required' });
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Already paid' });
    ticket.paymentStatus = 'paid';
    ticket.paymentMethod = paymentMethod || 'QR';
    res.json({ success: true, message: 'Payment successful', data: ticket });
});

app.get('/rates', (req, res) => {
    const { vehicleType } = req.query;
    let result = [...rates];
    if (vehicleType) result = result.filter(r => r.vehicleType === vehicleType);
    res.json({ success: true, data: result });
});

app.get('/history', (req, res) => {
    const { plateNumber, from, to, page = '1', limit = '20' } = req.query;
    let result = tickets.filter(t => t.status === 'completed');
    if (plateNumber) result = result.filter(t => t.plateNumber.toLowerCase().includes((plateNumber as string).toLowerCase()));
    if (from) result = result.filter(t => t.entryTime >= from);
    if (to) result = result.filter(t => t.entryTime <= to);
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    res.json({
        success: true, data: result.slice(startIndex, startIndex + limitNum),
        pagination: { page: pageNum, limit: limitNum, total: result.length },
    });
});

app.get('/dashboard', (req, res) => {
    const total = slots.length;
    const available = slots.filter(s => s.status === 'available').length;
    const occupied = slots.filter(s => s.status === 'occupied').length;
    const activeTickets = tickets.filter(t => t.status === 'active').length;
    const todayRevenue = tickets.filter(t => t.status === 'completed' && t.entryTime.startsWith(new Date().toISOString().split('T')[0]))
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    res.json({
        success: true, data: {
            slots: { total, available, occupied, utilization: Math.round((occupied / total) * 100) },
            tickets: { active: activeTickets, total: tickets.length },
            revenue: { today: todayRevenue },
        },
    });
});

app.listen(PORT, () => console.log(`🅿️ Parking Service running on port ${PORT}`));
export default app;