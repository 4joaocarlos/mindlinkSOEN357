// Mongoose schema for journal entries tied to mood tracking.
const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: String,
      required: true,
      index: true
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
  },
  { timestamps: true }
);

journalEntrySchema.index({ user: 1, date: -1 });
journalEntrySchema.index({ user: 1, createdAt: -1 });

journalEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
