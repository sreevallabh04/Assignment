# 🚀 Vercel Deployment Guide

This guide will walk you through deploying TaskFlow to Vercel with both frontend and backend components.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com) (free tier available)
- [GitHub Account](https://github.com) with your project repository
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database (recommended)
- Project pushed to GitHub

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React SPA)   │◄──►│   (Node.js API) │
│   Vercel        │    │   Vercel        │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼──────► MongoDB Atlas
                                 │
                         Socket.IO Connection
```

## 🔧 Step 1: Prepare Your Repository

Ensure your project structure looks like this:

```
taskflow-collaborative-board/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── vercel.json
│   └── .env.production
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vercel.json
│   └── .env.production
├── vercel.json (root)
├── DEPLOYMENT.md
└── README.md
```

## 🌐 Step 2: Deploy Backend to Vercel

### 2.1 Create Backend Deployment

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select "backend" folder as root directory

3. **Configure Build Settings**
   ```
   Framework Preset: Other
   Root Directory: backend
   Build Command: npm run build
   Output Directory: (leave empty)
   Install Command: npm install
   ```

### 2.2 Set Environment Variables

In Vercel dashboard, go to Settings → Environment Variables:

```bash
# Required Variables
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=[Generate new 64-character secret]
CLIENT_URL=https://your-frontend-url.vercel.app

# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.3 Deploy Backend

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-backend-name.vercel.app`

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Frontend Deployment

1. **Import Frontend Project**
   - Click "New Project" again
   - Import the same repository
   - Select "frontend" folder as root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

### 3.2 Set Environment Variables

In frontend Vercel dashboard, set:

```bash
# Replace with your actual backend URL
REACT_APP_API_URL=https://your-backend-name.vercel.app
REACT_APP_SOCKET_URL=https://your-backend-name.vercel.app
REACT_APP_TITLE=TaskFlow
REACT_APP_ENV=production
```

### 3.3 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-frontend-name.vercel.app`

## 🔄 Step 4: Update Backend CORS

Update your backend environment variables with the frontend URL:

```bash
CLIENT_URL=https://your-frontend-name.vercel.app
```

Redeploy the backend for changes to take effect.

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend API

Visit your backend URL endpoints:
- `https://your-backend-name.vercel.app/` (should show "Collaborative To-Do Board API")
- `https://your-backend-name.vercel.app/api/auth/` (should show 404 or method not allowed)

### 5.2 Test Frontend Application

1. Visit your frontend URL
2. Register a new account
3. Create tasks and test functionality
4. Verify real-time features work

### 5.3 Test Integration

1. Open browser developer tools
2. Check Network tab for API calls
3. Verify WebSocket connections
4. Test all features end-to-end

## 🔧 Alternative: Single Domain Deployment

For a single domain setup (both frontend and backend on same URL):

### Update Root vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/build/$1"
    }
  ]
}
```

### Deploy from Root

1. Import entire repository (not subdirectories)
2. Use root `vercel.json` configuration
3. Set all environment variables in one project

## 🛠️ Troubleshooting

### Common Issues

#### Backend Deployment Fails
```bash
# Check logs in Vercel dashboard
# Verify all environment variables are set
# Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0
# Check Node.js version compatibility
```

#### Frontend Can't Connect to Backend
```bash
# Verify REACT_APP_API_URL is correct
# Check CORS settings in backend
# Ensure CLIENT_URL is set correctly in backend
# Check browser console for errors
```

#### Socket.IO Connection Issues
```bash
# Verify REACT_APP_SOCKET_URL matches backend URL
# Check Vercel function timeout settings
# Ensure WebSocket support is enabled
```

#### Database Connection Issues
```bash
# Verify MongoDB Atlas connection string
# Check IP whitelist (use 0.0.0.0/0 for Vercel)
# Ensure database user has proper permissions
# Test connection string locally first
```

### Environment Variable Issues

#### Variables Not Loading
```bash
# Ensure variables start with REACT_APP_ for frontend
# Check variable names match exactly
# Redeploy after adding variables
# Check Vercel dashboard for typos
```

#### CORS Errors
```bash
# Update CLIENT_URL in backend
# Redeploy backend after URL changes
# Check browser network tab for actual URLs
# Verify no trailing slashes in URLs
```

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Production Branch**: Push to `main` branch
2. **Preview Deployments**: Push to any other branch
3. **Environment Variables**: Set per branch if needed

### Manual Deployments

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from local machine
vercel --prod

# Deploy specific directory
vercel --prod --cwd backend
vercel --prod --cwd frontend
```

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable Analytics in Vercel dashboard
2. Monitor performance metrics
3. Track deployment success rates
4. View real-time usage data

### Error Monitoring

1. Check Vercel Function logs
2. Set up error tracking (Sentry, LogRocket)
3. Monitor MongoDB Atlas metrics
4. Set up uptime monitoring

## 🚀 Performance Optimization

### Frontend Optimizations

```json
// frontend/vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Backend Optimizations

```json
// backend/vercel.json
{
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

## 🔐 Security Considerations

### Production Security Checklist

- [ ] Different JWT secrets for production
- [ ] MongoDB Atlas IP whitelisting
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation enabled
- [ ] Error messages sanitized

### Environment Variables Security

- Never commit `.env` files
- Use different secrets for each environment
- Regularly rotate JWT secrets
- Monitor access logs
- Use Vercel's encrypted environment variables

## 📞 Support & Resources

### Vercel Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Node.js Deployment Guide](https://vercel.com/docs/concepts/functions/serverless-functions)
- [React Deployment Guide](https://vercel.com/docs/concepts/next.js/overview)

### MongoDB Resources
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)

### Getting Help
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **GitHub Issues**: Create issue in your repository
- **Community**: [Vercel Discord](https://vercel.com/discord)

---

🎉 **Congratulations!** Your TaskFlow application should now be live on Vercel with both frontend and backend properly connected and configured for production use.

**Frontend URL**: `https://your-frontend-name.vercel.app`  
**Backend URL**: `https://your-backend-name.vercel.app`

Remember to update your README.md with the live URLs once deployment is complete! 