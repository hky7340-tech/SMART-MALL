import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3016;

app.use(cors());
app.use(express.json());

interface SearchIndex {
    id: string; type: 'product' | 'store' | 'news' | 'event'; title: string;
    description: string; tags: string[]; url: string; score: number; createdAt: string;
}

const searchIndex: SearchIndex[] = [];
let nextId = 1;

app.get('/', (req, res) => {
    const { q, type, page = '1', limit = '20' } = req.query;
    if (!q) return res.json({ success: true, data: [], pagination: { page: 1, limit: 20, total: 0 } });
    const query = (q as string).toLowerCase();
    let results = searchIndex.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(t => t.toLowerCase().includes(query))
    );
    if (type) results = results.filter(r => r.type === type);
    results.sort((a, b) => b.score - a.score);
    const pageNum = Number(page), limitNum = Number(limit);
    const start = (pageNum - 1) * limitNum;
    res.json({ success: true, data: results.slice(start, start + limitNum), pagination: { page: pageNum, limit: limitNum, total: results.length } });
});

app.get('/autocomplete', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });
    const query = (q as string).toLowerCase();
    const suggestions = searchIndex.filter(i => i.title.toLowerCase().includes(query)).slice(0, 10).map(i => i.title);
    res.json({ success: true, data: [...new Set(suggestions)] });
});

app.post('/index', (req, res) => {
    const { type, title, description, tags, url } = req.body;
    if (!type || !title) return res.status(400).json({ success: false, message: 'type and title required' });
    const item: SearchIndex = { id: `idx_${nextId++}`, type, title, description: description || '', tags: tags || [], url: url || '', score: 1.0, createdAt: new Date().toISOString() };
    searchIndex.push(item);
    res.status(201).json({ success: true, data: item });
});

app.get('/trending', (req, res) => {
    const top = [...searchIndex].sort((a, b) => b.score - a.score).slice(0, 10);
    res.json({ success: true, data: top });
});

app.listen(PORT, () => console.log(`🔍 Search Service running on port ${PORT}`));
export default app;