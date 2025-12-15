
# MindLink

**Group Members**
- Bastidas, Juan (40228022)
- Qasem, Laith (40200060)
- Guarraci, Antonino (40264079)
- Guidi, Benedetto (40228072)
- Makarem, Wael (40164710)

A mood tracking and journaling application with full-stack functionality.
Made for SOEN 357 for the Fall 2025 semester.
Our fully functioning app can be accessed at: [https://mindlink-soen-357-3hvk63v5v-4joaocarlos-projects.vercel.app/](https://mindlink-soen-357.vercel.app/)

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


## Run Locally (frontend + backend)

1. Install Node.js 18+ and npm (or yarn).
2. Install frontend deps from the repo root:
   ```bash
   npm install
   ```
3. Install backend deps:
   ```bash
   cd backend
   npm install
   ```
4. Create backend env file (fills in secrets/URLs):
   ```bash
   cp env-setup.txt .env
   # edit .env with your MongoDB URI, JWT secret, FRONTEND_URL, etc.
   ```
5. Start the backend API (port 3001):
   ```bash
   npm run dev
   ```
6. In a second terminal, start the frontend (port 3002):
   ```bash
   cd <repo-root>
   npm run dev
   ```
7. Open the app at http://localhost:3002 and ensure the backend is reachable at http://localhost:3001.

## Usage

1. **Sign Up**: Create a new account or log in
2. **Log Moods**: Use the main screen to log your daily moods
3. **Add Notes**: Include journal entries with your mood logs
4. **View Trends**: Check the Trends screen for analytics
5. **Track Streaks**: Maintain daily logging streaks and unlock badges
6. **Browse Journal**: View all your journal entries

## API Documentation

Deployed using Vercel and Render.

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



## License
Used Figma for design and Icon packages
MIT License
  
