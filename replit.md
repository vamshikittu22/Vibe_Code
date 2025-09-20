# AI Coding Platform - Replit Setup

## Overview
A full-stack AI coding platform with a React frontend using Monaco Editor and a Node.js backend powered by Gemini Pro. This is an imported GitHub project that has been configured to run in the Replit environment.

## Recent Changes - September 20, 2025
- Successfully imported and configured GitHub project for Replit environment
- Simplified frontend dependencies to resolve version conflicts
- Updated port configuration: Frontend (5000), Backend (8000)
- Configured Vite for Replit proxy compatibility with host: 0.0.0.0
- Set up proper CORS configuration for cross-origin requests
- Created minimal working Monaco code editor interface
- Configured deployment settings for production autoscale

## Project Architecture
### Frontend (Port 5000)
- **Framework**: React 18 with Vite
- **Editor**: Monaco Editor via @monaco-editor/react
- **UI Framework**: Material-UI (minimal setup)
- **Build System**: Vite with host configured for 0.0.0.0:5000
- **Proxy**: API calls proxied to backend at port 8000

### Backend (Port 8000)  
- **Framework**: Node.js with Express
- **AI Integration**: Google Gemini Pro API
- **Database**: MongoDB (configured but not connected)
- **CORS**: Configured to allow all origins in development
- **Host**: Bound to localhost:8000

## User Preferences
- Dark theme Monaco editor
- JavaScript syntax highlighting by default
- Minimal UI approach focusing on code editor functionality

## Development Workflows
- **Frontend**: `cd frontend && npm run dev` - Serves on port 5000
- **Backend**: `cd backend && npm run dev` - Serves on port 8000 with nodemon

## Deployment Configuration
- **Target**: Autoscale (stateless web application)
- **Build**: `cd frontend && npm run build`
- **Run**: `cd frontend && npm run preview -- --host 0.0.0.0 --port 5000`

## Environment Variables Required
### Backend (.env)
- `GEMINI_API_KEY`: Google Gemini Pro API key for AI functionality
- `MONGODB_URI`: MongoDB connection string (if database features needed)
- `JWT_SECRET`: JWT signing secret for authentication

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API endpoint (configured for Replit domain)

## Current Status
✅ Basic application running successfully
✅ Monaco code editor functional
✅ Frontend/backend communication configured
⚠️ AI features require GEMINI_API_KEY configuration
⚠️ Database features require MongoDB setup
⚠️ Authentication features simplified (missing full implementation)

## Next Steps for User
1. Add GEMINI_API_KEY to backend/.env for AI functionality
2. Set up MongoDB if persistent data storage needed
3. Implement missing pages (projects, settings, authentication)
4. Add additional Monaco editor themes and languages
5. Test and enhance AI assistant integration