"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuestionCard from "../../components/QuestionCard";
import SkeletonLoader from "../../components/SkeletonLoader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
  {
    id: 4,
    subject: "Chemistry",
    topic: "Periodic Table",
    difficulty: "easy",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: "Au",
    explanation: "Au comes from the Latin word 'aurum' meaning gold.",
  },
  {
    id: 5,
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "medium",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
    correctAnswer: "Mitochondria",
    explanation: "Mitochondria produce ATP, the energy currency of the cell.",
  },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  // Filter states
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setTimeout(() => {
        setQuestions(sampleQuestions);
        setFilteredQuestions(sampleQuestions);
        setLoading(false);
      }, 1500);
    };

    fetchQuestions();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...questions];

    if (selectedSubject !== "all") {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedSubject, selectedDifficulty, questions]);

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleShowAnswers = () => {
    if (Object.keys(selectedAnswers).length === 0) {
      toast.error('Please answer at least one question before checking answers');
      return;
    }
    setShowAnswers(true);
    toast.success('Answers revealed! Check your responses.');
  };

  const handleResetFilters = () => {
    setSelectedSubject("all");
    setSelectedDifficulty("all");
    setSelectedAnswers({});
    setShowAnswers(false);
    toast.success('Filters reset');
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique subjects for filter dropdown
  const subjects = ["all", ...new Set(questions.map(q => q.subject))];

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

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              className="select select-bordered rounded-xl"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjects.filter(s => s !== "all").map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              className="select select-bordered rounded-xl"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button
              onClick={handleShowAnswers}
              className="btn btn-primary rounded-xl"
              disabled={Object.keys(selectedAnswers).length === 0}
            >
              Check Answers
            </button>

            <button
              onClick={handleResetFilters}
              className="btn btn-ghost rounded-xl"
            >
              Reset Filters
            </button>
          </div>

          {/* Results count */}
          <div className="text-sm text-base-content/70 mb-4">
            Showing {currentQuestions.length} of {filteredQuestions.length} questions
            {(selectedSubject !== "all" || selectedDifficulty !== "all") && " (filtered)"}
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonLoader key={i} type="question" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {currentQuestions.map((question, index) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline rounded-xl"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`btn rounded-xl ${currentPage === index + 1
                          ? 'btn-primary'
                          : 'btn-outline'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline rounded-xl"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {!loading && filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/70">No questions found matching your criteria.</p>
            <button
              onClick={handleResetFilters}
              className="btn btn-primary rounded-xl mt-4"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
