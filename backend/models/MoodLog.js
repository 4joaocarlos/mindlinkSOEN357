const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: [true, 'Please add a date']
  },
  mood: {
    type: String,
    required: [true, 'Please add a mood'],
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'tired', 'frustrated', 'peaceful', 'energized', 'overwhelmed', 'content', 'stressed', 'grateful', 'confused', 'motivated']
  },
  emoji: {
    type: String,
    required: [true, 'Please add an emoji']
  },
  intensity: {
    type: Number,
    required: [true, 'Please add intensity'],
    min: [1, 'Intensity must be at least 1'],
    max: [100, 'Intensity cannot be more than 100']
  },
  note: {
    type: String,
    maxlength: [1000, 'Note cannot be more than 1000 characters'],
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    default: ''
  },
  weather: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodLogSchema.index({ user: 1, date: -1 });
moodLogSchema.index({ user: 1, createdAt: -1 });

// Update the updatedAt field before saving
moodLogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
