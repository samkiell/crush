import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide question text'],
  },
  options: {
    type: [String],
    required: [true, 'Please provide options'],
    validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
  },
  correctOption: {
    type: Number, // Index of the correct option (0-3)
    required: [true, 'Please provide correct option index'],
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject'],
    enum: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Literature'],
  },
  examType: {
    type: String,
    required: [true, 'Please provide exam type'],
    enum: ['JAMB', 'WAEC', 'NECO', 'PUTME'],
  },
  year: {
    type: Number,
    required: [true, 'Please provide year'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 5; // Allow up to 5 options just in case
}

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
