import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { redisClient } from './core/database'
import { cacheService } from './core/services/cache.service'
import { config, validateConfig } from './core/config'
import { auth } from "./core/auth/better-auth.config";

// routes
import * as routes from './routes'
// import authRoutes from './routes/auth-better'

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>();

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Frontend URLs
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

// Routes
app.route('/api/v1/examples', routes.exampleRoute)

app.onError((error, c) => {
  console.error('Error occurred:', error)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// Initialize services
async function initializeServices() {
  // Validate configuration
  console.log('🔧 Validating configuration...')
  validateConfig()

  // Initialize Redis connection
  if (config.redis.enabled) {
    try {
      console.log('🔄 Initializing Redis connection...')
      await redisClient.connect()

      // Test Redis connection
      const isHealthy = await cacheService.healthCheck()
      if (isHealthy) {
        console.log('✅ Redis connection established and healthy')
      } else {
        console.warn('⚠️ Redis connection established but health check failed')
      }
    } catch (error) {
      console.error('❌ Failed to initialize Redis:', error)
      // Don't exit the process, allow the app to run without Redis
      console.warn('⚠️ Application will continue without Redis caching')
    }
  } else {
    console.log('ℹ️ Redis caching is disabled')
  }
}

// Health check endpoint
app.get('/health', async (c) => {
  const redisHealthy = await cacheService.healthCheck()

  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      redis: redisHealthy ? 'healthy' : 'unhealthy'
    }
  })
})

app.get('/', (c) => {
  return c.text('Custom Gift API')
})

// Initialize services when the module is loaded
initializeServices()

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  try {
    await redisClient.disconnect()
    console.log('Redis connection closed')
  } catch (error) {
    console.error('Error during shutdown:', error)
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  try {
    await redisClient.disconnect()
    console.log('Redis connection closed')
  } catch (error) {
    console.error('Error during shutdown:', error)
  }
  process.exit(0)
})

export default app
