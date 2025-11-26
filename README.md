
# MindLink

A mood tracking and journaling application with full-stack functionality.

The original design is available at https://www.figma.com/design/uYSMpnsJlLZZV1NSHAdzBX/MindLink.

## Features

- **Mood Logging**: Track your daily moods with intensity levels and notes
- **Journal**: Keep personal journal entries alongside mood logs
- **Streaks**: Maintain daily logging streaks with achievement badges
- **Analytics**: View trends and patterns in your mood data
- **User Authentication**: Secure signup/login with password recovery
- **Responsive Design**: Mobile-first design optimized for iPhone

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas (cloud)
- **Authentication**: JWT tokens with bcryptjs
- **Architecture**: RESTful API with MVC pattern
- **Security**: Helmet, CORS, rate limiting
- **Features**: User auth, mood logging, streak tracking, badge system

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to https://www.mongodb.com/atlas and create a free account
   - Create a new cluster (M0 Sandbox is free)
   - Create a database user with read/write permissions
   - Whitelist your IP address (or 0.0.0.0/0 for development)
   - Get your connection string from "Connect" → "Connect your application"

### Backend Setup

1. **Set up MongoDB Atlas**:
   - Create account at https://www.mongodb.com/atlas
   - Create cluster (M0 free tier works)
   - Create database user and get connection string
   - Whitelist your IP (or 0.0.0.0/0 for development)

2. **Configure environment**:
   ```bash
   cd backend
   # Copy the env template that was created
   cp ../env-template.txt .env
   ```
   Edit `.env` and set:
   - `MONGODB_URI`: Your Atlas connection string
   - `JWT_SECRET`: Secure random string for JWT signing

3. **Install and start**:
   ```bash
   npm install
   npm run dev
   ```
   Backend runs on `http://localhost:3001`

4. **Test the backend** (optional):
   ```bash
   npm run test
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd SOEN357
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account or log in
2. **Log Moods**: Use the main screen to log your daily moods
3. **Add Notes**: Include journal entries with your mood logs
4. **View Trends**: Check the Trends screen for analytics
5. **Track Streaks**: Maintain daily logging streaks and unlock badges
6. **Browse Journal**: View all your journal entries

## API Documentation

See the backend README for complete API documentation.

## Project Structure

```
/
├── src/               # Frontend React app
│   ├── components/    # React components
│   ├── utils/         # API utilities and mock data
│   ├── styles/        # Global styles
│   └── ...
├── backend/           # Express.js API server
│   ├── models/        # MongoDB models (User, JournalEntry, Badge)
│   ├── routes/        # API routes (auth, journals, user)
│   ├── middleware/    # JWT authentication middleware
│   ├── utils/         # Date utilities for streaks
│   ├── server.js      # Main server file
│   ├── package.json
│   └── README.md      # Backend documentation
├── test-backend.js    # Backend testing script
├── package.json       # Frontend dependencies
└── README.md          # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

MIT License
  