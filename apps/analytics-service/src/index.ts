import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3017;

app.use(cors());
app.use(express.json());

interface Report {
    id: string; type: string; title: string; data: any;
    dateRange: { from: string; to: string }; createdAt: string;
}

const reports: Report[] = [];
let nextId = 1;

app.get('/revenue', (req, res) => {
    const { from, to } = req.query;
    res.json({ success: true, data: { total: 125000000, growth: 15.5, byStore: [{ name: 'Fashion Hub', revenue: 45000000 }, { name: 'TechZone', revenue: 35000000 }, { name: 'Food Court', revenue: 25000000 }], byCategory: [{ name: 'Thời trang', revenue: 45000000 }, { name: 'Điện tử', revenue: 35000000 }, { name: 'Ẩm thực', revenue: 25000000 }], chart: Array.from({ length: 30 }, (_, i) => ({ date: `2024-01-${i + 1}`, value: Math.floor(Math.random() * 5000000 + 2000000) })) } });
});

app.get('/sales', (req, res) => {
    res.json({ success: true, data: { totalOrders: 1234, aov: 325000, conversionRate: 3.5, byStatus: { pending: 123, processing: 234, completed: 567, cancelled: 45 }, topProducts: [{ name: 'Áo thun nam', sold: 156, revenue: 23400000 }, { name: 'Điện thoại XYZ', sold: 89, revenue: 44500000 }] } });
});

app.get('/customers', (req, res) => {
    res.json({ success: true, data: { total: 5678, newThisMonth: 456, returning: 1234, churnRate: 2.5, avgOrders: 3.2, avgSpent: 1250000, segments: [{ name: 'VIP', count: 234, revenue: 45000000 }, { name: 'Thường xuyên', count: 567, revenue: 34000000 }, { name: 'Tiềm năng', count: 1234, revenue: 12000000 }] } });
});

app.get('/products', (req, res) => {
    res.json({ success: true, data: { total: 3456, active: 2345, outOfStock: 234, topSellers: [{ name: 'Áo thun nam', sold: 156, revenue: 23400000, stock: 45 }, { name: 'Điện thoại XYZ', sold: 89, revenue: 44500000, stock: 12 }] } });
});

app.get('/stores', (req, res) => {
    res.json({ success: true, data: { total: 45, active: 42, avgRating: 4.2, topStores: [{ name: 'Fashion Hub', revenue: 45000000, rating: 4.8 }, { name: 'TechZone', revenue: 35000000, rating: 4.5 }] } });
});

app.get('/traffic', (req, res) => {
    res.json({ success: true, data: { today: 3456, thisWeek: 23456, thisMonth: 89000, avgDwellTime: '45 phút', peakHours: [{ hour: '11:00', visitors: 890 }, { hour: '14:00', visitors: 1200 }, { hour: '18:00', visitors: 1500 }], byFloor: [{ floor: 1, visitors: 1200 }, { floor: 2, visitors: 800 }] } });
});

app.get('/dashboard', (req, res) => {
    res.json({ success: true, data: { revenue: { total: 125000000, growth: 15.5 }, orders: { total: 1234, growth: 12.3 }, customers: { total: 5678, growth: 8.7 }, stores: { total: 45, growth: 2.3 }, aov: 325000, conversionRate: 3.5, nps: 72 } });
});

app.post('/export', (req, res) => {
    const { type, format, dateRange } = req.body;
    const report: Report = { id: `rpt_${nextId++}`, type: type || 'revenue', title: `Báo cáo ${type || 'revenue'}`, data: {}, dateRange: dateRange || { from: '', to: '' }, createdAt: new Date().toISOString() };
    reports.push(report);
    res.json({ success: true, message: `Report exported as ${format || 'excel'}`, data: report });
});

app.listen(PORT, () => console.log(`📊 Analytics Service running on port ${PORT}`));
export default app;