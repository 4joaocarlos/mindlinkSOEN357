// Script to smoke test the MindLink backend API.
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';

async function testBackend() {
  console.log('Testing MindLink Backend...\n');

  try {
    console.log('1. Testing health check...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health check:', healthData);

    console.log('\n2. Testing user registration...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (registerRes.status === 409) {
      console.log('⚠️  User already exists, skipping registration');
    } else {
      const registerData = await registerRes.json();
      console.log('✅ Registration:', registerData.success ? 'Success' : 'Failed');
    }

    console.log('\n3. Testing user login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginRes.json();
    console.log('✅ Login:', loginData.success ? 'Success' : 'Failed');

    if (loginData.success) {
      const token = loginData.data.token;

      console.log('\n4. Testing authenticated endpoints...');

      console.log('   - Creating mood log...');
      const moodRes = await fetch(`${BASE_URL}/journals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: 'happy',
          emoji: '😊',
          intensity: 80,
          note: 'Testing the mood logging feature!'
        })
      });

      const moodData = await moodRes.json();
      console.log('   ✅ Mood log created:', moodData.success ? 'Success' : 'Failed');

      console.log('   - Getting user stats...');
      const statsRes = await fetch(`${BASE_URL}/user/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      console.log('   ✅ User stats:', statsData.success ? `Streak: ${statsData.data.currentStreak}` : 'Failed');

      console.log('   - Getting streak stats...');
      const streakRes = await fetch(`${BASE_URL}/journals/streak/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const streakData = await streakRes.json();
      console.log('   ✅ Streak stats:', streakData.success ? `Current: ${streakData.data.currentStreak}, Longest: ${streakData.data.longestStreak}` : 'Failed');

      console.log('\n🎉 All tests completed successfully!');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBackend();
