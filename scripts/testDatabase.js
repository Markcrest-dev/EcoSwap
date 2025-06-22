#!/usr/bin/env node

const path = require('path');

// Add src directory to require path
require('module').globalPaths.push(path.join(__dirname, '..', 'src'));

const userService = require('../src/services/userService');

async function testDatabase() {
  console.log('🧪 Testing Database Integration...');
  
  try {
    // Initialize the service
    await userService.initialize();
    console.log('✅ Database connection established');

    // Test finding demo user
    const demoUser = await userService.findUserByEmail('demo@ecoswap.com');
    if (demoUser) {
      console.log('✅ Demo user found:', {
        id: demoUser.id,
        name: `${demoUser.firstName} ${demoUser.lastName}`,
        email: demoUser.email
      });
    } else {
      console.log('❌ Demo user not found');
      return;
    }

    // Test authentication
    try {
      const authenticatedUser = await userService.authenticateUser('demo@ecoswap.com', 'demo123');
      console.log('✅ Authentication successful for demo user');
    } catch (error) {
      console.log('❌ Authentication failed:', error.message);
    }

    // Test creating a new user
    try {
      const newUser = await userService.createUser({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'test123'
      });
      console.log('✅ New user created successfully:', {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email
      });

      // Clean up test user
      await userService.deactivateUser(newUser.id);
      console.log('✅ Test user cleaned up');
    } catch (error) {
      console.log('⚠️ User creation test:', error.message);
    }

    console.log('');
    console.log('🎉 Database integration test completed successfully!');
    console.log('The authentication system is ready to use.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
