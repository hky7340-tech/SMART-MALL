import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

interface Store {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  banner: string;
  floor: number;
  unit: string;
  categoryId: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  tags: string[];
}

interface StoreCategory {
  id: string;
  name: string;
  icon: string;
}

// In-memory store
const stores = new Map<string, Store>();
const categories: StoreCategory[] = [
  { id: 'scat_1', name: 'Thời trang & Làm đẹp', icon: '👗' },
  { id: 'scat_2', name: 'Điện tử & Công nghệ', icon: '📱' },
  { id: 'scat_3', name: 'Ẩm thực & Đồ uống', icon: '🍽️' },
  { id: 'scat_4', name: 'Giải trí & Thể thao', icon: '🎯' },
  { id: 'scat_5', name: 'Sức khỏe & Sắc đẹp', icon: '💆' },
  { id: 'scat_6', name: 'Giáo dục & Sách', icon: '📚' },
  { id: 'scat_7', name: 'Dịch vụ & Tiện ích', icon: '🔧' },
];

// GET /categories
app.get('/categories', (req, res) => {
  res.json({ success: true, data: categories });
});

// GET /stores
app.get('/', (req, res) => {
  let result = Array.from(stores.values());
  const { category, floor, search, isFeatured, page = '1', limit = '20' } = req.query;

  if (category && category !== 'all') {
    result = result.filter(s => s.categoryId === category);
  }
  if (floor) {
    result = result.filter(s => s.floor === Number(floor));
  }
  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.tags.some(t => t.includes(q)));
  }
  if (isFeatured === 'true') {
    result = result.filter(s => s.isFeatured);
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

// GET /stores/featured
app.get('/featured', (req, res) => {
  const featured = Array.from(stores.values()).filter(s => s.isFeatured);
  res.json({ success: true, data: featured });
});

// GET /stores/:id
app.get('/:id', (req, res) => {
  const store = stores.get(req.params.id);
  if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
  res.json({ success: true, data: store });
});

// POST /stores
app.post('/', (req, res) => {
  const { name, description, shortDescription, floor, unit, categoryId, tags } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

  const store: Store = {
    id: `store_${Date.now()}`,
    name,
    description: description || '',
    shortDescription: shortDescription || '',
    logo: req.body.logo || '',
    banner: req.body.banner || '',
    floor: floor || 1,
    unit: unit || '',
    categoryId: categoryId || 'scat_1',
    rating: 0,
    totalReviews: 0,
    isFeatured: false,
    isOpen: true,
    openTime: req.body.openTime || '09:00',
    closeTime: req.body.closeTime || '22:00',
    tags: tags || [],
  };
  stores.set(store.id, store);
  res.status(201).json({ success: true, message: 'Store created', data: store });
});

// PUT /stores/:id
app.put('/:id', (req, res) => {
  const store = stores.get(req.params.id);
  if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

  const updated = { ...store, ...req.body, id: store.id };
  stores.set(store.id, updated);
  res.json({ success: true, message: 'Store updated', data: updated });
});

// DELETE /stores/:id
app.delete('/:id', (req, res) => {
  if (!stores.has(req.params.id)) return res.status(404).json({ success: false, message: 'Store not found' });
  stores.delete(req.params.id);
  res.json({ success: true, message: 'Store deleted' });
});

app.listen(PORT, () => console.log(`🏪 Store Service running on port ${PORT}`));
export default app;