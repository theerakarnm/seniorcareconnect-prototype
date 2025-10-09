import { RedisClient } from '../lib/redis';
import { config } from '../config';

export class CacheService {
  private readonly defaultTTL = config.cache.defaultTTL;
  private readonly sessionTTL = config.cache.sessionTTL;
  private readonly searchTTL = config.cache.searchTTL;
  private readonly redisClient = new RedisClient();

  // constructor() { }

  // Generic cache methods
  async get<T>(key: string): Promise<T | null> {
    return await this.redisClient.getJSON<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return await this.redisClient.setJSON(key, value, ttl || this.defaultTTL);
  }

  async delete(key: string): Promise<boolean> {
    return await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return await this.redisClient.exists(key);
  }

  // Tax rates caching
  async cacheTaxRates(taxRates: any, ttl = 7200): Promise<boolean> {
    const key = 'tax:rates';
    return await this.set(key, taxRates, ttl); // 2 hours for tax rates
  }

  async getTaxRates(): Promise<any | null> {
    const key = 'tax:rates';
    return await this.get(key);
  }

  async invalidateTaxRates(): Promise<boolean> {
    const key = 'tax:rates';
    return await this.delete(key);
  }
  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const testKey = 'health:check';
      const testValue = Date.now().toString();

      await this.redisClient.set(testKey, testValue, 10); // 10 seconds TTL
      const retrieved = await this.redisClient.get(testKey);
      await this.redisClient.del(testKey);

      return retrieved === testValue;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const cacheService = new CacheService();