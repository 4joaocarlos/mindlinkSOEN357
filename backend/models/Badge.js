const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    badgeId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please add a badge name']
    },
    icon: {
      type: String,
      required: [true, 'Please add an icon']
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    category: {
      type: String,
      enum: ['streak', 'consistency', 'milestone', 'achievement', 'special'],
      default: 'achievement'
    },
    unlocked: {
      type: Boolean,
      default: false
    },
    unlockedAt: {
      type: Date
    },
    criteria: {
      type: mongoose.Schema.Types.Mixed, // Flexible criteria object
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
badgeSchema.index({ user: 1, badgeId: 1 }, { unique: true });
badgeSchema.index({ user: 1, unlocked: 1 });

// Static method to get predefined badges
badgeSchema.statics.getPredefinedBadges = function() {
  return [
    {
      badgeId: 'welcome',
      name: 'Welcome',
      icon: '🌟',
      description: 'Started your mood tracking journey',
      category: 'milestone',
      criteria: { logs: 1 }
    },
    {
      badgeId: 'beginner',
      name: 'Beginner',
      icon: '🌱',
      description: 'Logged your first mood entry',
      category: 'milestone',
      criteria: { logs: 1 }
    },
    {
      badgeId: 'streak-3',
      name: '3-Day Streak',
      icon: '🔥',
      description: 'Logged mood for 3 days in a row',
      category: 'streak',
      criteria: { streak: 3 }
    },
    {
      badgeId: 'streak-7',
      name: 'Week Warrior',
      icon: '⚡',
      description: 'Logged mood for 7 days in a row',
      category: 'streak',
      criteria: { streak: 7 }
    },
    {
      badgeId: 'streak-30',
      name: 'Monthly Master',
      icon: '👑',
      description: 'Logged mood for 30 days in a row',
      category: 'streak',
      criteria: { streak: 30 }
    },
    {
      badgeId: 'consistent-10',
      name: 'Consistent',
      icon: '📅',
      description: 'Logged mood for 10 days',
      category: 'consistency',
      criteria: { totalLogs: 10 }
    },
    {
      badgeId: 'consistent-50',
      name: 'Dedicated',
      icon: '💪',
      description: 'Logged mood for 50 days',
      category: 'consistency',
      criteria: { totalLogs: 50 }
    },
    {
      badgeId: 'consistent-100',
      name: 'Century Club',
      icon: '🎯',
      description: 'Logged mood for 100 days',
      category: 'consistency',
      criteria: { totalLogs: 100 }
    },
    {
      badgeId: 'explorer',
      name: 'Mood Explorer',
      icon: '🗺️',
      description: 'Experienced 5 different mood states',
      category: 'achievement',
      criteria: { uniqueMoods: 5 }
    },
    {
      badgeId: 'reflector',
      name: 'Reflective',
      icon: '📝',
      description: 'Added notes to 10 mood entries',
      category: 'achievement',
      criteria: { loggedNotes: 10 }
    },
    {
      badgeId: 'zen',
      name: 'Zen Master',
      icon: '🧘',
      description: 'Logged mostly calm moods for a week',
      category: 'special',
      criteria: { calmWeek: true }
    }
  ];
};

module.exports = mongoose.model("Badge", badgeSchema);