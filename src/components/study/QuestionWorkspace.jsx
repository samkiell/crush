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
    Bot,
    Calculator,
    Grid,
    Flag,
    X
} from 'lucide-react';
import { useSelector } from 'react-redux';
import CrushCal from '@/components/CrushCal.client';
import QuestionNavigator from '@/components/QuestionNavigator.client';
import FlagReportModal from '@/components/FlagReportModal.client';
import { useSwipe } from '@/lib/swipeHandler';
import ReactMarkdown from 'react-markdown';

const FREE_LIMIT = 3;

const LOADING_MESSAGES = [
    "Loading questions... Don't panic! 😱",
    "Summoning the exam spirits... 👻",
    "Sharpening the virtual pencils... ✏️",
    "Brewing some knowledge... ☕",
    "Convincing the server to cooperate... 🤖",
    "Dusting off the archives... 📚",
    "Preparing your path to success... 🚀"
];

export default function QuestionWorkspace({ sessionId, subjectName }) {
    const { user } = useSelector((state) => state.auth);

    // Data State
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

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

    // Modals State
    const [showCal, setShowCal] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [showFlag, setShowFlag] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, []);

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
            setIsPremium(user.isPremium || user.plan === 'premium' || user.role === 'admin' || false);
        }
    }, [user]);

    // Save progress to localStorage for Dashboard Resume Card
    useEffect(() => {
        if (questions.length > 0 && sessionId) {
            const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
            const sessionData = {
                title: `${subjectName || sessionId.split('-')[0]} ${sessionId.split('-')[1] || ''}`,
                type: 'Study Session',
                progress,
                href: `/study/${sessionId}`,
                timestamp: Date.now()
            };
            localStorage.setItem('last_active_session', JSON.stringify(sessionData));
        }
    }, [currentQuestionIndex, questions, sessionId, subjectName]);

    // Check for premium lock when question changes
    useEffect(() => {
        if (!isPremium && currentQuestionIndex >= FREE_LIMIT) {
            setShowPremiumLock(true);
        }
    }, [currentQuestionIndex, isPremium]);

    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [showSummary, setShowSummary] = useState(false);

    const handleOptionSelect = (optionId) => {
        if (isAnswered) return;
        setSelectedOption(optionId);
        setIsAnswered(true);
        setShowExplanation(true);
        
        // Track answer
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

    const resetState = () => {
        const nextQ = questions[currentQuestionIndex]; // Note: currentQuestionIndex is already updated by set state, but here we might be in a closure.
        // Actually, resetState is called AFTER setCurrentQuestionIndex, but due to closure, currentQuestionIndex might be old if not careful.
        // Better to use useEffect on currentQuestionIndex to reset/restore state.
    };

    // Restore state when question changes
    useEffect(() => {
        const q = questions[currentQuestionIndex];
        if (!q) return;

        const savedAnswer = answers[q.id];
        if (savedAnswer) {
            setSelectedOption(savedAnswer);
            setIsAnswered(true);
            setShowExplanation(true);
        } else {
            setSelectedOption(null);
            setIsAnswered(false);
            setShowExplanation(false);
            setExplanationTab('default');
            setAiExplanation(null);
        }
    }, [currentQuestionIndex, questions, answers]);

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

    // Swipe Handlers
    const swipeHandlers = useSwipe({
        onLeft: () => {
             if (currentQuestionIndex < questions.length - 1) handleNextQuestion();
        },
        onRight: () => {
             if (currentQuestionIndex > 0) handlePrevQuestion();
        }
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <h3 className="text-lg font-bold animate-pulse">{loadingMessage}</h3>
                <p className="text-sm text-base-content/60 mt-2">Getting everything ready for you...</p>
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
        <div className="max-w-5xl mx-auto w-full relative pb-20 md:grid md:grid-cols-[1fr_300px] gap-6" {...swipeHandlers}>
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

            {/* Left Column: Header + Question Card + Explanation */}
            <div className="flex flex-col">
                {/* Header / Progress */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-base-content/60">
                        <span className="bg-base-200 px-2 py-1 rounded-lg">Question {currentQuestionIndex + 1} / {questions.length}</span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg capitalize">{subjectName || sessionId.split('-')[0]}</span>
                    </div>
                    
                    {/* Mobile Top Controls */}
                    <div className="flex gap-1 md:hidden">
                        <button onClick={() => setShowCal(!showCal)} className="btn btn-ghost btn-sm btn-circle">
                        <Calculator size={20} />
                        </button>
                        <button onClick={() => setShowNav(!showNav)} className="btn btn-ghost btn-sm btn-circle">
                        <Grid size={20} />
                        </button>
                    </div>

                    <div className="hidden md:flex gap-2">
                        <button onClick={() => setShowCal(true)} className="btn btn-sm btn-neutral flex items-center gap-2">
                            <Calculator size={16} /> Calculator
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
                    
                    {/* Mobile Bottom Buttons (Inside Card) */}
                    <div className="md:hidden flex justify-between items-center mt-8 pt-6 border-t border-base-200">
                        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="btn btn-circle btn-ghost text-base-content">
                            <ChevronLeft size={28} />
                        </button>
                        <button onClick={() => setShowFlag(true)} className="btn btn-ghost btn-sm gap-2 text-error">
                            <Flag size={20} />
                        </button>
                        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="btn btn-circle btn-primary text-white shadow-lg shadow-primary/30">
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {/* Desktop Prev/Next Buttons inside card */}
                    <div className="hidden md:flex justify-between items-center mt-8 pt-6 border-t border-base-200">
                        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="btn btn-ghost gap-2 flex items-center">
                            <ChevronLeft size={20} /> Prev
                        </button>
                        <button onClick={() => setShowFlag(true)} className="btn btn-ghost text-error gap-2 text-xs font-bold uppercase tracking-wider flex items-center">
                            <Flag size={16} /> Report
                        </button>
                        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="btn btn-primary text-white gap-2 flex items-center">
                            Next <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex flex-col gap-4 pt-[52px]"> {/* pt to align with content below header */}
                <div className="bg-base-100 rounded-2xl shadow-sm p-4 flex-1 flex flex-col max-h-[calc(100vh-100px)] sticky top-24">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Grid size={18} /> Navigator
                    </h3>
                    <div className="flex-1 overflow-y-auto">
                        <QuestionNavigator
                            total={questions.length}
                            current={currentQuestionIndex}
                            answers={Object.keys(answers).reduce((acc, k) => {
                                const idx = questions.findIndex(q => q.id === k);
                                if (idx >= 0) acc[idx] = true;
                                return acc;
                            }, {})}
                            onJump={(i) => { setCurrentQuestionIndex(i); resetState(); }}
                        />
                    </div>
                    <div className="pt-4 mt-4 border-t border-base-200">
                        <button 
                            onClick={() => setShowSummary(true)} 
                            className="btn btn-primary w-full text-white shadow-lg shadow-primary/20"
                        >
                            Finish Session
                        </button>
                    </div>
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
                                                            <ReactMarkdown>{aiExplanation}</ReactMarkdown>
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

            {/* Modals */}
            {showCal && (
                <CrushCal 
                    onClose={() => setShowCal(false)} 
                />
            )}
            {showFlag && (
                <FlagReportModal 
                    sessionId={sessionId} 
                    questionId={currentQuestion?.id} 
                    isOpen={showFlag} 
                    onClose={() => setShowFlag(false)} 
                />
            )}
            {showNav && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowNav(false)}>
                    <div 
                        className="absolute right-0 top-16 bottom-0 w-72 bg-base-100/95 backdrop-blur-md border-l border-base-content/10 p-4 shadow-2xl overflow-y-auto" 
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Grid size={20} /> Navigator
                            </h3>
                            <button onClick={() => setShowNav(false)} className="btn btn-sm btn-circle btn-ghost">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <QuestionNavigator
                            total={questions.length}
                            current={currentQuestionIndex}
                            answers={Object.keys(answers).reduce((acc, k) => {
                                const idx = questions.findIndex(q => q.id === k);
                                if (idx >= 0) acc[idx] = true;
                                return acc;
                            }, {})}
                            onJump={(i) => { setCurrentQuestionIndex(i); setShowNav(false); resetState(); }}
                        />
                        
                        <div className="pt-4 mt-4 border-t border-base-content/10">
                            <button 
                                onClick={() => { setShowNav(false); setShowSummary(true); }} 
                                className="btn btn-primary w-full text-white shadow-lg shadow-primary/20"
                            >
                                Finish Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Modal */}
            {showSummary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-base-100 rounded-3xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all scale-100">
                        <h3 className="text-2xl font-bold mb-2">Session Summary</h3>
                        <p className="text-base-content/60 mb-6">Great job studying! Here is your progress.</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-success/10 p-4 rounded-2xl">
                                <div className="text-2xl font-bold text-success">
                                    {Object.keys(answers).filter(qid => {
                                        const q = questions.find(q => q.id === qid);
                                        return q && answers[qid] === q.correctOption;
                                    }).length}
                                </div>
                                <div className="text-xs text-base-content/60 font-medium">Correct</div>
                            </div>
                            <div className="bg-error/10 p-4 rounded-2xl">
                                <div className="text-2xl font-bold text-error">
                                    {Object.keys(answers).filter(qid => {
                                        const q = questions.find(q => q.id === qid);
                                        return q && answers[qid] !== q.correctOption;
                                    }).length}
                                </div>
                                <div className="text-xs text-base-content/60 font-medium">Wrong</div>
                            </div>
                            <div className="bg-base-200 p-4 rounded-2xl">
                                <div className="text-2xl font-bold text-base-content/70">
                                    {questions.length - Object.keys(answers).length}
                                </div>
                                <div className="text-xs text-base-content/60 font-medium">Remaining</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => setShowSummary(false)} 
                                className="btn btn-primary w-full"
                            >
                                Continue Studying
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('last_active_session');
                                    window.location.href = '/dashboard';
                                }} 
                                className="btn btn-ghost w-full"
                            >
                                Exit Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
