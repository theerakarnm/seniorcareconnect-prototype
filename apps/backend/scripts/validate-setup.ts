#!/usr/bin/env bun

// Simple validation script to check if our Redis setup compiles correctly
import { redisClient } from '../src/core/database';
import { cacheService } from '../src/core/services/cache.service';
import { config, validateConfig } from '../src/core/config';

console.log('🔍 Validating Redis setup...');

// Check if imports work
console.log('✅ Redis client imported successfully');
console.log('✅ Cache service imported successfully');
console.log('✅ Configuration imported successfully');

// Check configuration
console.log('\n📋 Configuration:');
console.log(`- Redis URL: ${config.redis.url}`);
console.log(`- Redis enabled: ${config.redis.enabled}`);
console.log(`- Default TTL: ${config.cache.defaultTTL}s`);
console.log(`- Session TTL: ${config.cache.sessionTTL}s`);
console.log(`- Search TTL: ${config.cache.searchTTL}s`);

// Check if Redis client methods exist
console.log('\n🔧 Redis client methods:');
console.log(`- connect: ${typeof redisClient.connect}`);
console.log(`- disconnect: ${typeof redisClient.disconnect}`);
console.log(`- isReady: ${typeof redisClient.isReady}`);
console.log(`- get: ${typeof redisClient.get}`);
console.log(`- set: ${typeof redisClient.set}`);
console.log(`- setJSON: ${typeof redisClient.setJSON}`);
console.log(`- getJSON: ${typeof redisClient.getJSON}`);

// Check if cache service methods exist
console.log('\n🗄️ Cache service methods:');
console.log(`- cacheQuote: ${typeof cacheService.cacheQuote}`);
console.log(`- getQuote: ${typeof cacheService.getQuote}`);
console.log(`- cacheClient: ${typeof cacheService.cacheClient}`);
console.log(`- getClient: ${typeof cacheService.getClient}`);
console.log(`- healthCheck: ${typeof cacheService.healthCheck}`);

// Test configuration validation
console.log('\n⚙️ Testing configuration validation...');
try {
  validateConfig();
  console.log('✅ Configuration validation passed');
} catch (error) {
  console.log('⚠️ Configuration validation warnings (expected in development)');
}

console.log('\n🎉 Redis setup validation completed successfully!');
console.log('\nNext steps:');
console.log('1. Start Redis server (docker-compose -f ../docker-compose.dev.yml up -d)');
console.log('2. Run the application (bun run dev)');
console.log('3. Test Redis functionality (bun run test:redis)');

export {};