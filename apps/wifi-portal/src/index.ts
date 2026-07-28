import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3019;

app.use(cors());
app.use(express.json());

interface WiFiSession {
    id: string; mac: string; phone: string; email: string; name: string;
    provider: 'otp' | 'google' | 'facebook' | 'voucher';
    loginTime: string; logoutTime?: string; duration: number; dataUsage: number;
}

const sessions: WiFiSession[] = [];
let nextId = 1;

app.post('/auth/otp', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    res.json({ success: true, message: 'OTP sent', data: { otp, phone } });
});

app.post('/auth/verify', (req, res) => {
    const { phone, otp, mac } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    const session: WiFiSession = { id: `wifi_${nextId++}`, mac: mac || '', phone, email: '', name: '', provider: 'otp', loginTime: new Date().toISOString(), duration: 0, dataUsage: 0 };
    sessions.push(session);
    res.json({ success: true, message: 'Connected', data: { sessionId: session.id, redirectUrl: 'https://smartmall.vn' } });
});

app.post('/auth/social', (req, res) => {
    const { provider, email, name, mac } = req.body;
    if (!provider || !email) return res.status(400).json({ success: false, message: 'Provider and email required' });
    const session: WiFiSession = { id: `wifi_${nextId++}`, mac: mac || '', phone: '', email, name: name || '', provider, loginTime: new Date().toISOString(), duration: 0, dataUsage: 0 };
    sessions.push(session);
    res.json({ success: true, message: 'Connected', data: { sessionId: session.id, redirectUrl: 'https://smartmall.vn' } });
});

app.get('/analytics', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.loginTime.startsWith(today));
    res.json({ success: true, data: { totalSessions: sessions.length, todaySessions: todaySessions.length, byProvider: { otp: sessions.filter(s => s.provider === 'otp').length, google: sessions.filter(s => s.provider === 'google').length, facebook: sessions.filter(s => s.provider === 'facebook').length, voucher: sessions.filter(s => s.provider === 'voucher').length }, uniquePhones: new Set(sessions.filter(s => s.phone).map(s => s.phone)).size, uniqueEmails: new Set(sessions.filter(s => s.email).map(s => s.email)).size } });
});

app.listen(PORT, () => console.log(`📶 WiFi Portal running on port ${PORT}`));
export default app;