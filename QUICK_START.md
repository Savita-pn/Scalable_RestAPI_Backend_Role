# 🚀 Quick Start - Test the API in 5 Minutes

## Prerequisites Check
- ✅ Node.js installed (`node --version`)
- ✅ MongoDB running (local or cloud)

## 1. Install & Start (2 minutes)

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

Server should start at: http://localhost:5000

## 2. Test API Endpoints (3 minutes)

### Option A: Use Swagger UI (Recommended)
1. Open: http://localhost:5000/api-docs
2. Click "Try it out" on any endpoint
3. Test the complete flow:
   - Register user → Login → Create task → Get tasks

### Option B: Use Test Script
```bash
# Run automated tests
node test-api.js
```

### Option C: Manual cURL Commands
```bash
# 1. Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 2. Login (copy the token from response)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Create task (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Task","description":"Testing the API"}'

# 4. Get all tasks
curl -X GET http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 3. Test Frontend (Optional)

```bash
# In a new terminal
npm run client
```

Frontend will open at: http://localhost:3000

## 🎯 What to Test

### Core Features
- [x] User registration with validation
- [x] User login with JWT token
- [x] Protected routes (try accessing tasks without token)
- [x] Task creation, reading, updating, deleting
- [x] Role-based access (user vs admin)
- [x] Error handling (try invalid data)

### Security Features
- [x] Password hashing (check database)
- [x] JWT token expiration
- [x] Rate limiting (make 100+ requests quickly)
- [x] Input validation (try invalid email, short password)

## 🔍 Expected Results

### Successful Registration Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Successful Task Creation Response
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "Test Task",
      "description": "Testing the API",
      "status": "pending",
      "priority": "medium",
      "createdBy": "...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## 🚨 Troubleshooting

### Server won't start?
- Check if MongoDB is running
- Verify .env file exists with correct values
- Run `npm install` to ensure dependencies are installed

### Database connection error?
- Make sure MongoDB is running on port 27017
- Check MONGODB_URI in .env file
- For cloud MongoDB, verify connection string

### Frontend won't connect?
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_URL in frontend

## 📊 Performance Benchmarks

Expected response times (local development):
- Authentication: < 200ms
- Task CRUD: < 100ms
- Database queries: < 50ms

## 🎉 Success Indicators

If everything works correctly, you should see:
- ✅ Server starts without errors
- ✅ Swagger documentation loads
- ✅ User registration/login works
- ✅ Tasks can be created and retrieved
- ✅ Frontend connects to backend
- ✅ All API tests pass

**Total testing time: ~5 minutes**

---

**Ready for production deployment and scalability testing!** 🚀