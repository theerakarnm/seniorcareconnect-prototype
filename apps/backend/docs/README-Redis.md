# Redis Setup for Custom Gift Management System

## Overview

Redis is used as a caching layer to improve application performance by storing frequently accessed data in memory. This includes:

- User sessions
- Quote data
- Client information
- Search results
- Dashboard statistics
- Company settings and tax rates

## Local Development Setup

### Option 1: Using Docker Compose (Recommended)

1. Start Redis and PostgreSQL services:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. Verify Redis is running:
```bash
docker-compose -f docker-compose.dev.yml ps
```

3. Connect to Redis CLI (optional):
```bash
docker exec -it custom gift-redis redis-cli
```

### Option 2: Local Redis Installation

#### macOS (using Homebrew)
```bash
brew install redis
brew services start redis
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Windows
Download and install Redis from: https://github.com/microsoftarchive/redis/releases

## Configuration

The Redis connection is configured through environment variables:

```env
REDIS_URL=redis://localhost:6379
```

For production or different environments, update the `REDIS_URL` accordingly:

```env
# Production example
REDIS_URL=redis://username:password@redis-host:6379

# Redis with SSL
REDIS_URL=rediss://username:password@redis-host:6380
```

## Usage

### Cache Service

The application provides a `CacheService` class with high-level caching methods:

```typescript
import { cacheService } from './core/services/cache.service';

// Cache a quote
await cacheService.cacheQuote('quote-123', quoteData);

// Retrieve a cached quote
const cachedQuote = await cacheService.getQuote('quote-123');

// Invalidate cache
await cacheService.invalidateQuote('quote-123');
```

### Direct Redis Client

For advanced use cases, you can access the Redis client directly:

```typescript
import { redisClient } from './core/database';

// Set a value with TTL
await redisClient.set('key', 'value', 3600); // 1 hour

// Get a value
const value = await redisClient.get('key');

// Work with JSON data
await redisClient.setJSON('user:123', { name: 'John', email: 'john@example.com' });
const user = await redisClient.getJSON('user:123');
```

## Cache Keys Structure

The application uses a structured approach to cache keys:

- `quote:{quoteId}` - Individual quote data
- `client:{clientId}` - Client information
- `template:{templateId}` - Template data
- `session:{userId}` - User session data
- `dashboard:stats:{userId}` - Dashboard statistics
- `search:{searchKey}` - Search results
- `company:settings` - Company settings
- `tax:rates` - Tax rates configuration

## Cache TTL (Time To Live)

Different types of data have different cache durations:

- **Quotes/Clients/Templates**: 1 hour (3600 seconds)
- **Search Results**: 5 minutes (300 seconds)
- **User Sessions**: 24 hours (86400 seconds)
- **Dashboard Stats**: 30 minutes (1800 seconds)
- **Company Settings/Tax Rates**: 2 hours (7200 seconds)

## Monitoring and Health Checks

The application includes Redis health checks:

```bash
# Check application health (includes Redis status)
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "services": {
    "redis": "healthy"
  }
}
```

## Error Handling

The Redis client includes comprehensive error handling:

- **Connection failures**: Automatic reconnection with exponential backoff
- **Operation failures**: Graceful degradation (operations return null/false)
- **Network issues**: Connection retry logic with configurable limits

The application will continue to function even if Redis is unavailable, but without caching benefits.

## Production Considerations

### Security
- Use Redis AUTH for password protection
- Enable SSL/TLS for encrypted connections
- Configure firewall rules to restrict access
- Use Redis ACLs for fine-grained access control

### Performance
- Monitor memory usage and set appropriate `maxmemory` policies
- Use Redis persistence (AOF/RDB) for data durability
- Consider Redis Cluster for high availability
- Monitor slow queries and optimize cache patterns

### Backup and Recovery
- Configure Redis persistence (AOF recommended)
- Set up regular backups of Redis data
- Test backup restoration procedures
- Monitor Redis replication if using master-slave setup

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Verify Redis is running: `redis-cli ping`
   - Check Redis configuration and port
   - Verify firewall settings

2. **Memory Issues**
   - Monitor Redis memory usage: `redis-cli info memory`
   - Configure appropriate `maxmemory` and eviction policies
   - Review cache TTL settings

3. **Performance Issues**
   - Monitor slow queries: `redis-cli slowlog get`
   - Check network latency between app and Redis
   - Review cache hit/miss ratios

### Debugging

Enable Redis logging for debugging:

```bash
# In Redis configuration
loglevel debug
logfile /var/log/redis/redis-server.log
```

Monitor Redis operations in real-time:
```bash
redis-cli monitor
```