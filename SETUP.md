# 🚀 TaskFlow Setup Guide

## Quick Start

Follow these steps to get TaskFlow running locally in a secure manner.

## Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)  
- **MongoDB Atlas** account (recommended) or local MongoDB
- **Git** for version control

## 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd taskflow-collaborative-board

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2. Environment Setup

### Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your actual values
# Use your preferred editor (nano, vim, vscode, etc.)
nano .env
```

**Required Environment Variables:**

1. **MongoDB Connection**
   ```bash
   # For MongoDB Atlas (recommended)
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority
   
   # For local MongoDB
   # MONGO_URI=mongodb://localhost:27017/taskflow
   ```

2. **JWT Secret** (CRITICAL - Generate a secure secret)
   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # Copy the generated string to your .env file
   JWT_SECRET=your-generated-secret-here
   ```

3. **Other Configuration**
   ```bash
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

### Frontend Configuration

```bash
# Navigate to frontend directory
cd ../frontend

# Copy environment template
cp .env.example .env

# Edit .env file (usually default values work for development)
nano .env
```

**Frontend Environment Variables:**
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 3. MongoDB Setup

### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account
   - Create a new cluster

2. **Configure Database Access**
   - Go to Database Access
   - Create a new database user
   - Note down username and password

3. **Configure Network Access**
   - Go to Network Access
   - Add IP Address (0.0.0.0/0 for development, specific IPs for production)

4. **Get Connection String**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` with your values

### Option B: Local MongoDB

1. **Install MongoDB**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   # Start MongoDB service from Services panel
   ```

3. **Use Local Connection String**
   ```bash
   MONGO_URI=mongodb://localhost:27017/taskflow
   ```

## 4. Running the Application

### Start Backend Server

```bash
# In backend directory
cd backend
npm start

# You should see:
# 🚀 Server running on port 5000
# ✅ MongoDB connected successfully
```

### Start Frontend Application

```bash
# In frontend directory (new terminal)
cd frontend
npm start

# You should see:
# Compiled successfully!
# Local: http://localhost:3000
```

## 5. Verify Installation

1. **Open Browser**
   - Navigate to `http://localhost:3000`

2. **Test Registration**
   - Create a new account
   - Verify you can login

3. **Test Functionality**
   - Create a task
   - Drag and drop between columns
   - Use Smart Assign feature

4. **Test Real-time Features**
   - Open another browser window
   - Login with different account
   - Verify real-time updates

## 6. Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if MongoDB is running
# Check .env file configuration
# Verify all dependencies are installed
npm install
```

#### Frontend Won't Start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues
```bash
# Verify MongoDB URI format
# Check network connectivity
# Verify credentials
# Check IP whitelist (Atlas)
```

#### CORS Issues
```bash
# Verify CLIENT_URL in backend .env
# Check if both servers are running
# Verify frontend is using correct API URL
```

### Environment Variable Issues

#### Missing Variables
```bash
# Check if .env files exist
ls -la backend/.env frontend/.env

# Verify all required variables are set
cat backend/.env
```

#### Invalid JWT Secret
```bash
# Generate a new secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update .env file with new secret
```

## 7. Security Checklist

### Before Development
- [ ] `.env` files created and configured
- [ ] Strong JWT secret generated
- [ ] MongoDB credentials secured
- [ ] `.env` files added to `.gitignore`

### Before Deployment
- [ ] Production environment variables configured
- [ ] Different JWT secrets for production
- [ ] HTTPS enabled
- [ ] Database IP whitelisting configured
- [ ] Security headers implemented

## 8. Development Workflow

### Making Changes
```bash
# Backend changes (auto-restart with nodemon)
cd backend
npm run dev

# Frontend changes (auto-reload)
cd frontend
npm start
```

### Adding Dependencies
```bash
# Backend dependencies
cd backend
npm install package-name

# Frontend dependencies
cd frontend
npm install package-name
```

### Database Changes
```bash
# MongoDB collections are created automatically
# Schema changes require server restart
```

## 9. Production Deployment

### Environment Setup
1. **Backend Deployment** (Railway, Heroku, etc.)
   - Set production environment variables
   - Use production MongoDB database
   - Enable HTTPS

2. **Frontend Deployment** (Vercel, Netlify, etc.)
   - Build production bundle
   - Configure redirects for SPA
   - Update API URLs

### Security Considerations
- Use different secrets for production
- Enable IP whitelisting
- Implement rate limiting
- Set up monitoring and logging
- Regular security updates

## 10. Getting Help

### Documentation
- [Security Guide](./SECURITY.md)
- [API Documentation](./API.md)
- [Contributing Guide](./CONTRIBUTING.md)

### Support
- **Issues**: Create GitHub issue
- **Questions**: Check existing issues
- **Security**: Contact security@taskflow.dev

### Resources
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [React Documentation](https://reactjs.org/docs/)

---

**Important**: Never commit `.env` files to version control. Always use environment-specific configurations for production deployments.

Happy coding! 🚀 