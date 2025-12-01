import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Please provide subject'],
    lowercase: true,
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please provide year'],
  },
  qid: {
    type: String,
    required: [true, 'Please provide question ID'],
    unique: true,
    trim: true,
  },
  question: {
    type: String,
    required: [true, 'Please provide question text'],
  },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
    E: { type: String, default: '' },
  },
  answer: {
    type: String,
    required: [true, 'Please provide answer'],
    enum: ['A', 'B', 'C', 'D', 'E', 'NO CORRECT OPTION'],
    uppercase: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate compilation
export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
