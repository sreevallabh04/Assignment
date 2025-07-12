# 🚀 Render Deployment Guide for TaskFlow

This guide will walk you through deploying TaskFlow to Render with both frontend and backend services.

## 📋 Prerequisites

- [Render Account](https://render.com) (free tier available)
- [GitHub Account](https://github.com) with your project repository
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database
- Project pushed to GitHub

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React SPA)   │◄──►│   (Node.js API) │
│   Render        │    │   Render        │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼──────► MongoDB Atlas
                                 │
                         Socket.IO Connection
```

## 🔧 Step 1: Deploy Backend to Render

### 1.1 Create Backend Service

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure settings:

```
Name: taskflow-backend
Environment: Node
Region: Choose closest to you
Branch: master
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 1.2 Set Environment Variables

In the backend service settings, add these environment variables:

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true
JWT_SECRET=your-64-character-secret-key-here
CLIENT_URL=https://your-frontend-url.onrender.com
```

### 1.3 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://taskflow-backend.onrender.com`

## 🎨 Step 2: Deploy Frontend to Render

### 2.1 Create Frontend Service

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect the same GitHub repository
   - Configure settings:

```
Name: taskflow-frontend
Environment: Static Site
Region: Choose closest to you
Branch: master
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

### 2.2 Set Environment Variables

In the frontend service settings, add these environment variables:

```bash
REACT_APP_API_URL=https://taskflow-backend.onrender.com
REACT_APP_SOCKET_URL=https://taskflow-backend.onrender.com
REACT_APP_TITLE=TaskFlow
REACT_APP_ENV=production
```

### 2.3 Deploy Frontend

1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note your frontend URL: `https://taskflow-frontend.onrender.com`

## 🔄 Step 3: Update Backend CORS

After frontend deployment, update your backend environment variables:

```bash
CLIENT_URL=https://taskflow-frontend.onrender.com
```

Redeploy the backend for changes to take effect.

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend API

Visit your backend URL endpoints:
- `https://taskflow-backend.onrender.com/` (should show "Collaborative To-Do Board API")
- `https://taskflow-backend.onrender.com/api/auth/` (should show 404 or method not allowed)

### 4.2 Test Frontend Application

1. Visit your frontend URL
2. Register a new account
3. Create tasks and test functionality
4. Verify real-time features work

### 4.3 Test Integration

1. Open browser developer tools
2. Check Network tab for API calls
3. Verify WebSocket connections
4. Test all features end-to-end

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json
   - Ensure Node.js version compatibility

2. **Environment Variables**
   - Double-check all environment variables are set
   - Verify MongoDB connection string is correct
   - Ensure JWT secret is properly configured

3. **CORS Errors**
   - Verify CLIENT_URL matches your frontend URL exactly
   - Check that backend CORS settings include frontend domain

4. **Socket.IO Issues**
   - Ensure REACT_APP_SOCKET_URL is set correctly
   - Check that backend Socket.IO is properly configured

## 🔧 Environment Variables Reference

### Backend Environment Variables
```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true
JWT_SECRET=your-64-character-secret-key-here
CLIENT_URL=https://taskflow-frontend.onrender.com
```

### Frontend Environment Variables
```bash
REACT_APP_API_URL=https://taskflow-backend.onrender.com
REACT_APP_SOCKET_URL=https://taskflow-backend.onrender.com
REACT_APP_TITLE=TaskFlow
REACT_APP_ENV=production
```

## 🎉 Success!

Your TaskFlow application is now deployed on Render with:
- ✅ Backend API running on Render
- ✅ Frontend React app running on Render
- ✅ MongoDB Atlas database connected
- ✅ Real-time features working
- ✅ Secure JWT authentication
- ✅ CORS properly configured

Your application is now live and ready for users! 🚀 