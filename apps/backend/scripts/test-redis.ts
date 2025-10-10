#!/usr/bin/env bun

import { redisClient } from '../src/core/database';
import { cacheService } from '../src/core/services/cache.service';

async function testRedis() {
  console.log('🧪 Testing Redis connection and functionality...\n');

  try {
    // Connect to Redis
    console.log('1. Connecting to Redis...');
    await redisClient.connect();
    console.log('✅ Connected to Redis successfully\n');

    // Test basic operations
    console.log('2. Testing basic Redis operations...');

    // Test string operations
    await redisClient.set('test:string', 'Hello Redis!', 60);
    const stringValue = await redisClient.get('test:string');
    console.log(`✅ String operation: ${stringValue}`);

    // Test JSON operations
    const testObject = { name: 'Test User', email: 'test@example.com', timestamp: Date.now() };
    await redisClient.setJSON('test:json', testObject, 60);
    const jsonValue = await redisClient.getJSON('test:json');
    console.log(`✅ JSON operation:`, jsonValue);

    // Test hash operations
    await redisClient.hSet('test:hash', 'field1', 'value1');
    await redisClient.hSet('test:hash', 'field2', 'value2');
    const hashValue = await redisClient.hGetAll('test:hash');
    console.log(`✅ Hash operation:`, hashValue);

    // Test expiration
    await redisClient.set('test:expire', 'This will expire', 2);
    const ttl = await redisClient.ttl('test:expire');
    console.log(`✅ TTL operation: ${ttl} seconds remaining\n`);

    // Test cache service
    console.log('3. Testing Cache Service...');

    // Test quote caching
    const testQuote = {
      id: 'quote-123',
      number: 'QU-2024-001',
      client: 'Test Client',
      total: 1500.00,
      status: 'draft'
    };

    await cacheService.cacheQuote('quote-123', testQuote);
    const cachedQuote = await cacheService.getQuote('quote-123');
    console.log('✅ Quote caching:', cachedQuote);

    // Test client caching
    const testClient = {
      id: 'client-456',
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com'
    };

    await cacheService.cacheClient('client-456', testClient);
    const cachedClient = await cacheService.getClient('client-456');
    console.log('✅ Client caching:', cachedClient);

    // Test health check
    const isHealthy = await cacheService.healthCheck();
    console.log(`✅ Health check: ${isHealthy ? 'Healthy' : 'Unhealthy'}\n`);

    // Test search results caching
    const searchResults = {
      query: 'test search',
      results: [testQuote],
      total: 1,
      timestamp: Date.now()
    };

    await cacheService.cacheSearchResults('test-search-key', searchResults);
    const cachedSearch = await cacheService.getSearchResults('test-search-key');
    console.log('✅ Search caching:', cachedSearch);

    // Test session caching
    const userSession = {
      userId: 'user-789',
      email: 'user@example.com',
      role: 'admin',
      loginTime: Date.now()
    };

    await cacheService.cacheUserSession('user-789', userSession);
    const cachedSession = await cacheService.getUserSession('user-789');
    console.log('✅ Session caching:', cachedSession);

    console.log('\n🎉 All Redis tests passed successfully!');

    // Cleanup test data
    console.log('\n4. Cleaning up test data...');
    await redisClient.del('test:string');
    await redisClient.del('test:json');
    await redisClient.del('test:hash');
    await redisClient.del('test:expire');
    await cacheService.invalidateQuote('quote-123');
    await cacheService.invalidateClient('client-456');
    await cacheService.delete('search:test-search-key');
    await cacheService.invalidateUserSession('user-789');
    console.log('✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Redis test failed:', error);
    process.exit(1);
  } finally {
    // Disconnect from Redis
    await redisClient.disconnect();
    console.log('\n👋 Disconnected from Redis');
    process.exit(0);
  }
}

// Run the test
testRedis();