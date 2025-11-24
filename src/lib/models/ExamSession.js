import mongoose from 'mongoose';

const ExamSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  examType: {
    type: String,
    required: true,
    enum: ['JAMB', 'WAEC', 'NECO', 'PUTME'],
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    selectedOption: Number,
    isCorrect: Boolean,
  }],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ExamSession || mongoose.model('ExamSession', ExamSessionSchema);
