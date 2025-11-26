# MindLink Backend API

A Node.js/Express backend for the MindLink mood tracking application, using MongoDB Atlas for cloud database storage.

## Features

- User authentication with JWT
- Mood logging and tracking
- Badge system for achievements
- Journal functionality
- User statistics and streaks
- RESTful API design

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update the values:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `FRONTEND_URL`: Your frontend URL (default: http://localhost:5173)

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster (free tier is fine for development)
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Update the `MONGODB_URI` in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password

### Mood Logs
- `GET /api/mood` - Get user's mood logs
- `GET /api/mood/:id` - Get specific mood log
- `POST /api/mood` - Create new mood log
- `PUT /api/mood/:id` - Update mood log
- `DELETE /api/mood/:id` - Delete mood log

### User Data
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/badges` - Get user badges
- `GET /api/user/dashboard` - Get dashboard data

### Journal
- `GET /api/journal` - Get journal entries (logs with notes)
- `GET /api/journal/:id` - Get specific journal entry
- `PUT /api/journal/:id` - Update journal entry note

## Deployment

### To Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set environment variables in Vercel dashboard

### To Render
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

### To Railway
1. Connect your GitHub repository
2. Add environment variables
3. Deploy

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 3001 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Build for production (no-op for now)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
