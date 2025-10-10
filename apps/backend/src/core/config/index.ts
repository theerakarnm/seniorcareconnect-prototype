import 'dotenv/config';

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    name: process.env.APP_NAME || 'Custom Gift System',
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || '',
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    enabled: process.env.REDIS_ENABLED !== 'false', // Allow disabling Redis
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'custom-gift-system',
    audience: process.env.JWT_AUDIENCE || 'custom-gift-users',
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },

  // Company Default Settings
  company: {
    defaultName: process.env.DEFAULT_COMPANY_NAME || 'Your Company Name',
    defaultEmail: process.env.DEFAULT_COMPANY_EMAIL || 'info@yourcompany.com',
    defaultPhone: process.env.DEFAULT_COMPANY_PHONE || '+1-555-0123',
  },

  // Cache Configuration
  cache: {
    defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10), // 1 hour
    sessionTTL: parseInt(process.env.CACHE_SESSION_TTL || '86400', 10), // 24 hours
    searchTTL: parseInt(process.env.CACHE_SEARCH_TTL || '300', 10), // 5 minutes
  },

  // Development flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// Validation function to check required environment variables
export function validateConfig(): void {
  const requiredVars = [
    'DATABASE_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });

    if (config.isProduction) {
      process.exit(1);
    } else {
      console.warn('⚠️ Continuing in development mode with missing variables');
    }
  }

  // Warn about default JWT secret in production
  if (config.isProduction && config.jwt.secret === 'default-secret-change-in-production') {
    console.error('❌ Using default JWT secret in production is not secure!');
    process.exit(1);
  }
}

export default config;