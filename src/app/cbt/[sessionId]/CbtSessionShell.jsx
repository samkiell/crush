'use client';
import { useState, useEffect } from 'react';
import { useCbtSession } from '@/lib/useCbtSession';
import QuestionView from './QuestionView.client';
import QuestionNavigator from '@/components/QuestionNavigator.client';
import CrushCal from '@/components/CrushCal.client';
import OfflineSyncStatus from '@/components/OfflineSyncStatus.client';
import FlagReportModal from '@/components/FlagReportModal.client';
import { Calculator, Grid, Flag, Clock, ChevronLeft, ChevronRight, Menu, X, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CBTIntegrityGuard from '@/components/cbt/CBTIntegrityGuard';

export default function CbtSessionShell({ sessionId, subject, year }) {
  const {
    questions,
    currentIndex,
    answers,
    timeLeft,
    totalDuration,
    status,
    isOnline,
    markAnswer,
    next,
    prev,
    jumpTo,
    submit
  } = useCbtSession({ sessionId, endTime: null, initialQuestions: null }); // Pass actual props if available

  const [showCal, setShowCal] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Format time
  const formatTime = (ms) => {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 1000 / 60) % 60);
    const h = Math.floor((ms / 1000 / 60 / 60));
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await submit();
    } catch (error) {
      console.error("Submission failed", error);
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  
  // Calculate percentage for low time warning (20%)
  const percentageLeft = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 100;
  const isLowTime = percentageLeft < 20;

  return (
    <CBTIntegrityGuard sessionId={sessionId}>
      <div className="min-h-screen bg-base-200 flex flex-col">
        {/* Header */}
        <header className="bg-base-100 shadow-sm px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
               <Link href="/cbt" className="btn btn-ghost btn-sm btn-circle">
                 <ChevronLeft />
               </Link>
               <div>
                 <h1 className="font-bold text-base leading-tight">
                   CBT Session
                 </h1>
                 <p className="text-xs text-base-content/60 font-mono">
                   JAMB {year}
                 </p>
               </div>
             </div>
             
             <div className="flex items-center gap-2">
               <div className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-1.5 rounded-lg mr-1 transition-colors ${isLowTime ? 'bg-error/10 text-error animate-pulse' : 'bg-base-200 text-primary'}`}>
                 <Clock size={16} className={isLowTime ? 'text-error' : 'text-primary'} />
                 <span>{formatTime(timeLeft)}</span>
               </div>

               {/* Mobile Top Controls */}
               <button onClick={() => setShowCal(!showCal)} className="btn btn-ghost btn-sm btn-circle md:hidden">
                 <Calculator size={20} />
               </button>
               <button onClick={() => setShowNav(!showNav)} className="btn btn-ghost btn-sm btn-circle md:hidden">
                 <Grid size={20} />
               </button>

               {/* Desktop Top Controls */}
               <div className="hidden md:flex gap-2 ml-2">
                  <button onClick={() => setShowCal(true)} className="btn btn-sm btn-neutral flex items-center gap-2">
                      <Calculator size={16} /> Calculator
                  </button>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium px-1 pt-2">
            <span className="text-base-content/80">
              Question {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-base-content/40">•</span>
            <span className="capitalize text-base-content/80 truncate">
              {subject?.replace(/-/g, ' ')}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 grid md:grid-cols-[1fr_300px] gap-6 pb-20 md:pb-6">
          {/* Question Area */}
          <div className="bg-base-100 rounded-2xl shadow-sm relative overflow-hidden min-h-[60vh] flex flex-col mb-6">
            <div className="p-6 flex-1">
              {status === 'loading' ? (
                 <div className="flex flex-col items-center justify-center h-full gap-4">
                   <span className="loading loading-spinner loading-lg text-primary"></span>
                   <p className="text-base-content/60 animate-pulse font-medium">Loading your session...</p>
                 </div>
              ) : (
                <QuestionView
                  question={currentQuestion}
                  selectedOption={answers[currentQuestion?.qid]} // Assuming qid is key, or use index
                  onSelect={(opt) => markAnswer(currentQuestion?.qid, opt)}
                  onNext={next}
                  onPrev={prev}
                />
              )}
            </div>

            {/* Mobile Bottom Buttons (Inside Card) */}
            <div className="md:hidden flex flex-col gap-6 mt-8 pt-6 border-t border-base-200">
               <div className="flex justify-between items-center w-full">
                   <button onClick={prev} disabled={currentIndex === 0} className="btn btn-circle btn-ghost text-base-content bg-base-200/50">
                       <ChevronLeft size={28} />
                   </button>
                   
                   <button onClick={() => setShowFlag(true)} className="btn btn-ghost text-error/80 hover:text-error hover:bg-error/10">
                       <Flag size={24} />
                   </button>

                   <button onClick={next} disabled={currentIndex === questions.length - 1} className="btn btn-circle btn-primary text-white shadow-lg shadow-primary/30">
                       <ChevronRight size={28} />
                   </button>
               </div>

               <button 
                  onClick={() => setShowSubmitConfirm(true)} 
                  className="btn btn-primary btn-outline w-full gap-2 font-bold border-2"
               >
                  Submit
               </button>
            </div>

            {/* Desktop Bottom Buttons (Inside Card) */}
            <div className="hidden md:flex justify-between items-center px-6 py-4 border-t border-base-200 bg-base-50/50">
               <button onClick={prev} disabled={currentIndex === 0} className="btn btn-ghost gap-2 flex items-center">
                   <ChevronLeft size={20} /> Prev
               </button>
               <button onClick={() => setShowFlag(true)} className="btn btn-ghost text-error gap-2 text-xs font-bold uppercase tracking-wider flex items-center">
                   <Flag size={16} /> Report
               </button>
               <button onClick={next} disabled={currentIndex === questions.length - 1} className="btn btn-primary text-white gap-2 flex items-center">
                   Next <ChevronRight size={20} />
               </button>
            </div>
          </div>

          {/* Sidebar (Desktop) */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="bg-base-100 rounded-2xl shadow-sm p-4 flex-1 flex flex-col">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Grid size={18} /> Navigator
              </h3>
              <div className="flex-1 overflow-y-auto max-h-[400px]">
                  <QuestionNavigator
                  total={questions.length}
                  current={currentIndex}
                  answers={Object.keys(answers).reduce((acc, k) => {
                      const idx = questions.findIndex(q => q.qid === k);
                      if (idx >= 0) acc[idx] = true;
                      return acc;
                  }, {})}
                  onJump={jumpTo}
                  />
              </div>
              <div className="pt-4 mt-4 border-t border-base-200">
                  <button 
                      onClick={() => setShowSubmitConfirm(true)} 
                      className="btn btn-primary w-full text-white shadow-lg shadow-primary/20"
                  >
                      Submit Session
                  </button>
              </div>
            </div>
          </div>
        </main>

        {/* Modals/Overlays */}
        {showCal && (
          <CrushCal 
            onClose={() => setShowCal(false)} 
          />
        )}
        {showFlag && (
          <FlagReportModal 
            question={currentQuestion}
            isOpen={showFlag} 
            onClose={() => setShowFlag(false)} 
          />
        )}
        
        {/* Nav Drawer (Mobile & Desktop) */}
        {showNav && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowNav(false)}>
            <div 
              className="absolute right-0 top-16 bottom-0 w-72 bg-base-100/95 backdrop-blur-md border-l border-base-content/10 p-4 shadow-2xl overflow-y-auto flex flex-col" 
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
              
              <div className="flex-1 overflow-y-auto">
                  <QuestionNavigator
                  total={questions.length}
                  current={currentIndex}
                  answers={Object.keys(answers).reduce((acc, k) => {
                      const idx = questions.findIndex(q => q.qid === k);
                      if (idx >= 0) acc[idx] = true;
                      return acc;
                  }, {})} 
                  onJump={(i) => { jumpTo(i); setShowNav(false); }}
                  />
              </div>

              <div className="pt-4 mt-4 border-t border-base-content/10">
                  <button 
                      onClick={() => { setShowNav(false); setShowSubmitConfirm(true); }} 
                      className="btn btn-primary w-full text-white shadow-lg shadow-primary/20"
                  >
                      Submit Session
                  </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-base-100 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={32} className="text-warning" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Submit Session?</h3>
                  <p className="text-base-content/70 mb-6">
                      Are you sure you want to submit? You cannot modify your answers after submission.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                          onClick={() => setShowSubmitConfirm(false)} 
                          className="btn btn-ghost"
                          disabled={isSubmitting}
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleSubmit} 
                          className="btn btn-primary text-white"
                          disabled={isSubmitting}
                      >
                          {isSubmitting ? <span className="loading loading-spinner"></span> : 'Yes, Submit'}
                      </button>
                  </div>
              </div>
          </div>
        )}

        <OfflineSyncStatus isOnline={isOnline} />
      </div>
    </CBTIntegrityGuard>
  );
}
