'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Sparkles,
    Lock,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
    BookOpen,
    Bot
} from 'lucide-react';
import { useSelector } from 'react-redux';

const FREE_LIMIT = 3;

export default function QuestionWorkspace({ sessionId, subjectName }) {
    const { user } = useSelector((state) => state.auth);

    // Data State
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Interaction State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationTab, setExplanationTab] = useState('default'); // 'default' | 'ai'
    const [aiExplanation, setAiExplanation] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [showPremiumLock, setShowPremiumLock] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    // Fetch Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check cache first
                const cacheKey = `questions_${sessionId}`;
                const cached = localStorage.getItem(cacheKey);
                const cachedTime = localStorage.getItem(`${cacheKey}_time`);
                const ONE_HOUR = 60 * 60 * 1000;

                if (cached && cachedTime && (Date.now() - parseInt(cachedTime) < ONE_HOUR)) {
                    setQuestions(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                // Parse sessionId: subject-year-topic
                // Example: mathematics-1978-all-topics
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

                // Save to cache
                localStorage.setItem(cacheKey, JSON.stringify(formattedQuestions));
                localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

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

    useEffect(() => {
        if (user) {
            setIsPremium(user.isPremium || user.plan === 'premium' || false);
        }
    }, [user]);

    // Check for premium lock when question changes
    useEffect(() => {
        if (!isPremium && currentQuestionIndex >= FREE_LIMIT) {
            setShowPremiumLock(true);
        }
    }, [currentQuestionIndex, isPremium]);

    const handleOptionSelect = (optionId) => {
        if (isAnswered) return;
        setSelectedOption(optionId);
        setIsAnswered(true);
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetState();
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            resetState();
        }
    };

    const resetState = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setShowExplanation(false);
        setExplanationTab('default');
        setAiExplanation(null);
    };

    const fetchAiExplanation = async () => {
        setLoadingAi(true);
        try {
            const response = await fetch('/api/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion.text,
                    options: currentQuestion.options,
                    selectedAnswer: selectedOption,
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/60">Loading questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <AlertCircle className="w-12 h-12 text-error mb-4" />
                <h3 className="text-xl font-bold mb-2">Error Loading Session</h3>
                <p className="text-base-content/60 mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                    Try Again
                </button>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="max-w-3xl mx-auto w-full relative">
            {/* Premium Lock Overlay */}
            <AnimatePresence>
                {showPremiumLock && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-base-100/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 rounded-3xl"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-orange-500/30">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Unlock Full Access</h2>
                        <p className="text-base-content/70 max-w-md mb-8">
                            You've reached the limit of free questions for this session. Upgrade to Premium to continue studying without limits and get AI-powered insights.
                        </p>
                        <button className="btn btn-primary btn-lg rounded-xl shadow-lg shadow-primary/30">
                            Upgrade Now
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-ghost mt-4"
                        >
                            Go Back
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm font-medium text-base-content/60">
                    <span className="bg-base-200 px-2 py-1 rounded-lg">Question {currentQuestionIndex + 1} / {questions.length}</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg capitalize">{subjectName || sessionId.split('-')[0]}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="btn btn-sm btn-ghost gap-2 px-2 sm:px-3"
                    >
                        <ChevronLeft className="w-6 h-6 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="btn btn-sm btn-ghost gap-2 px-2 sm:px-3"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-6 h-6 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-base-100 border border-base-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed">
                    {currentQuestion.text}
                </h2>

                <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOption === option.id;
                        const isCorrect = option.id === currentQuestion.correctOption;

                        let cardStyle = "border-base-200 hover:border-primary/50 hover:bg-base-200/50";
                        let icon = null;

                        if (isAnswered) {
                            if (isSelected && isCorrect) {
                                cardStyle = "border-success bg-success/10 text-success-content";
                                icon = <CheckCircle className="w-5 h-5 text-success" />;
                            } else if (isSelected && !isCorrect) {
                                cardStyle = "border-error bg-error/10 text-error-content";
                                icon = <XCircle className="w-5 h-5 text-error" />;
                            } else if (!isSelected && isCorrect) {
                                cardStyle = "border-success border-dashed bg-success/5";
                                icon = <CheckCircle className="w-5 h-5 text-success opacity-50" />;
                            } else {
                                cardStyle = "opacity-50 border-base-200";
                            }
                        } else if (isSelected) {
                            cardStyle = "border-primary bg-primary/5";
                        }

                        return (
                            <motion.button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                disabled={isAnswered}
                                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                                className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${cardStyle}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isSelected || (isAnswered && isCorrect) ? 'bg-base-100 shadow-sm' : 'bg-base-200'
                                        }`}>
                                        {option.id}
                                    </span>
                                    <span className="font-medium">{option.text}</span>
                                </div>
                                {icon}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Explanation Section */}
            <AnimatePresence>
                {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm"
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
                                <Sparkles className="w-4 h-4" />
                                AI Tutor
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
                                                    <span className="text-xs text-base-content/50 animate-pulse">Consulting AI Tutor...</span>
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
        </div>
    );
}
