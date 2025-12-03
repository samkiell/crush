'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Bot, BookOpen, Volume2, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function CbtReview({ sessionId }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  // Admin or Premium gets access
  const isPremium = user?.isPremium || user?.plan === 'premium' || user?.role === 'admin';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewData();
  }, [sessionId]);

  const fetchReviewData = async () => {
    try {
      const res = await fetch(`/api/cbt/${sessionId}/review`);
      if (!res.ok) throw new Error('Failed to load review');
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleGenerateAi = async () => {
    if (!currentQuestion || generatingAi) return;
    setGeneratingAi(true);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: currentQuestion.questionText,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          userAnswer: currentQuestion.userAnswer,
          sessionId,
          qIndex: currentQuestion.index
        })
      });
      
      const data = await res.json();
      if (data.explanation) {
        // Update local state
        const updatedQuestions = [...questions];
        updatedQuestions[currentIndex].aiExplanation = data.explanation;
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  if (questions.length === 0) {
    return <div className="p-8 text-center">No questions found.</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Header */}
      <header className="bg-base-100/80 backdrop-blur-md border-b border-base-content/5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.push(`/cbt/${sessionId}/summary`)} className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            Summary
          </button>
          <div className="font-medium">
            Review {currentIndex + 1} / {questions.length}
          </div>
          <button className="btn btn-ghost btn-circle btn-sm">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Question Text */}
            <div className="bg-base-100 rounded-2xl p-1">
              <h2 className="text-xl md:text-2xl font-medium leading-relaxed text-base-content">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((optKey) => {
                const optText = currentQuestion.options[optKey];
                const isSelected = currentQuestion.userAnswer === optKey;
                const isCorrect = currentQuestion.correctAnswer === optKey;
                
                let borderClass = 'border-base-content/10';
                let bgClass = 'bg-base-100';
                let icon = <span className="font-bold text-sm">{optKey}</span>;

                if (isCorrect) {
                  borderClass = 'border-success bg-success/5';
                  bgClass = 'bg-success/5';
                  icon = <CheckCircle2 className="w-5 h-5 text-success" />;
                } else if (isSelected && !isCorrect) {
                  borderClass = 'border-error bg-error/5';
                  bgClass = 'bg-error/5';
                  icon = <XCircle className="w-5 h-5 text-error" />;
                }

                return (
                  <div key={optKey} className={`
                    w-full text-left p-4 rounded-xl border-2 flex items-center gap-4
                    ${borderClass} ${bgClass}
                  `}>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center shrink-0
                      ${isCorrect ? 'bg-success/10' : (isSelected ? 'bg-error/10' : 'bg-base-200')}
                    `}>
                      {icon}
                    </div>
                    <span className={`text-base md:text-lg ${isCorrect ? 'font-medium text-success' : (isSelected ? 'text-error' : 'text-base-content/80')}`}>
                      {optText}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Explanations */}
            <div className="space-y-4 pt-4">
              {/* Tutor Explanation */}
              {currentQuestion.tutorExplanation && (
                <div className="bg-base-200/50 rounded-xl p-5 border border-base-content/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary mb-2">
                    <BookOpen className="w-4 h-4" />
                    Tutor Explanation
                  </div>
                  <p className="text-base-content/80 leading-relaxed">
                    {currentQuestion.tutorExplanation}
                  </p>
                </div>
              )}

              {/* AI Explanation */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    <Bot className="w-4 h-4" />
                    Crush AI
                  </div>
                  {!currentQuestion.aiExplanation && (
                    isPremium ? (
                      <button 
                        onClick={handleGenerateAi}
                        disabled={generatingAi}
                        className="btn btn-xs btn-primary btn-outline"
                      >
                        {generatingAi ? 'Thinking...' : 'Explain with AI'}
                      </button>
                    ) : (
                      <span className="text-xs text-base-content/40 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Premium Only
                      </span>
                    )
                  )}
                </div>
                
                {currentQuestion.aiExplanation ? (
                  <p className="text-base-content/80 leading-relaxed">
                    {currentQuestion.aiExplanation}
                  </p>
                ) : (
                  <p className="text-base-content/40 text-sm italic">
                    Tap above to get a personalized explanation from Crush AI.
                  </p>
                )}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-content/10 p-4 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="btn btn-circle btn-ghost"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 overflow-x-auto no-scrollbar flex justify-center gap-2 px-2">
            {/* Simple dot indicators or mini numbers could go here, keeping it simple for now */}
            <span className="text-sm font-medium text-base-content/60">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <button 
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="btn btn-circle btn-primary"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
}
