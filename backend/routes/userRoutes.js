// Routes for user stats, badges, dashboard data, and profile updates.
const express = require("express");
const JournalEntry = require("../models/JournalEntry");
const Badge = require("../models/Badge");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

router.get("/stats", async (req, res) => {
  try {
    const journalEntries = await JournalEntry.find({ user: req.userId }).sort({ date: -1 });

    if (journalEntries.length === 0) {
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

    const uniqueDates = [...new Set(journalEntries.map(entry => entry.date))].sort();

    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const logDate = new Date(uniqueDates[i]);
      const expectedDate = new Date(checkDate);

      if (logDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const totalIntensity = journalEntries.reduce((sum, log) => sum + log.intensity, 0);
    const averageIntensity = Math.round(totalIntensity / journalEntries.length);

    const moodCounts = {};
    journalEntries.forEach(log => {
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
        totalLogs: journalEntries.length,
        lastLogDate: journalEntries[0].date,
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

router.get("/badges", async (req, res) => {
  try {
    const badges = await Badge.find({ user: req.userId })
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

router.get("/dashboard", async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    const statsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/user/stats`, {
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      }
    });

    let statsData = {
      currentStreak: 0,
      longestStreak: 0,
      totalLogs: 0,
      lastLogDate: null
    };

    if (statsResponse.ok) {
      const statsResult = await statsResponse.json();
      statsData = statsResult.data;
    }

    const badges = await Badge.find({ user: req.userId });

    const recentLogs = await JournalEntry.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user: userInfo,
        stats: statsData,
        badges,
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

router.put("/profile", async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name.trim();
    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
