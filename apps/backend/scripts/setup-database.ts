#!/usr/bin/env bun
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function setupDatabase() {
  console.log('🔧 Setting up database...');
  
  try {
    // Test database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Initialize Drizzle
    const db = drizzle(pool);
    
    // Run migrations
    console.log('🚀 Running database migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Database migrations completed successfully');
    
    // Test schema creation
    console.log('🔍 Verifying schema...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    console.log('📋 Created tables:', tables);
    
    const expectedTables = [
      'clients',
      'company_settings', 
      'quote_items',
      'quotes',
      'tax_rates',
      'templates',
      'user_favorites',
      'users'
    ];
    
    const missingTables = expectedTables.filter(table => !tables.includes(table));
    if (missingTables.length > 0) {
      console.warn('⚠️  Missing tables:', missingTables);
    } else {
      console.log('✅ All required tables created successfully');
    }
    
    await pool.end();
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 To fix this issue:');
      console.log('1. Start the database services: npm run dev:services');
      console.log('2. Wait for PostgreSQL to be ready (check with: npm run dev:services:logs)');
      console.log('3. Run this script again: bun run scripts/setup-database.ts');
    }
    
    process.exit(1);
  }
}

setupDatabase();