'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Timer,
    Flag,
    RotateCcw,
    BookOpen,
    Bot,
    Sparkles,
    Lock
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const LOADING_MESSAGES = [
    "Preparing your exam paper... 📝",
    "Setting up the exam hall... 🏫",
    "Synchronizing clocks... ⏱️",
    "Loading questions... Good luck! 🍀"
];

const EXAM_DURATION = 40 * 60; // 40 minutes in seconds

export default function ExamWorkspace({ sessionId, subjectName }) {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    // Data State
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

    // Exam State
    const [examStatus, setExamStatus] = useState('active'); // 'active', 'submitted', 'review'
    const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);

    const [explanationTab, setExplanationTab] = useState('default'); // 'default' | 'ai'
    const [aiExplanation, setAiExplanation] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        if (user) {
            setIsPremium(user.isPremium || user.plan === 'premium' || false);
        }
    }, [user]);

    const fetchAiExplanation = async () => {
        setLoadingAi(true);
        try {
            const response = await fetch('/api/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion.text,
                    options: currentQuestion.options,
                    selectedAnswer: answers[currentQuestion.id],
                    correctOption: currentQuestion.correctOption,
                    questionIndex: currentQuestionIndex
                })
            });
            const data = await response.json();
            setAiExplanation(data.explanation);
        } catch (error) {
            console.error('Failed to fetch AI explanation', error);
            setAiExplanation("Sorry, I couldn't generate an explanation at this moment. Please try again.");
        } finally {
            setLoadingAi(false);
        }
    };

    // Fetch Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check cache first (reuse study cache if available, or fetch fresh)
                // For exam, we might want fresh questions or specific exam set. 
                // For now, reusing the same API as study.

                // Parse sessionId: subject-year-topic
                const partsArr = sessionId.split('-');
                const yearIndex = partsArr.findIndex(p => /^\d{4}$/.test(p));

                if (yearIndex === -1) throw new Error('Invalid session ID format');

                const subject = partsArr.slice(0, yearIndex).join(' ');
                const year = partsArr[yearIndex];

                const res = await fetch(`/api/questions?subject=${subject}&year=${year}`);
                if (!res.ok) throw new Error('Failed to load questions');

                const data = await res.json();
                if (!data.questions || data.questions.length === 0) {
                    throw new Error('No questions found for this session.');
                }

                const formattedQuestions = data.questions.map(q => ({
                    id: q.qid,
                    text: q.question,
                    options: Object.entries(q.options).map(([key, value]) => ({
                        id: key,
                        text: value
                    })).filter(o => o.text),
                    correctOption: q.answer,
                    explanation: q.explanation
                }));

                setQuestions(formattedQuestions);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            fetchQuestions();
        }
    }, [sessionId]);

    // Timer Logic
    useEffect(() => {
        if (examStatus !== 'active' || loading) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [examStatus, loading]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionId) => {
        if (examStatus !== 'active') return;

        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionId
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitExam = () => {
        // Calculate Score
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctOption) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setExamStatus('submitted');
        toast.success('Exam Submitted!');
    };

    const handleReviewMistakes = () => {
        setExamStatus('review');
        setCurrentQuestionIndex(0);
    };

    const getOptionStyle = (optionId) => {
        if (examStatus === 'active') {
            return answers[currentQuestion.id] === optionId
                ? "border-primary bg-primary/10 ring-2 ring-primary shadow-md"
                : "border-base-200 hover:border-primary/50 hover:bg-base-200/50";
        }

        // Review Mode
        const isSelected = answers[currentQuestion.id] === optionId;
        const isCorrect = currentQuestion.correctOption === optionId;

        if (isCorrect) {
            return "border-success bg-success/10 text-success-content ring-1 ring-success";
        }
        if (isSelected && !isCorrect) {
            return "border-error bg-error/10 text-error-content ring-1 ring-error";
        }
        return "opacity-50 border-base-200";
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <h3 className="text-lg font-bold animate-pulse">{loadingMessage}</h3>
                <p className="text-sm text-base-content/60 mt-2">Good luck!</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <AlertCircle className="w-12 h-12 text-error mb-4" />
                <h3 className="text-xl font-bold mb-2">Error Loading Exam</h3>
                <p className="text-base-content/60 mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                    Try Again
                </button>
            </div>
        );
    }

    // Result Summary View
    if (examStatus === 'submitted') {
        const percentage = Math.round((score / questions.length) * 100);
        let message = "Keep practicing!";
        let color = "text-error";

        if (percentage >= 70) {
            message = "Excellent work!";
            color = "text-success";
        } else if (percentage >= 50) {
            message = "Good effort!";
            color = "text-warning";
        }

        return (
            <div className="max-w-2xl mx-auto text-center py-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-base-100 border border-base-200 rounded-3xl p-8 shadow-xl"
                >
                    <div className="w-24 h-24 rounded-full bg-base-200 mx-auto mb-6 flex items-center justify-center">
                        <span className={`text-4xl font-bold ${color}`}>{percentage}%</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Exam Completed</h2>
                    <p className={`text-xl font-medium mb-6 ${color}`}>{message}</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-base-200/50 rounded-xl">
                            <div className="text-sm text-base-content/60 mb-1">Total Questions</div>
                            <div className="text-2xl font-bold">{questions.length}</div>
                        </div>
                        <div className="p-4 bg-success/10 rounded-xl">
                            <div className="text-sm text-success mb-1">Correct</div>
                            <div className="text-2xl font-bold text-success">{score}</div>
                        </div>
                        <div className="p-4 bg-error/10 rounded-xl">
                            <div className="text-sm text-error mb-1">Wrong</div>
                            <div className="text-2xl font-bold text-error">{questions.length - score}</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleReviewMistakes}
                            className="btn btn-primary btn-lg rounded-xl"
                        >
                            Review Mistakes
                        </button>
                        <button
                            onClick={() => router.push('/exam')}
                            className="btn btn-outline btn-lg rounded-xl"
                        >
                            Take Another Exam
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Active / Review View
    return (
        <div className="max-w-3xl mx-auto w-full relative">
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-base-100/80 backdrop-blur-md z-10 py-2">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-base-content/60 uppercase tracking-wider">Question</span>
                        <span className="text-xl font-bold">{currentQuestionIndex + 1} <span className="text-base-content/40 text-base">/ {questions.length}</span></span>
                    </div>
                </div>

                {examStatus === 'active' && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${timeLeft < 300 ? 'bg-error/10 text-error' : 'bg-base-200 text-base-content'
                        }`}>
                        <Timer className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                )}

                {examStatus === 'review' && (
                    <div className="badge badge-warning gap-2 p-3">
                        <BookOpen className="w-4 h-4" />
                        Review Mode
                    </div>
                )}
            </div>

            {/* Question Card */}
            <div className="bg-base-100 border border-base-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed">
                    {currentQuestion.text}
                </h2>

                <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                        <motion.button
                            key={option.id}
                            onClick={() => handleOptionSelect(option.id)}
                            disabled={examStatus !== 'active'}
                            whileHover={examStatus === 'active' ? { scale: 1.01 } : {}}
                            whileTap={examStatus === 'active' ? { scale: 0.99 } : {}}
                            className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${getOptionStyle(option.id)}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${answers[currentQuestion.id] === option.id && examStatus === 'active'
                                    ? 'bg-primary text-primary-content'
                                    : 'bg-base-200'
                                    }`}>
                                    {option.id}
                                </span>
                                <span className="font-medium">{option.text}</span>
                            </div>

                            {/* Active Mode Selection Indicator */}
                            {examStatus === 'active' && answers[currentQuestion.id] === option.id && (
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                    <CheckCircle className="w-4 h-4 text-primary-content" />
                                </div>
                            )}

                            {/* Review Mode Indicators */}
                            {examStatus === 'review' && option.id === currentQuestion.correctOption && (
                                <CheckCircle className="w-5 h-5 text-success" />
                            )}
                            {examStatus === 'review' && answers[currentQuestion.id] === option.id && option.id !== currentQuestion.correctOption && (
                                <XCircle className="w-5 h-5 text-error" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Explanation (Only in Review Mode) */}
            {/* Explanation Section (Only in Review Mode) */}
            <AnimatePresence>
                {examStatus === 'review' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm mb-6"
                    >
                        {/* Tabs */}
                        <div className="flex border-b border-base-200">
                            <button
                                onClick={() => setExplanationTab('default')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${explanationTab === 'default'
                                    ? 'bg-base-100 text-primary border-b-2 border-primary'
                                    : 'bg-base-200/50 text-base-content/60 hover:bg-base-200'
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                Explanation
                            </button>
                            <button
                                onClick={() => {
                                    setExplanationTab('ai');
                                    if (!aiExplanation && !loadingAi) fetchAiExplanation();
                                }}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${explanationTab === 'ai'
                                    ? 'bg-base-100 text-secondary border-b-2 border-secondary'
                                    : 'bg-base-200/50 text-base-content/60 hover:bg-base-200'
                                    }`}
                            >
                                <Bot className="w-4 h-4" />
                                Crush AI
                                {!isPremium && <Lock className="w-3 h-3 opacity-50" />}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-base-100 min-h-[150px]">
                            {explanationTab === 'default' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose prose-sm max-w-none"
                                >
                                    <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-success" />
                                        Correct Answer: Option {currentQuestion.correctOption}
                                    </h4>
                                    <p className="text-base-content/80 leading-relaxed">
                                        {currentQuestion.explanation || "No explanation provided."}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative"
                                >
                                    {!isPremium ? (
                                        <div className="text-center py-4">
                                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Lock className="w-6 h-6 text-secondary" />
                                            </div>
                                            <h4 className="font-bold mb-1">Premium Feature</h4>
                                            <p className="text-sm text-base-content/60 mb-4">
                                                Unlock AI-powered explanations tailored to your learning style.
                                            </p>
                                            <button className="btn btn-sm btn-secondary">Upgrade to Premium</button>
                                        </div>
                                    ) : (
                                        <>
                                            {loadingAi ? (
                                                <div className="flex flex-col items-center justify-center py-8 gap-3">
                                                    <span className="loading loading-dots loading-md text-secondary"></span>
                                                    <span className="text-xs text-base-content/50 animate-pulse">Consulting Crush AI...</span>
                                                </div>
                                            ) : (
                                                <div className="prose prose-sm max-w-none">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
                                                            <Bot className="w-4 h-4 text-secondary" />
                                                        </div>
                                                        <div className="bg-base-200/50 rounded-2xl rounded-tl-none p-4 text-base-content/80">
                                                            {aiExplanation}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
                <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="btn btn-outline rounded-xl gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                    examStatus === 'active' ? (
                        <button
                            onClick={handleSubmitExam}
                            className="btn btn-primary rounded-xl gap-2 px-8"
                        >
                            Submit Exam
                            <Flag className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push('/exam')}
                            className="btn btn-primary rounded-xl gap-2"
                        >
                            Finish Review
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    )
                ) : (
                    <button
                        onClick={handleNextQuestion}
                        className="btn btn-outline rounded-xl gap-2"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
