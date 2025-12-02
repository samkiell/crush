'use client';
import { useState, useEffect } from 'react';
import { useCbtSession } from '@/lib/useCbtSession';
import QuestionView from './QuestionView.client';
import QuestionNavigator from '@/components/QuestionNavigator.client';
import CrushCal from '@/components/CrushCal.client';
import OfflineSyncStatus from '@/components/OfflineSyncStatus.client';
import FlagReportModal from '@/components/FlagReportModal.client';
import { Calculator, Grid, Flag, Clock, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';

export default function CbtSessionShell({ sessionId, subject, year }) {
  const {
    questions,
    currentIndex,
    answers,
    timeLeft,
    status,
    isOnline,
    markAnswer,
    next,
    prev,
    jumpTo
  } = useCbtSession({ sessionId, endTime: null, initialQuestions: null }); // Pass actual props if available

  const [showCal, setShowCal] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showFlag, setShowFlag] = useState(false);

  // Format time
  const formatTime = (ms) => {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 1000 / 60) % 60);
    const h = Math.floor((ms / 1000 / 60 / 60));
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header */}
      <header className="bg-base-100 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
           <Link href="/cbt" className="btn btn-ghost btn-sm btn-circle">
             <ChevronLeft />
           </Link>
           <div>
             <h1 className="font-bold text-sm md:text-base leading-tight">
               JAMB • {year}
             </h1>
             <p className="text-xs text-base-content/60 font-mono capitalize">
               Question {currentIndex + 1}/{questions.length} • {subject?.replace(/-/g, ' ')}
             </p>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-sm md:text-base font-bold bg-base-200 px-3 py-1.5 rounded-lg">
            <Clock size={16} className={timeLeft < 300000 ? 'text-error animate-pulse' : 'text-primary'} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button onClick={() => setShowNav(!showNav)} className="btn btn-ghost btn-sm btn-circle md:hidden">
            <Grid size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 grid md:grid-cols-[1fr_300px] gap-6">
        {/* Question Area */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 relative overflow-hidden min-h-[60vh]">
          {status === 'loading' ? (
             <div className="flex items-center justify-center h-full">
               <span className="loading loading-spinner loading-lg text-primary"></span>
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

        {/* Sidebar (Desktop) */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="bg-base-100 rounded-2xl shadow-sm p-4 flex-1">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Grid size={18} /> Navigator
            </h3>
            <QuestionNavigator
              total={questions.length}
              current={currentIndex}
              answers={Object.keys(answers).reduce((acc, k) => {
                 // Map questionId back to index if needed, or just pass simple array if logic allows
                 // For now, let's assume answers is keyed by index or we map it
                 const idx = questions.findIndex(q => q.qid === k);
                 if (idx >= 0) acc[idx] = true;
                 return acc;
              }, {})}
              onJump={jumpTo}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowCal(true)} className="btn btn-neutral flex items-center gap-2">
              <Calculator size={18} /> Calculator
            </button>
            <button onClick={() => setShowFlag(true)} className="btn btn-error btn-outline flex items-center gap-2">
              <Flag size={18} /> Report
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Footer Controls */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 p-3 flex justify-between items-center z-30 safe-area-bottom">
        <button onClick={prev} className="btn btn-circle btn-ghost" disabled={currentIndex === 0}>
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex gap-2">
          <button onClick={() => setShowCal(true)} className="btn btn-circle btn-ghost">
            <Calculator size={20} />
          </button>
          <button onClick={() => setShowFlag(true)} className="btn btn-circle btn-ghost text-error">
            <Flag size={20} />
          </button>
        </div>

        <button onClick={next} className="btn btn-circle btn-primary text-white" disabled={currentIndex === questions.length - 1}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Modals/Overlays */}
      {showCal && <CrushCal onClose={() => setShowCal(false)} />}
      {showFlag && (
        <FlagReportModal 
          sessionId={sessionId} 
          questionId={currentQuestion?.qid} 
          isOpen={showFlag} 
          onClose={() => setShowFlag(false)} 
        />
      )}
      
      {/* Mobile Nav Drawer */}
      {showNav && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowNav(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-base-100 p-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4">Questions</h3>
            <QuestionNavigator
              total={questions.length}
              current={currentIndex}
              answers={answers} // Need to map properly
              onJump={(i) => { jumpTo(i); setShowNav(false); }}
            />
          </div>
        </div>
      )}

      <OfflineSyncStatus isOnline={isOnline} />
    </div>
  );
}
