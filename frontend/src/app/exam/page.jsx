'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startExam, submitAnswer, submitExamStart, submitExamSuccess, submitExamFailure } from '../../store/slices/examsSlice';
import { examsAPI } from '../../services/api';
import QuestionCard from '../../components/QuestionCard';
import ExamTimer from '../../components/ExamTimer';
import { Sun, Moon, Eye } from 'lucide-react';
import { useTheme } from '../../utils/theme';

export default function ExamPage() {
  const dispatch = useDispatch();
  const { currentExam, answers, isExamActive, loading } = useSelector((state) => state.exams);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("eye-care");
    else setTheme("light");
  };

  useEffect(() => {
    // Start exam when component mounts (in real app, this would be triggered by user action)
    if (!currentExam) {
      startMockExam();
    }
  }, []);

  const startMockExam = async () => {
    try {
      // In a real app, you'd fetch exam configuration from API
      const mockExam = {
        id: 'mock-exam-1',
        title: 'JAMB Mock Exam',
        duration: 120, // 2 hours in minutes
        questions: [
          {
            id: 'q1',
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctAnswer: 'Paris',
            subject: 'General Knowledge',
            topic: 'Geography',
            difficulty: 'easy',
            explanation: 'Paris is the capital and most populous city of France.'
          },
          {
            id: 'q2',
            question: 'Solve for x: 2x + 3 = 7',
            options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
            correctAnswer: 'x = 2',
            subject: 'Mathematics',
            topic: 'Algebra',
            difficulty: 'easy',
            explanation: 'Subtracting 3 from both sides: 2x = 4. Dividing by 2: x = 2.'
          },
          // Add more questions as needed
        ]
      };

      dispatch(startExam(mockExam));
    } catch (error) {
      console.error('Failed to start exam:', error);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    dispatch(submitAnswer({ questionId, answer }));
  };

  const handleSubmitExam = async () => {
    if (!currentExam) return;

    try {
      dispatch(submitExamStart());
      const result = await examsAPI.submitExam(currentExam.id, answers);
      dispatch(submitExamSuccess(result.data));
      alert('Exam submitted successfully!');
    } catch (error) {
      dispatch(submitExamFailure(error.message));
      alert('Failed to submit exam. Please try again.');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentExam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!currentExam) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-base-content/70">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentExam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{currentExam.title}</h1>
          
          <div className="flex items-center gap-4">
            <ExamTimer duration={currentExam.duration} onTimeUp={handleSubmitExam} />
            
            <button
              onClick={cycleTheme}
              className="btn btn-circle btn-sm bg-base-100 border border-base-300"
            >
              {theme === "light" && <Sun size={18} />}
              {theme === "dark" && <Moon size={18} />}
              {theme === "eye-care" && <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Question Counter */}
          <div className="mb-6 flex justify-between items-center">
            <span className="text-base-content/70">
              Question {currentQuestionIndex + 1} of {currentExam.questions.length}
            </span>
            <div className="flex gap-2">
              {currentExam.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold ${
                    idx === currentQuestionIndex
                      ? 'bg-primary text-primary-content'
                      : answers[currentExam.questions[idx].id]
                      ? 'bg-success/20 text-success'
                      : 'bg-base-200 text-base-content'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <QuestionCard
            question={currentQuestion}
            showAnswer={false}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={answers[currentQuestion.id]}
          />

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn btn-outline rounded-xl"
            >
              Previous
            </button>

            <div className="flex gap-4">
              {currentQuestionIndex === currentExam.questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  className="btn btn-success rounded-xl px-8"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="btn btn-primary rounded-xl"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
