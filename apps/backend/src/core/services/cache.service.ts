import { redisClient } from '../database';
import { config } from '../config';

export class CacheService {
  private readonly defaultTTL = config.cache.defaultTTL;
  private readonly sessionTTL = config.cache.sessionTTL;
  private readonly searchTTL = config.cache.searchTTL;

  constructor() { }

  // Generic cache methods
  async get<T>(key: string): Promise<T | null> {
    return await redisClient.getJSON<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return await redisClient.setJSON(key, value, ttl || this.defaultTTL);
  }

  async delete(key: string): Promise<boolean> {
    return await redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return await redisClient.exists(key);
  }

  // Quote-specific cache methods
  async cacheQuote(quoteId: string, quote: any, ttl?: number): Promise<boolean> {
    const key = this.getQuoteKey(quoteId);
    return await this.set(key, quote, ttl);
  }

  async getQuote(quoteId: string): Promise<any | null> {
    const key = this.getQuoteKey(quoteId);
    return await this.get(key);
  }

  async invalidateQuote(quoteId: string): Promise<boolean> {
    const key = this.getQuoteKey(quoteId);
    return await this.delete(key);
  }

  // Client-specific cache methods
  async cacheClient(clientId: string, client: any, ttl?: number): Promise<boolean> {
    const key = this.getClientKey(clientId);
    return await this.set(key, client, ttl);
  }

  async getClient(clientId: string): Promise<any | null> {
    const key = this.getClientKey(clientId);
    return await this.get(key);
  }

  async invalidateClient(clientId: string): Promise<boolean> {
    const key = this.getClientKey(clientId);
    return await this.delete(key);
  }

  // Template-specific cache methods
  async cacheTemplate(templateId: string, template: any, ttl?: number): Promise<boolean> {
    const key = this.getTemplateKey(templateId);
    return await this.set(key, template, ttl);
  }

  async getTemplate(templateId: string): Promise<any | null> {
    const key = this.getTemplateKey(templateId);
    return await this.get(key);
  }

  async invalidateTemplate(templateId: string): Promise<boolean> {
    const key = this.getTemplateKey(templateId);
    return await this.delete(key);
  }

  // Search results caching
  async cacheSearchResults(searchKey: string, results: any, ttl?: number): Promise<boolean> {
    const key = this.getSearchKey(searchKey);
    return await this.set(key, results, ttl || this.searchTTL);
  }

  async getSearchResults(searchKey: string): Promise<any | null> {
    const key = this.getSearchKey(searchKey);
    return await this.get(key);
  }

  // Session caching for user sessions
  async cacheUserSession(userId: string, session: any, ttl?: number): Promise<boolean> {
    const key = this.getUserSessionKey(userId);
    return await this.set(key, session, ttl || this.sessionTTL);
  }

  async getUserSession(userId: string): Promise<any | null> {
    const key = this.getUserSessionKey(userId);
    return await this.get(key);
  }

  async invalidateUserSession(userId: string): Promise<boolean> {
    const key = this.getUserSessionKey(userId);
    return await this.delete(key);
  }

  // Dashboard statistics caching
  async cacheDashboardStats(userId: string, stats: any, ttl: number = 1800): Promise<boolean> {
    const key = this.getDashboardStatsKey(userId);
    return await this.set(key, stats, ttl); // 30 minutes for dashboard stats
  }

  async getDashboardStats(userId: string): Promise<any | null> {
    const key = this.getDashboardStatsKey(userId);
    return await this.get(key);
  }

  async invalidateDashboardStats(userId: string): Promise<boolean> {
    const key = this.getDashboardStatsKey(userId);
    return await this.delete(key);
  }

  // Company settings caching
  async cacheCompanySettings(settings: any, ttl: number = 7200): Promise<boolean> {
    const key = 'company:settings';
    return await this.set(key, settings, ttl); // 2 hours for company settings
  }

  async getCompanySettings(): Promise<any | null> {
    const key = 'company:settings';
    return await this.get(key);
  }

  async invalidateCompanySettings(): Promise<boolean> {
    const key = 'company:settings';
    return await this.delete(key);
  }

  // Tax rates caching
  async cacheTaxRates(taxRates: any, ttl: number = 7200): Promise<boolean> {
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

  // Bulk invalidation methods
  async invalidateUserData(userId: string): Promise<void> {
    await Promise.all([
      this.invalidateUserSession(userId),
      this.invalidateDashboardStats(userId)
    ]);
  }

  async invalidateQuoteRelatedData(quoteId: string, clientId?: string): Promise<void> {
    const promises = [this.invalidateQuote(quoteId)];

    if (clientId) {
      promises.push(this.invalidateClient(clientId));
    }

    await Promise.all(promises);
  }

  // Key generation methods
  private getQuoteKey(quoteId: string): string {
    return `quote:${quoteId}`;
  }

  private getClientKey(clientId: string): string {
    return `client:${clientId}`;
  }

  private getTemplateKey(templateId: string): string {
    return `template:${templateId}`;
  }

  private getSearchKey(searchKey: string): string {
    return `search:${searchKey}`;
  }

  private getUserSessionKey(userId: string): string {
    return `session:${userId}`;
  }

  private getDashboardStatsKey(userId: string): string {
    return `dashboard:stats:${userId}`;
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const testKey = 'health:check';
      const testValue = Date.now().toString();

      await redisClient.set(testKey, testValue, 10); // 10 seconds TTL
      const retrieved = await redisClient.get(testKey);
      await redisClient.del(testKey);

      return retrieved === testValue;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const cacheService = new CacheService();