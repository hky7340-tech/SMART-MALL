import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = parseInt(process.env.PORT || '3999', 10);

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'running',
      user: 'running',
      store: 'running',
      product: 'running',
      order: 'running',
      payment: 'running',
      notification: 'running',
      loyalty: 'running',
      ai: 'running',
      parking: 'running',
      iot: 'running',
      crm: 'running',
      erp: 'running',
      booking: 'running',
      media: 'running',
      search: 'running',
      analytics: 'running',
      digitalSignage: 'running',
      wifi: 'running',
    },
  });
});

// Service Routes
const services = {
  '/api/auth': 'http://localhost:3001',
  '/api/users': 'http://localhost:3002',
  '/api/stores': 'http://localhost:3003',
  '/api/products': 'http://localhost:3004',
  '/api/orders': 'http://localhost:3005',
  '/api/payments': 'http://localhost:3006',
  '/api/notifications': 'http://localhost:3007',
  '/api/loyalty': 'http://localhost:3008',
  '/api/ai': 'http://localhost:3009',
  '/api/parking': 'http://localhost:3010',
  '/api/iot': 'http://localhost:3011',
  '/api/crm': 'http://localhost:3012',
  '/api/erp': 'http://localhost:3013',
  '/api/bookings': 'http://localhost:3014',
  '/api/media': 'http://localhost:3015',
  '/api/search': 'http://localhost:3016',
  '/api/analytics': 'http://localhost:3017',
  '/api/digital-signage': 'http://localhost:3018',
  '/api/wifi': 'http://localhost:3019',
};

Object.entries(services).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: '' },
    onProxyReq: (proxyReq: any, req: any) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  }));
});

// Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Proxying 20 microservices:`);
  Object.entries(services).forEach(([path, target]) => {
    console.log(`   ${path} → ${target}`);
  });
});

export default app;