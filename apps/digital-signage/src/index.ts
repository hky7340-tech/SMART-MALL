import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3018;

app.use(cors());
app.use(express.json());

interface Screen {
    id: string; name: string; location: string; resolution: string;
    status: 'online' | 'offline'; group: string; lastOnline: string;
}
interface Content {
    id: string; name: string; type: 'video' | 'image' | 'template';
    url: string; duration: number; startDate: string; endDate: string;
    screens: string[]; schedules: Schedule[]; isActive: boolean; createdAt: string;
}
interface Schedule {
    dayOfWeek: number; startTime: string; endTime: string;
}

const screens: Screen[] = [
    { id: 'scr_1', name: 'Màn hình Lobby T1', location: 'Tầng 1 - Sảnh chính', resolution: '1920x1080', status: 'online', group: 'Lobby', lastOnline: new Date().toISOString() },
    { id: 'scr_2', name: 'Màn hình Food Court T2', location: 'Tầng 2 - Khu ẩm thực', resolution: '3840x2160', status: 'online', group: 'Food Court', lastOnline: new Date().toISOString() },
    { id: 'scr_3', name: 'Màn hình Cinema T3', location: 'Tầng 3 - Rạp phim', resolution: '1920x1080', status: 'offline', group: 'Cinema', lastOnline: new Date(Date.now() - 3600000).toISOString() },
];
const contents: Content[] = []; let nextScreen = 4, nextContent = 1;

app.get('/screens', (req, res) => {
    let r = [...screens]; const { status, group } = req.query;
    if (status) r = r.filter(s => s.status === status);
    if (group) r = r.filter(s => s.group === group);
    res.json({ success: true, data: r });
});
app.get('/screens/:id', (req, res) => {
    const s = screens.find(s => s.id === req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Screen not found' });
    res.json({ success: true, data: s });
});

app.get('/content', (req, res) => {
    let r = [...contents]; const { type, isActive } = req.query;
    if (type) r = r.filter(c => c.type === type);
    if (isActive === 'true') r = r.filter(c => c.isActive);
    res.json({ success: true, data: r });
});
app.post('/content', (req, res) => {
    const { name, type, url, duration, screens: targetScreens } = req.body;
    if (!name || !type) return res.status(400).json({ success: false, message: 'Name and type required' });
    const content: Content = { id: `cnt_${nextContent++}`, name, type, url: url || '', duration: duration || 10, startDate: req.body.startDate || '', endDate: req.body.endDate || '', screens: targetScreens || [], schedules: req.body.schedules || [], isActive: true, createdAt: new Date().toISOString() };
    contents.push(content); res.status(201).json({ success: true, data: content });
});
app.put('/content/:id/toggle', (req, res) => {
    const c = contents.find(c => c.id === req.params.id);
    if (!c) return res.status(404).json({ success: false, message: 'Content not found' });
    c.isActive = !c.isActive;
    res.json({ success: true, data: c });
});

app.get('/sync/:screenId', (req, res) => {
    const screen = screens.find(s => s.id === req.params.screenId);
    if (!screen) return res.status(404).json({ success: false, message: 'Screen not found' });
    const activeContent = contents.filter(c => c.isActive && c.screens.includes(screen.id));
    res.json({ success: true, data: { screen, content: activeContent } });
});

app.listen(PORT, () => console.log(`📺 Digital Signage running on port ${PORT}`));
export default app;