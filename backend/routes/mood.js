// Legacy mood routes handling CRUD and badge unlocks.
const express = require('express');
const { body, validationResult } = require('express-validator');
const MoodLog = require('../models/MoodLog');
const Badge = require('../models/Badge');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

const checkAndUnlockBadges = async (userId) => {
  try {
    const moodLogs = await MoodLog.find({ user: userId }).sort({ createdAt: -1 });
    const totalLogs = moodLogs.length;

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

    const uniqueMoods = [...new Set(moodLogs.map(log => log.mood))].length;

    const loggedNotes = moodLogs.filter(log => log.note && log.note.trim().length > 0).length;

    const recentLogs = moodLogs.slice(0, 7);
    const calmCount = recentLogs.filter(log => ['calm', 'peaceful', 'content'].includes(log.mood)).length;
    const calmWeek = recentLogs.length >= 7 && calmCount >= 5;

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

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const moodLogs = await MoodLog.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MoodLog.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: moodLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get mood logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const moodLog = await MoodLog.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!moodLog) {
      return res.status(404).json({
        success: false,
        message: 'Mood log not found'
      });
    }

    res.json({
      success: true,
      data: moodLog
    });
  } catch (error) {
    console.error('Get mood log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/', [
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('mood').isString().isLength({ min: 1 }).withMessage('Please provide a mood'),
  body('emoji').isString().isLength({ min: 1 }).withMessage('Please provide an emoji'),
  body('intensity').isInt({ min: 1, max: 100 }).withMessage('Intensity must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { date, mood, emoji, intensity, note, tags, location, weather } = req.body;

    const existingLog = await MoodLog.findOne({
      user: req.user._id,
      date: date
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: 'Mood log already exists for this date'
      });
    }

    const moodLog = await MoodLog.create({
      user: req.user._id,
      date,
      mood,
      emoji,
      intensity,
      note: note || '',
      tags: tags || [],
      location: location || '',
      weather: weather || ''
    });

    await checkAndUnlockBadges(req.user._id);

    res.status(201).json({
      success: true,
      data: moodLog
    });
  } catch (error) {
    console.error('Create mood log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.put('/:id', [
  body('date').optional().isISO8601().withMessage('Please provide a valid date'),
  body('mood').optional().isString().isLength({ min: 1 }).withMessage('Please provide a mood'),
  body('emoji').optional().isString().isLength({ min: 1 }).withMessage('Please provide an emoji'),
  body('intensity').optional().isInt({ min: 1, max: 100 }).withMessage('Intensity must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const moodLog = await MoodLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!moodLog) {
      return res.status(404).json({
        success: false,
        message: 'Mood log not found'
      });
    }

    res.json({
      success: true,
      data: moodLog
    });
  } catch (error) {
    console.error('Update mood log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const moodLog = await MoodLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!moodLog) {
      return res.status(404).json({
        success: false,
        message: 'Mood log not found'
      });
    }

    res.json({
      success: true,
      message: 'Mood log deleted'
    });
  } catch (error) {
    console.error('Delete mood log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
