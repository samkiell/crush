"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuestionCard from "../../components/QuestionCard";
import SkeletonLoader from "../../components/SkeletonLoader";
import { motion } from "framer-motion";

// Sample data - TODO: Replace with API call
const sampleQuestions = [
  {
    id: 1,
    subject: "Mathematics",
    topic: "Algebra",
    difficulty: "medium",
    question: "Solve for x: 2x + 3 = 7",
    options: ["x = 1", "x = 2", "x = 3", "x = 4"],
    correctAnswer: "x = 2",
    explanation: "Subtract 3 from both sides: 2x = 4. Then divide by 2: x = 2.",
  },
  {
    id: 2,
    subject: "English",
    topic: "Grammar",
    difficulty: "easy",
    question: "Choose the correct sentence:",
    options: [
      "She don't like apples.",
      "She doesn't likes apples.",
      "She doesn't like apples.",
      "She don't likes apples.",
    ],
    correctAnswer: "She doesn't like apples.",
    explanation:
      'The correct form is "doesn\'t" (third person singular) with "like" (base form).',
  },
  {
    id: 3,
    subject: "Physics",
    topic: "Mechanics",
    difficulty: "hard",
    question:
      "A car accelerates from rest at 2 m/s² for 5 seconds. What is its final velocity?",
    options: ["5 m/s", "7 m/s", "10 m/s", "15 m/s"],
    correctAnswer: "10 m/s",
    explanation: "Using v = u + at: v = 0 + (2)(5) = 10 m/s.",
  },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setTimeout(() => {
        setQuestions(sampleQuestions);
        setLoading(false);
      }, 1500);
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };
    setShowAnswers(true);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Header />

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Question Bank</h1>

  const handleShowAnswers = () => {
    setShowAnswers(true);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Header />

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Question Bank</h1>
          <p className="text-base-content/70 mb-6">
            Practice with our comprehensive collection of JAMB questions.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <select className="select select-bordered rounded-xl">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>English</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
            </select>

            <select className="select select-bordered rounded-xl">
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <button
              onClick={handleShowAnswers}
              className="btn btn-primary rounded-xl"
              disabled={Object.keys(selectedAnswers).length === 0}
            >
              Check Answers
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonLoader key={i} type="question" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <QuestionCard
                  question={question}
                  showAnswer={showAnswers}
                  onAnswerSelect={handleAnswerSelect}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && questions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/70">No questions found matching your criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
