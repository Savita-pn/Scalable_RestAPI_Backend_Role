@echo off
echo 🚀 Starting Scalable REST API Setup...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo ⚙️ Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb+srv://savita:Savita123s@cluster0.3zz5dai.mongodb.net/?appName=Cluster0
        echo JWT_SECRET=your_super_secret_jwt_key_change_in_production
        echo JWT_EXPIRE=7d
        echo NODE_ENV=development
    ) > .env
)

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Update MONGODB_URI in .env with your Atlas connection string
echo 2. Run 'npm run dev' to start the backend server
echo 3. Run 'npm run client' to start the frontend (in a new terminal)
echo 4. Or run 'npm run dev:full' to start both simultaneously
echo.
echo 📚 API Documentation: http://localhost:5000/api-docs
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000

pause