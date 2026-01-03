# Scalable REST API with Authentication & Role-Based Access

A full-stack application featuring a secure, scalable backend API with JWT authentication, role-based access control, and a React frontend for task management.

## 🚀 Features

### Backend (Primary Focus)
- ✅ User registration & login with password hashing (bcrypt)
- ✅ JWT authentication with secure token handling
- ✅ Role-based access control (user vs admin)
- ✅ CRUD APIs for task management with assignment system
- ✅ Task assignment feature (assignedTo & createdBy tracking)
- ✅ API versioning (/api/v1/)
- ✅ Comprehensive error handling & validation (Joi)
- ✅ Interactive API documentation (Swagger)
- ✅ MongoDB database with optimized schemas
- ✅ Security middleware (helmet, rate limiting, CORS)
- ✅ User management endpoints for task assignment

### Frontend (Supportive)
- ✅ React.js with modern hooks and context
- ✅ User registration & login interface
- ✅ Protected dashboard with JWT authentication
- ✅ Complete CRUD operations for tasks
- ✅ Task assignment interface with user dropdown
- ✅ Display of task creator and assignee information
- ✅ Modern gradient UI with animations
- ✅ Error/success message handling
- ✅ Responsive design with mobile support

### Security & Scalability
- ✅ Secure JWT token handling
- ✅ Input sanitization & validation
- ✅ Modular project structure
- ✅ Environment-based configuration
- ✅ Rate limiting and security headers

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Joi for validation
- Swagger for API documentation

**Frontend:**
- React.js with React Router
- Axios for API calls
- Context API for state management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd scalable-rest-api

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scalable_api
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# For Windows (if MongoDB is installed)
mongod

# For macOS with Homebrew
brew services start mongodb-community

# For Linux
sudo systemctl start mongod
```

### 4. Run the Application

```bash
# Start backend server (from root directory)
npm run dev

# Start frontend (in a new terminal)
npm run client

# Or run both concurrently
npm run dev:full
```

The application will be available at:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:5000/api-docs

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <jwt_token>
```

#### Get All Users
```http
GET /api/v1/auth/users
Authorization: Bearer <jwt_token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Get Task by ID
```http
GET /api/v1/tasks/:id
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the REST API project",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "assignedTo": "USER_ID_HERE"
}
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <jwt_token>
```

## 🏗️ Project Structure

```
scalable-rest-api/
├── server.js              # Main server file
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── models/
│   ├── User.js           # User model with authentication
│   └── Task.js           # Task model with relationships
├── routes/
│   ├── auth.js           # Authentication routes
│   └── tasks.js          # Task CRUD routes
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── errorHandler.js   # Global error handling
├── utils/
│   └── validation.js     # Joi validation schemas
└── client/               # React frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── context/      # Authentication context
    │   ├── services/     # API service layer
    │   └── App.js        # Main App component
    └── package.json      # Frontend dependencies
```

## 🔐 Security Features

1. **Password Security**: Bcrypt hashing with salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: Joi schema validation
5. **Security Headers**: Helmet.js for security headers
6. **CORS Configuration**: Controlled cross-origin requests
7. **Role-Based Access**: User and admin role separation

## 📈 Scalability Considerations

### Current Implementation
- **Modular Architecture**: Separated concerns with clear folder structure
- **Database Indexing**: Optimized queries with MongoDB indexes
- **Pagination**: Efficient data loading with pagination
- **Error Handling**: Centralized error management
- **Environment Configuration**: Easy deployment across environments

### Future Enhancements
- **Microservices**: Split into user service and task service
- **Caching**: Redis for session management and data caching
- **Load Balancing**: Horizontal scaling with load balancers
- **Database Sharding**: MongoDB sharding for large datasets
- **Message Queues**: Async processing with RabbitMQ/Redis
- **Containerization**: Docker for consistent deployments
- **API Gateway**: Centralized API management
- **Monitoring**: Application performance monitoring

## 🧪 Testing

### Manual Testing
1. Use the Swagger documentation at `/api-docs`
2. Test with Postman collection (can be exported from Swagger)
3. Use the React frontend for end-to-end testing

### API Testing Examples

```bash
# Register a new user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login and get token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create a task (replace TOKEN with actual JWT)
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Task","description":"This is a test task"}'
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_very_secure_secret_key_here
JWT_EXPIRE=7d
```

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 👥 User Roles

### User Role
- Create, read, update, delete their own tasks
- View tasks assigned to them
- Access personal dashboard

### Admin Role
- Full access to all tasks
- Can assign tasks to other users
- Complete system oversight

## 🔧 Development

### Available Scripts

```bash
# Backend
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run client     # Start React frontend
npm run dev:full   # Start both backend and frontend

# Frontend (in client directory)
npm start          # Start React development server
npm run build      # Build for production
npm test           # Run tests
```

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.



**Built with ❤️ for the Backend Developer Intern Assignment**