// ==================== SMART MALL ECOSYSTEM CONFIGURATION ====================

export const config = {
  app: {
    name: 'Smart Mall Ecosystem',
    version: '1.0.0',
    description: 'Enterprise Smart Mall Management Platform',
  },

  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    },
  },

  databases: {
    postgres: {
      url: process.env.DATABASE_URL || 'postgresql://smartmall:smartmall@2024@localhost:5432/smartmall',
    },
    mongodb: {
      url: process.env.MONGODB_URI || 'mongodb://smartmall:smartmall@2024@localhost:27017/smartmall',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://:smartmall@2024@localhost:6379',
    },
    elasticsearch: {
      url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    },
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://smartmall:smartmall@2024@localhost:5672',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'smartmall-jwt-secret-2024-super-secure',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
    issuer: 'smartmall',
  },

  auth: {
    otpExpiry: 300, // 5 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 900, // 15 minutes
    passwordMinLength: 8,
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },

  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
    cloudStorage: {
      provider: process.env.CLOUD_STORAGE || 's3',
      bucket: process.env.S3_BUCKET || 'smartmall',
      region: process.env.S3_REGION || 'ap-southeast-1',
      accessKey: process.env.AWS_ACCESS_KEY_ID || '',
      secretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },

  payment: {
    vnpay: {
      tmnCode: process.env.VNPAY_TMN_CODE || '',
      hashSecret: process.env.VNPAY_HASH_SECRET || '',
      url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    },
    momo: {
      partnerCode: process.env.MOMO_PARTNER_CODE || '',
      accessKey: process.env.MOMO_ACCESS_KEY || '',
      secretKey: process.env.MOMO_SECRET_KEY || '',
      endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
    },
    zalopay: {
      appId: process.env.ZALOPAY_APP_ID || '',
      key1: process.env.ZALOPAY_KEY1 || '',
      key2: process.env.ZALOPAY_KEY2 || '',
      endpoint: process.env.ZALOPAY_ENDPOINT || 'https://sandbox.zalopay.com.vn/v001/tpe/createorder',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
  },

  notification: {
    firebase: {
      serverKey: process.env.FCM_SERVER_KEY || '',
      senderId: process.env.FCM_SENDER_ID || '',
    },
    email: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || 'noreply@smartmall.com',
    },
    sms: {
      provider: process.env.SMS_PROVIDER || 'twilio',
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      fromNumber: process.env.TWILIO_FROM_NUMBER || '',
    },
  },

  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
    },
    vision: {
      provider: process.env.AI_VISION_PROVIDER || 'google',
    },
  },

  loyalty: {
    tiers: {
      silver: { minPoints: 0, discount: 0, multiplier: 1 },
      gold: { minPoints: 1000, discount: 5, multiplier: 1.5 },
      platinum: { minPoints: 5000, discount: 10, multiplier: 2 },
      diamond: { minPoints: 15000, discount: 15, multiplier: 3 },
      vip: { minPoints: 50000, discount: 20, multiplier: 5 },
    },
    pointsPerDollar: 10,
    pointsExpiryDays: 365,
  },

  parking: {
    rates: {
      car: { firstHour: 10000, additionalHour: 5000, dailyMax: 50000 },
      motorcycle: { firstHour: 3000, additionalHour: 2000, dailyMax: 15000 },
      bicycle: { firstHour: 1000, additionalHour: 500, dailyMax: 5000 },
    },
    freeDuration: 15, // minutes
  },

  map: {
    tileServer: process.env.MAP_TILE_SERVER || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    defaultCenter: { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh City
    defaultZoom: 15,
  },

  wifi: {
    sessionTimeout: 3600, // 1 hour
    maxDevices: 3,
    bandwidthLimit: 5, // Mbps
  },

  cache: {
    defaultTTL: 300, // 5 minutes
    longTTL: 3600, // 1 hour
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || '',
    logLevel: process.env.LOG_LEVEL || 'debug',
  },

  seo: {
    defaultTitle: 'Smart Mall - Trung tâm thương mại thông minh',
    defaultDescription: 'Trải nghiệm mua sắm thông minh tại trung tâm thương mại hiện đại',
    defaultKeywords: ['smart mall', 'trung tâm thương mại', 'mua sắm', 'giải trí'],
  },
};

export default config;

