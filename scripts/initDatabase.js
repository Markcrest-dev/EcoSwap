#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Add src directory to require path
require('module').globalPaths.push(path.join(__dirname, '..', 'src'));

const migrations = require('../src/database/migrations');
const dbConnection = require('../src/database/connection');

async function initDatabase() {
  console.log('🚀 Initializing EcoSwap Database...');
  
  try {
    // Run migrations
    await migrations.runMigrations();
    
    console.log('✅ Database initialization completed successfully!');
    console.log('');
    console.log('📋 Demo User Credentials:');
    console.log('   Email: demo@ecoswap.com');
    console.log('   Password: demo123');
    console.log('');
    console.log('🎉 You can now start the application with: npm start');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await dbConnection.close();
  }
}

async function resetDatabase() {
  console.log('🔄 Resetting EcoSwap Database...');
  
  try {
    await migrations.resetDatabase();
    
    console.log('✅ Database reset completed successfully!');
    console.log('');
    console.log('📋 Demo User Credentials:');
    console.log('   Email: demo@ecoswap.com');
    console.log('   Password: demo123');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await dbConnection.close();
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'reset':
    resetDatabase();
    break;
  case 'init':
  default:
    initDatabase();
    break;
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await dbConnection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down...');
  await dbConnection.close();
  process.exit(0);
});
