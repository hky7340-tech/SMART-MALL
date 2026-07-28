import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

interface Notification {
    id: string;
    userId: number;
    type: 'order' | 'promotion' | 'system' | 'loyalty' | 'event' | 'booking';
    channel: 'push' | 'email' | 'sms' | 'in_app';
    title: string;
    body: string;
    data?: any;
    isRead: boolean;
    createdAt: string;
}

const notifications: Notification[] = [];
let nextId = 1;

// GET /notifications
app.get('/', (req, res) => {
    let result = [...notifications];
    const { userId, type, channel, isRead, page = '1', limit = '20' } = req.query;

    if (userId) result = result.filter(n => n.userId === Number(userId));
    if (type && type !== 'all') result = result.filter(n => n.type === type);
    if (channel && channel !== 'all') result = result.filter(n => n.channel === channel);
    if (isRead === 'true') result = result.filter(n => n.isRead);
    if (isRead === 'false') result = result.filter(n => !n.isRead);

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = result.slice(startIndex, startIndex + limitNum);

    res.json({
        success: true, data: paginated,
        pagination: { page: pageNum, limit: limitNum, total: result.length, totalPages: Math.ceil(result.length / limitNum) },
    });
});

// GET /notifications/unread-count
app.get('/unread-count', (req, res) => {
    const { userId } = req.query;
    let result = notifications.filter(n => !n.isRead);
    if (userId) result = result.filter(n => n.userId === Number(userId));
    res.json({ success: true, data: { count: result.length } });
});

// GET /notifications/:id
app.get('/:id', (req, res) => {
    const notification = notifications.find(n => n.id === req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: notification });
});

// POST /notifications/send
app.post('/send', (req, res) => {
    const { userId, type, channel, title, body, data } = req.body;
    if (!userId || !title || !body) return res.status(400).json({ success: false, message: 'userId, title and body are required' });

    const notification: Notification = {
        id: `NOTIF_${String(nextId++).padStart(6, '0')}`,
        userId: Number(userId),
        type: type || 'system',
        channel: channel || 'in_app',
        title,
        body,
        data: data || {},
        isRead: false,
        createdAt: new Date().toISOString(),
    };
    notifications.push(notification);
    res.status(201).json({ success: true, message: 'Notification sent', data: notification });
});

// POST /notifications/send-bulk
app.post('/send-bulk', (req, res) => {
    const { userIds, type, channel, title, body, data } = req.body;
    if (!userIds || !Array.isArray(userIds) || !title || !body) {
        return res.status(400).json({ success: false, message: 'userIds, title and body are required' });
    }

    const created: Notification[] = [];
    userIds.forEach((userId: number) => {
        const notification: Notification = {
            id: `NOTIF_${String(nextId++).padStart(6, '0')}`,
            userId: Number(userId),
            type: type || 'system',
            channel: channel || 'in_app',
            title,
            body,
            data: data || {},
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        notifications.push(notification);
        created.push(notification);
    });

    res.status(201).json({ success: true, message: `${created.length} notifications sent`, data: created });
});

// PUT /notifications/:id/read
app.put('/:id/read', (req, res) => {
    const notification = notifications.find(n => n.id === req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    notification.isRead = true;
    res.json({ success: true, message: 'Marked as read', data: notification });
});

// PUT /notifications/read-all
app.put('/read-all', (req, res) => {
    const { userId } = req.body;
    let count = 0;
    notifications.forEach(n => {
        if (!n.isRead && (!userId || n.userId === Number(userId))) {
            n.isRead = true;
            count++;
        }
    });
    res.json({ success: true, message: `${count} notifications marked as read` });
});

// DELETE /notifications/:id
app.delete('/:id', (req, res) => {
    const index = notifications.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Notification not found' });
    notifications.splice(index, 1);
    res.json({ success: true, message: 'Notification deleted' });
});

app.listen(PORT, () => console.log(`🔔 Notification Service running on port ${PORT}`));
export default app;