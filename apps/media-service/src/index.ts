import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3015;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

interface MediaItem {
    id: string;
    name: string;
    type: 'image' | 'video' | 'file';
    mimeType: string;
    size: number;
    url: string;
    tags: string[];
    folder: string;
    createdAt: string;
}

const mediaItems: MediaItem[] = [];
let nextId = 1;

// POST /upload - Upload file (base64)
app.post('/upload', (req, res) => {
    const { name, mimeType, data, size, tags, folder } = req.body;
    if (!name || !mimeType || !data) {
        return res.status(400).json({ success: false, message: 'name, mimeType and data (base64) are required' });
    }

    let type: MediaItem['type'] = 'file';
    if (mimeType.startsWith('image')) type = 'image';
    else if (mimeType.startsWith('video')) type = 'video';

    const item: MediaItem = {
        id: `media_${nextId++}`,
        name,
        type,
        mimeType,
        size: size || data.length,
        url: `data:${mimeType};base64,${data}`,
        tags: tags || [],
        folder: folder || 'general',
        createdAt: new Date().toISOString(),
    };
    mediaItems.push(item);
    res.status(201).json({ success: true, data: item });
});

// GET / - List media
app.get('/', (req, res) => {
    let r = [...mediaItems];
    const { type, folder, search } = req.query;
    if (type) r = r.filter(m => m.type === type);
    if (folder) r = r.filter(m => m.folder === folder);
    if (search) {
        const q = (search as string).toLowerCase();
        r = r.filter(m => m.name.toLowerCase().includes(q) || m.tags.some(t => t.includes(q)));
    }
    res.json({ success: true, data: r });
});

// GET /:id - Get media by ID
app.get('/:id', (req, res) => {
    const item = mediaItems.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Media not found' });
    res.json({ success: true, data: item });
});

// DELETE /:id - Delete media
app.delete('/:id', (req, res) => {
    const idx = mediaItems.findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Media not found' });
    mediaItems.splice(idx, 1);
    res.json({ success: true, message: 'Media deleted' });
});

// PUT /:id/tags - Update tags
app.put('/:id/tags', (req, res) => {
    const item = mediaItems.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Media not found' });
    item.tags = req.body.tags || [];
    res.json({ success: true, data: item });
});

// GET /stats - Media statistics
app.get('/stats', (req, res) => {
    const totalSize = mediaItems.reduce((s, m) => s + m.size, 0);
    res.json({
        success: true, data: {
            total: mediaItems.length,
            totalSize,
            byType: {
                image: mediaItems.filter(m => m.type === 'image').length,
                video: mediaItems.filter(m => m.type === 'video').length,
                file: mediaItems.filter(m => m.type === 'file').length,
            },
        },
    });
});

app.listen(PORT, () => console.log(`🖼️ Media Service running on port ${PORT}`));
export default app;