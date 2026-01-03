#!/bin/bash

echo "🚀 Starting Scalable REST API Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Windows: Start MongoDB service"
    echo "   macOS: brew services start mongodb-community"
    echo "   Linux: sudo systemctl start mongod"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env 2>/dev/null || cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scalable_api
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EOF
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Run 'npm run dev' to start the backend server"
echo "3. Run 'npm run client' to start the frontend (in a new terminal)"
echo "4. Or run 'npm run dev:full' to start both simultaneously"
echo ""
echo "📚 API Documentation: http://localhost:5000/api-docs"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"