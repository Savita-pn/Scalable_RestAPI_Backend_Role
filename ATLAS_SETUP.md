# MongoDB Atlas Setup Guide

## Quick Setup (2 minutes)

1. **Get your connection string from Atlas:**
   - Go to your MongoDB Atlas cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scalable_api
   ```
   Replace:
   - `username` with your Atlas username
   - `password` with your Atlas password
   - `cluster` with your cluster name

3. **Start the application:**
   ```bash
   npm run dev
   ```

## Example Connection String
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/scalable_api
```

That's it! The app will automatically connect to Atlas.