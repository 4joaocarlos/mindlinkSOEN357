// Legacy user routes for stats, badges, and dashboard data.
const express = require('express');
const MoodLog = require('../models/MoodLog');
const Badge = require('../models/Badge');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', async (req, res) => {
  try {
    const moodLogs = await MoodLog.find({ user: req.user._id }).sort({ date: -1 });

    if (moodLogs.length === 0) {
      return res.json({
        success: true,
        data: {
          currentStreak: 0,
          longestStreak: 0,
          totalLogs: 0,
          lastLogDate: null,
          averageIntensity: 0,
          mostCommonMood: null
        }
      });
    }

    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    for (let i = 0; i < moodLogs.length; i++) {
      const logDate = new Date(moodLogs[i].date).toISOString().split('T')[0];
      const expectedDate = checkDate.toISOString().split('T')[0];

      if (logDate === expectedDate) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < moodLogs.length; i++) {
      const prevDate = new Date(moodLogs[i - 1].date);
      const currDate = new Date(moodLogs[i].date);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const totalIntensity = moodLogs.reduce((sum, log) => sum + log.intensity, 0);
    const averageIntensity = Math.round(totalIntensity / moodLogs.length);

    const moodCounts = {};
    moodLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    });

    let mostCommonMood = null;
    let maxCount = 0;
    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = mood;
      }
    }

    res.json({
      success: true,
      data: {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        totalLogs: moodLogs.length,
        lastLogDate: moodLogs[0].date,
        averageIntensity,
        mostCommonMood
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/badges', async (req, res) => {
  try {
    const badges = await Badge.find({ user: req.user._id })
      .sort({ unlocked: -1, unlockedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      data: badges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    };

    const statsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/user/stats`, {
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      }
    });

    const statsData = statsResponse.ok ? (await statsResponse.json()).data : {
      currentStreak: 0,
      longestStreak: 0,
      totalLogs: 0,
      lastLogDate: null
    };

    const badgesResponse = await fetch(`${req.protocol}://${req.get('host')}/api/user/badges`, {
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      }
    });

    const badgesData = badgesResponse.ok ? (await badgesResponse.json()).data : [];

    const recentLogs = await MoodLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user,
        stats: statsData,
        badges: badgesData,
        recentLogs
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
