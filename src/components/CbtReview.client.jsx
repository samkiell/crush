'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle, 
    XCircle, 
    BookOpen, 
    Sparkles, 
    Bot, 
    Lock, 
    Grid, 
    X,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionNavigator from '@/components/QuestionNavigator.client';
import { useSwipe } from '@/lib/swipeHandler';
import { useSelector } from 'react-redux';

export default function CbtReview({ sessionId }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showNav, setShowNav] = useState(false);
    const [explanationTab, setExplanationTab] = useState('default');
    const [aiExplanation, setAiExplanation] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    
    const { user } = useSelector((state) => state.auth);
    const isPremium = user?.isPremium || user?.plan === 'premium';

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await fetch(`/api/cbt/${sessionId}/review`);
                if (res.ok) {
                    const data = await res.json();
                    setQuestions(data.questions);
                }
            } catch (error) {
                console.error("Failed to load review", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [sessionId]);

    const currentQuestion = questions[currentIndex];

    const swipeHandlers = useSwipe({
        onLeft: () => {
             if (currentIndex < questions.length - 1) setCurrentIndex(c => c + 1);
        },
        onRight: () => {
             if (currentIndex > 0) setCurrentIndex(c => c - 1);
        }
    });

    const fetchAiExplanation = async () => {
        if (currentQuestion.aiExplanation) {
            setAiExplanation(currentQuestion.aiExplanation);
            return;
        }

        setLoadingAi(true);
        try {
            const response = await fetch('/api/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion.questionText,
                    options: currentQuestion.options,
                    selectedAnswer: currentQuestion.userAnswer,
                    correctAnswer: currentQuestion.correctAnswer
                })
            });
            const data = await response.json();
            setAiExplanation(data.explanation);
            // Optionally update local question state to cache it
            const newQuestions = [...questions];
            newQuestions[currentIndex].aiExplanation = data.explanation;
            setQuestions(newQuestions);
        } catch (error) {
            console.error('Failed to fetch AI explanation', error);
            setAiExplanation("Sorry, I couldn't generate an explanation.");
        } finally {
            setLoadingAi(false);
        }
    };

    // Reset AI explanation when question changes
    useEffect(() => {
        setAiExplanation(null);
        setExplanationTab('default');
    }, [currentIndex]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!questions.length) return <div>No questions found.</div>;

    return (
        <div className="min-h-screen bg-base-200 pb-20 md:pb-8">
            {/* Header */}
            <header className="bg-base-100 shadow-sm px-4 py-3 sticky top-0 z-30">
                <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <Link href={`/cbt/${sessionId}/summary`} className="btn btn-ghost btn-sm btn-circle">
                            <ArrowLeft />
                        </Link>
                        <div>
                            <h1 className="font-bold text-base">Review Mode</h1>
                            <p className="text-xs text-base-content/60">Question {currentIndex + 1} / {questions.length}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowNav(true)} className="btn btn-ghost btn-sm btn-circle">
                        <Grid size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto w-full p-4 md:p-6" {...swipeHandlers}>
                {/* Question Card */}
                <div className="bg-base-100 border border-base-200 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed">
                        {currentQuestion.questionText}
                    </h2>

                    <div className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([key, text]) => {
                            const isSelected = currentQuestion.userAnswer === key;
                            const isCorrect = currentQuestion.correctAnswer === key;
                            
                            let cardStyle = "opacity-60 border-base-200";
                            let icon = null;

                            if (isCorrect) {
                                cardStyle = "border-success bg-success/10 text-success-content opacity-100";
                                icon = <CheckCircle className="w-5 h-5 text-success" />;
                            } else if (isSelected && !isCorrect) {
                                cardStyle = "border-error bg-error/10 text-error-content opacity-100";
                                icon = <XCircle className="w-5 h-5 text-error" />;
                            }

                            return (
                                <div
                                    key={key}
                                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between ${cardStyle}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-base-100/50`}>
                                            {key}
                                        </span>
                                        <span className="font-medium">{text}</span>
                                    </div>
                                    {icon}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Explanation */}
                <div className="bg-base-100 border border-base-200 rounded-3xl overflow-hidden shadow-sm mb-20">
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

                    <div className="p-6 bg-base-100 min-h-[150px]">
                        {explanationTab === 'default' ? (
                            <div className="prose prose-sm max-w-none">
                                <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-success" />
                                    Correct Answer: Option {currentQuestion.correctAnswer}
                                </h4>
                                <p className="text-base-content/80 leading-relaxed">
                                    {currentQuestion.tutorExplanation}
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                {!isPremium ? (
                                    <div className="text-center py-4">
                                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Lock className="w-6 h-6 text-secondary" />
                                        </div>
                                        <h4 className="font-bold mb-1">Premium Feature</h4>
                                        <p className="text-sm text-base-content/60 mb-4">
                                            Unlock AI-powered explanations.
                                        </button>
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
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 p-3 flex justify-between items-center z-30 safe-area-bottom">
                <button onClick={() => setCurrentIndex(c => Math.max(0, c - 1))} className="btn btn-circle btn-ghost" disabled={currentIndex === 0}>
                    <ChevronLeft size={24} />
                </button>
                <span className="text-sm font-bold opacity-50">REVIEW MODE</span>
                <button onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))} className="btn btn-circle btn-primary text-white" disabled={currentIndex === questions.length - 1}>
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Navigator Drawer */}
            {showNav && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowNav(false)}>
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-72 bg-base-100/95 backdrop-blur-md border-l border-base-content/10 p-4 shadow-2xl overflow-y-auto" 
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
                        
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, i) => {
                                const isCorrect = q.userAnswer === q.correctAnswer;
                                const isSkipped = !q.userAnswer;
                                let colorClass = isSkipped ? 'bg-base-200 text-base-content/50' : (isCorrect ? 'bg-success text-white' : 'bg-error text-white');
                                if (i === currentIndex) colorClass += ' ring-2 ring-primary ring-offset-2';

                                return (
                                    <button
                                        key={q.qid}
                                        onClick={() => { setCurrentIndex(i); setShowNav(false); }}
                                        className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${colorClass}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
