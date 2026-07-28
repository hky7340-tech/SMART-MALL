import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice: number;
  images: string[];
  rating: number;
  totalSold: number;
  discountPercent: number;
  storeName: string;
  storeId: string;
  category: string;
  description: string;
  inStock: boolean;
}

const products = new Map<string, Product>();

// GET /products
app.get('/', (req, res) => {
  let result = Array.from(products.values());
  const { category, search, minPrice, maxPrice, storeId, page = '1', limit = '20' } = req.query;

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }
  if (storeId) {
    result = result.filter(p => p.storeId === storeId);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q));
  }
  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
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

// GET /products/categories
app.get('/categories', (req, res) => {
  const cats = Array.from(new Set(Array.from(products.values()).map(p => p.category)));
  res.json({ success: true, data: cats.map(c => ({ id: c, name: c })) });
});

// GET /products/:id
app.get('/:id', (req, res) => {
  const product = products.get(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

// POST /products
app.post('/', (req, res) => {
  const { name, price, storeName, storeId, category } = req.body;
  if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price are required' });

  const product: Product = {
    id: `prod_${Date.now()}`,
    name,
    price: Number(price),
    comparePrice: req.body.comparePrice || 0,
    images: req.body.images || [],
    rating: 0,
    totalSold: 0,
    discountPercent: req.body.discountPercent || 0,
    storeName: storeName || '',
    storeId: storeId || '',
    category: category || 'Khác',
    description: req.body.description || '',
    inStock: true,
  };
  products.set(product.id, product);
  res.status(201).json({ success: true, message: 'Product created', data: product });
});

// PUT /products/:id
app.put('/:id', (req, res) => {
  const product = products.get(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const updated = { ...product, ...req.body, id: product.id };
  products.set(product.id, updated);
  res.json({ success: true, message: 'Product updated', data: updated });
});

// DELETE /products/:id
app.delete('/:id', (req, res) => {
  if (!products.has(req.params.id)) return res.status(404).json({ success: false, message: 'Product not found' });
  products.delete(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

app.listen(PORT, () => console.log(`📦 Product Service running on port ${PORT}`));
export default app;