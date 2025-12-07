// Journal routes for creating, listing, and updating mood entries with badge checks.
const express = require("express");
const JournalEntry = require("../models/JournalEntry");
const Badge = require("../models/Badge");
const auth = require("../middleware/auth");
const { todayDateString } = require("../utils/dateUtils");

const router = express.Router();

router.use(auth);

const checkAndUnlockBadges = async (userId) => {
  try {
    const journalEntries = await JournalEntry.find({ user: userId }).sort({ createdAt: -1 });
    const totalLogs = journalEntries.length;

    let currentStreak = 0;
    const today = todayDateString();
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

    const uniqueMoods = [...new Set(journalEntries.map(log => log.mood))].length;

    const loggedNotes = journalEntries.filter(log => log.note && log.note.trim().length > 0).length;

    const recentEntries = journalEntries.slice(0, 7);
    const calmCount = recentEntries.filter(log => ['calm', 'peaceful', 'content'].includes(log.mood)).length;
    const calmWeek = recentEntries.length >= 7 && calmCount >= 5;

    const badgeCriteria = {
      logs: totalLogs >= 1,
      streak: currentStreak,
      totalLogs,
      uniqueMoods,
      loggedNotes,
      calmWeek
    };

    const userBadges = await Badge.find({ user: userId });

    const predefinedBadges = Badge.getPredefinedBadges();
    const badgesToUnlock = [];

    for (const predefinedBadge of predefinedBadges) {
      const userBadge = userBadges.find(b => b.badgeId === predefinedBadge.badgeId);

      if (userBadge && !userBadge.unlocked) {
        let shouldUnlock = false;

        if (predefinedBadge.badgeId === 'welcome' || predefinedBadge.badgeId === 'beginner') {
          shouldUnlock = badgeCriteria.logs;
        } else if (predefinedBadge.badgeId.startsWith('streak-')) {
          const requiredStreak = parseInt(predefinedBadge.badgeId.split('-')[1]);
          shouldUnlock = badgeCriteria.streak >= requiredStreak;
        } else if (predefinedBadge.badgeId.startsWith('consistent-')) {
          const requiredLogs = parseInt(predefinedBadge.badgeId.split('-')[1]);
          shouldUnlock = badgeCriteria.totalLogs >= requiredLogs;
        } else if (predefinedBadge.badgeId === 'explorer') {
          shouldUnlock = badgeCriteria.uniqueMoods >= 5;
        } else if (predefinedBadge.badgeId === 'reflector') {
          shouldUnlock = badgeCriteria.loggedNotes >= 10;
        } else if (predefinedBadge.badgeId === 'zen') {
          shouldUnlock = badgeCriteria.calmWeek;
        }

        if (shouldUnlock) {
          badgesToUnlock.push(userBadge._id);
        }
      }
    }

    if (badgesToUnlock.length > 0) {
      await Badge.updateMany(
        { _id: { $in: badgesToUnlock } },
        { unlocked: true, unlockedAt: new Date() }
      );
    }

    return badgesToUnlock.length;
  } catch (error) {
    console.error('Badge check error:', error);
    return 0;
  }
};

router.post("/", async (req, res) => {
  try {
    const { date, mood, emoji, intensity, note, tags, location, weather } = req.body;
    const userId = req.userId;

    if (!mood || !emoji || intensity === undefined) {
      return res.status(400).json({ error: "Mood, emoji, and intensity are required" });
    }

    const entryDate = date || todayDateString();

    const entry = new JournalEntry({
      user: userId,
      date: entryDate,
      mood,
      emoji,
      intensity,
      note: note || '',
      tags: tags || [],
      location: location || '',
      weather: weather || ''
    });

    await entry.save();

    await checkAndUnlockBadges(userId);

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.error("Create journal error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { from, to, page = 1, limit = 50 } = req.query;

    const query = { user: userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }

    const skip = (page - 1) * limit;

    const entries = await JournalEntry.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JournalEntry.countDocuments(query);

    res.json({
      success: true,
      data: entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Get journals error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/today", async (req, res) => {
  try {
    const userId = req.userId;
    const date = todayDateString();
    const entry = await JournalEntry.findOne({ user: userId, date });
    res.json({
      success: true,
      data: entry || null
    });
  } catch (err) {
    console.error("Get today error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.error("Get entry error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.error("Update entry error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json({
      success: true,
      message: "Entry deleted"
    });
  } catch (err) {
    console.error("Delete entry error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/streak/stats", async (req, res) => {
  try {
    const userId = req.userId;
    const today = todayDateString();

    const allEntries = await JournalEntry.find({ user: userId })
      .select("date")
      .sort({ date: -1 });

    const uniqueDates = [...new Set(allEntries.map((e) => e.date))];

    const currentStreak = computeStreak(uniqueDates, today);

    const longestStreak = computeLongestStreak(uniqueDates);

    res.json({
      success: true,
      data: {
        currentStreak,
        longestStreak
      }
    });
  } catch (err) {
    console.error("Streak error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

function computeStreak(datesDesc, todayStr) {
  if (datesDesc.length === 0) return 0;

  let streak = 0;
  let currentDay = new Date(todayStr + "T00:00:00Z");

  while (true) {
    const dateStr = currentDay.toISOString().slice(0, 10);

    if (datesDesc.includes(dateStr)) {
      streak += 1;
      currentDay.setUTCDate(currentDay.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function computeLongestStreak(datesDesc) {
  if (datesDesc.length === 0) return 0;
  const datesAsc = [...datesDesc]
    .map((d) => new Date(d + "T00:00:00Z"))
    .sort((a, b) => a - b);

  let longest = 1;
  let current = 1;

  for (let i = 1; i < datesAsc.length; i++) {
    const prev = datesAsc[i - 1];
    const curr = datesAsc[i];
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current += 1;
    } else if (diffDays > 1) {
      if (current > longest) longest = current;
      current = 1;
    }
  }

  if (current > longest) longest = current;
  return longest;
}

module.exports = router;
