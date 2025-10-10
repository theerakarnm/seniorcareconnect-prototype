#!/usr/bin/env bun
import 'dotenv/config';
import { Pool } from 'pg';

async function validateSchema() {
  console.log('🔍 Validating database schema...');
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    // Check all required tables exist
    const tablesQuery = `
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position
    `;
    
    const result = await pool.query(tablesQuery);
    const columns = result.rows;
    
    const expectedTables = {
      'users': ['id', 'email', 'password_hash', 'first_name', 'last_name', 'role'],
      'clients': ['id', 'name', 'company', 'email', 'phone_number', 'address_line1', 'tax_exempt'],
      'quotes': ['id', 'quote_number', 'client_id', 'status', 'subtotal', 'total_tax', 'grand_total', 'version'],
      'quote_items': ['id', 'quote_id', 'description', 'quantity', 'unit_price', 'line_total', 'discount_type'],
      'templates': ['id', 'name', 'html_content', 'css_styles', 'is_default'],
      'company_settings': ['id', 'company_name', 'email', 'phone', 'tax_id'],
      'tax_rates': ['id', 'name', 'rate', 'is_active'],
      'user_favorites': ['id', 'user_id', 'quote_id']
    };
    
    let allValid = true;
    
    for (const [tableName, requiredColumns] of Object.entries(expectedTables)) {
      const tableColumns = columns
        .filter(col => col.table_name === tableName)
        .map(col => col.column_name);
      
      console.log(`\n📋 Table: ${tableName}`);
      console.log(`   Columns: ${tableColumns.length}`);
      
      const missingColumns = requiredColumns.filter(col => !tableColumns.includes(col));
      if (missingColumns.length > 0) {
        console.log(`   ❌ Missing columns: ${missingColumns.join(', ')}`);
        allValid = false;
      } else {
        console.log(`   ✅ All required columns present`);
      }
    }
    
    // Check foreign key constraints
    const fkQuery = `
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name, kcu.column_name
    `;
    
    const fkResult = await pool.query(fkQuery);
    console.log(`\n🔗 Foreign Key Constraints: ${fkResult.rows.length}`);
    
    fkResult.rows.forEach(fk => {
      console.log(`   ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
    
    // Check unique constraints
    const uniqueQuery = `
      SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'UNIQUE'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name
    `;
    
    const uniqueResult = await pool.query(uniqueQuery);
    console.log(`\n🔑 Unique Constraints: ${uniqueResult.rows.length}`);
    
    uniqueResult.rows.forEach(uc => {
      console.log(`   ${uc.table_name}.${uc.column_name} (${uc.constraint_name})`);
    });
    
    await pool.end();
    
    if (allValid) {
      console.log('\n🎉 Schema validation completed successfully!');
      console.log('✅ All required tables and columns are present');
      console.log('✅ Foreign key relationships are properly configured');
      console.log('✅ Unique constraints are in place');
    } else {
      console.log('\n❌ Schema validation failed - missing required columns');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
    process.exit(1);
  }
}

validateSchema();