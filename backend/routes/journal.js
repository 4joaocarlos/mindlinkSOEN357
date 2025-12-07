// Legacy journal routes for note-based entries.
const express = require('express');
const { body, validationResult } = require('express-validator');
const MoodLog = require('../models/MoodLog');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const journalEntries = await MoodLog.find({
      user: req.user._id,
      note: { $exists: true, $ne: '' }
    })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MoodLog.countDocuments({
      user: req.user._id,
      note: { $exists: true, $ne: '' }
    });

    res.json({
      success: true,
      data: journalEntries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const journalEntry = await MoodLog.findOne({
      _id: req.params.id,
      user: req.user._id,
      note: { $exists: true, $ne: '' }
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: journalEntry
    });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.put('/:id', [
  body('note').isString().isLength({ min: 1, max: 1000 }).withMessage('Note must be between 1 and 1000 characters')
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

    const journalEntry = await MoodLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { note: req.body.note },
      { new: true, runValidators: true }
    );

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: journalEntry
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
