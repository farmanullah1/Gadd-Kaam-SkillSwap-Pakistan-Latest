const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/User');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runIntegrationTest() {
  console.log('=== Gadd Kaam API Integration Test Suite ===');
  
  const timestamp = Date.now();
  const username = `testuser_${timestamp}`;
  const email = `testuser_${timestamp}@gaddkaam.pk`;
  const phoneNumber = `03` + String(timestamp).slice(-9);
  
  const registrationPayload = {
    firstName: 'Test',
    lastName: 'User',
    username: username,
    email: email,
    phoneNumber: phoneNumber,
    dateOfBirth: '1998-08-18',
    cnicNumber: '42101-1234567-3',
    gender: 'Male',
    password: 'password123',
    confirmPassword: 'password123'
  };

  console.log(`\nStep 1: Registering new test user: @${username}`);
  let registerRes;
  try {
    registerRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, registrationPayload);

    if (registerRes.status === 201) {
      console.log('✅ Registration successful! User created.');
    } else {
      console.error(`❌ Registration failed with status ${registerRes.status}:`, registerRes.data);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Registration Request error:', err.message);
    process.exit(1);
  }

  const token = registerRes.data.token;

  console.log('\nStep 2: Logging in with registered user credentials');
  try {
    const loginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      credential: username,
      password: 'password123'
    });

    if (loginRes.status === 200) {
      console.log('✅ Login successful! Token acquired.');
    } else {
      console.error(`❌ Login failed with status ${loginRes.status}:`, loginRes.data);
      await cleanUpUser(username);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Login Request error:', err.message);
    await cleanUpUser(username);
    process.exit(1);
  }

  console.log('\nStep 3: Accessing private profile page using JWT Token');
  try {
    const profileRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/profile/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (profileRes.status === 200) {
      console.log(`✅ Private profile accessed successfully! Name: ${profileRes.data.user.firstName} ${profileRes.data.user.lastName}`);
    } else {
      console.error(`❌ Profile retrieval failed with status ${profileRes.status}:`, profileRes.data);
      await cleanUpUser(username);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Profile Request error:', err.message);
    await cleanUpUser(username);
    process.exit(1);
  }

  // Cleanup
  await cleanUpUser(username);
  console.log('\n=== All Tests Passed Successfully! ===');
}

async function cleanUpUser(username) {
  console.log(`\nCleanup: Deleting test user @${username} from database...`);
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gadd_kaam');
    const result = await User.deleteOne({ username: username.toLowerCase() });
    if (result.deletedCount > 0) {
      console.log('✅ Database clean. Test user deleted.');
    } else {
      console.log('⚠️ Test user not found during cleanup.');
    }
  } catch (err) {
    console.error('❌ Cleanup failed:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

runIntegrationTest();
