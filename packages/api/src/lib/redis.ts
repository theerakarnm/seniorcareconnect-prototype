import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { config } from '../config';

class RedisClient {
  private client: RedisClientType | null = null;
  private isConnected = false;
  private isEnabled = true;

  constructor() {
    this.isEnabled = config.redis.enabled;

    if (!this.isEnabled) {
      console.log('Redis is disabled via configuration');
      return;
    }

    const redisUrl = config.redis.url;

    this.client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            return new Error('Redis connection failed after 10 retries');
          }
          return Math.min(retries * 50, 1000);
        }
      }
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      console.log('Redis Client Disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isEnabled) {
      console.log('Redis connection skipped (disabled)');
      return;
    }

    if (!this.isConnected && this.client) {
      try {
        await this.client.connect();
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        this.isEnabled = false; // Disable Redis if connection fails
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected && this.client) {
      await this.client.disconnect();
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  isReady(): boolean {
    return this.isEnabled && this.isConnected;
  }

  private checkReady(): boolean {
    return this.isReady() && this.client !== null;
  }

  // Cache utility methods
  async get(key: string): Promise<string | null> {
    if (!this.isReady() || !this.client) {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    if (!this.isReady() || !this.client) {
      return false;
    }

    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isReady() || !this.client) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isReady() || !this.client) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  // JSON cache methods for objects
  async setJSON(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.checkReady()) {
      return false;
    }

    try {
      const jsonString = JSON.stringify(value);
      return await this.set(key, jsonString, ttl);
    } catch (error) {
      console.error('Redis setJSON error:', error);
      return false;
    }
  }

  async getJSON<T>(key: string): Promise<T | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      const jsonString = await this.get(key);
      if (jsonString) {
        return JSON.parse(jsonString) as T;
      }
      return null;
    } catch (error) {
      console.error('Redis getJSON error:', error);
      return null;
    }
  }

  // Hash operations for complex data structures
  async hSet(key: string, field: string, value: string): Promise<boolean> {
    if (!this.checkReady()) {
      return false;
    }

    try {
      await this.client!.hSet(key, field, value);
      return true;
    } catch (error) {
      console.error('Redis HSET error:', error);
      return false;
    }
  }

  async hGet(key: string, field: string): Promise<string | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      return await this.client!.hGet(key, field);
    } catch (error) {
      console.error('Redis HGET error:', error);
      return null;
    }
  }

  async hGetAll(key: string): Promise<Record<string, string> | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      return await this.client!.hGetAll(key);
    } catch (error) {
      console.error('Redis HGETALL error:', error);
      return null;
    }
  }

  // List operations for queues or ordered data
  async lPush(key: string, ...values: string[]): Promise<number | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      return await this.client!.lPush(key, values);
    } catch (error) {
      console.error('Redis LPUSH error:', error);
      return null;
    }
  }

  async rPop(key: string): Promise<string | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      return await this.client!.rPop(key);
    } catch (error) {
      console.error('Redis RPOP error:', error);
      return null;
    }
  }

  // Set operations for unique collections
  async sAdd(key: string, ...members: string[]): Promise<number | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      return await this.client!.sAdd(key, members);
    } catch (error) {
      console.error('Redis SADD error:', error);
      return null;
    }
  }

  async sMembers(key: string): Promise<string[] | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      return await this.client!.sMembers(key);
    } catch (error) {
      console.error('Redis SMEMBERS error:', error);
      return null;
    }
  }

  // Expiration management
  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.checkReady()) {
      return false;
    }

    try {
      const result = await this.client!.expire(key, seconds);
      return !!result;
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      return false;
    }
  }

  async ttl(key: string): Promise<number | null> {
    if (!this.checkReady()) {
      return null;
    }

    try {
      return await this.client!.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return null;
    }
  }
}

// Create singleton instance
const redisClient = new RedisClient();

export default redisClient;
export { RedisClient };