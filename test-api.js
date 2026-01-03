const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';
let authToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'user'
};

const testTask = {
  title: 'Test Task',
  description: 'This is a test task for API verification',
  priority: 'high',
  status: 'pending'
};

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health Check:', healthResponse.data.status);

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    authToken = registerResponse.data.data.token;
    console.log('✅ User Registration:', registerResponse.data.message);

    // Test 3: User Login
    console.log('\n3. Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = loginResponse.data.data.token;
    console.log('✅ User Login:', loginResponse.data.message);

    // Test 4: Get Current User
    console.log('\n4. Testing Get Current User...');
    const userResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Current User:', userResponse.data.data.user.name);

    // Test 5: Create Task
    console.log('\n5. Testing Create Task...');
    const createTaskResponse = await axios.post(`${API_BASE}/tasks`, testTask, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const taskId = createTaskResponse.data.data.task._id;
    console.log('✅ Task Created:', createTaskResponse.data.data.task.title);

    // Test 6: Get All Tasks
    console.log('\n6. Testing Get All Tasks...');
    const tasksResponse = await axios.get(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Tasks Retrieved:', tasksResponse.data.data.tasks.length, 'tasks');

    // Test 7: Get Task by ID
    console.log('\n7. Testing Get Task by ID...');
    const taskResponse = await axios.get(`${API_BASE}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Task Retrieved:', taskResponse.data.data.task.title);

    // Test 8: Update Task
    console.log('\n8. Testing Update Task...');
    const updateTaskResponse = await axios.put(`${API_BASE}/tasks/${taskId}`, {
      status: 'completed'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Task Updated:', updateTaskResponse.data.data.task.status);

    // Test 9: Delete Task
    console.log('\n9. Testing Delete Task...');
    const deleteTaskResponse = await axios.delete(`${API_BASE}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Task Deleted:', deleteTaskResponse.data.message);

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📚 API Documentation: http://localhost:5000/api-docs');
    console.log('🌐 Frontend: http://localhost:3000');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Make sure the server is running: npm run dev');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/health');
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm run dev');
    return;
  }

  await runTests();
}

main();