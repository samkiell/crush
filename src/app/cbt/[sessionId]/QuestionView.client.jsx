'use client';
import AudioReader from '@/components/AudioReader.client';
import { useSwipe } from '@/lib/swipeHandler';
import { Star } from 'lucide-react';

export default function QuestionView({ question, selectedOption, onSelect, onNext, onPrev, isBookmarked, onToggleBookmark, showExplanation = false }) {
  const { onTouchStart, onTouchEnd } = useSwipe(onNext, onPrev);

  if (!question) return <div className="p-8 text-center">Loading question...</div>;

  return (
    <div 
      className="flex flex-col h-full"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="prose dark:prose-invert max-w-none flex-1 select-none">
          <h3 className="text-lg font-medium leading-relaxed">
            {question.question}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={onToggleBookmark}
            className={`btn btn-circle btn-sm ${isBookmarked ? 'btn-warning text-white' : 'btn-ghost text-base-content/30'}`}
          >
            <Star size={18} className={isBookmarked ? 'fill-current' : ''} />
          </button>
          <AudioReader 
            text={question.question} 
            options={question.options}
          />
        </div>
      </div>

      <div className="space-y-3 mt-4 mb-8">
        {['A', 'B', 'C', 'D', 'E'].map((opt) => (
          question.options[opt] && (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3
                ${selectedOption === opt 
                  ? 'bg-primary/10 border-primary ring-1 ring-primary' 
                  : 'bg-base-100 border-base-300 hover:bg-base-200'}
              `}
            >
              <span className={`flex-shrink-0 font-bold
                ${selectedOption === opt ? 'text-primary' : 'text-base-content/70'}
              `}>
                {opt}.
              </span>
              <span className="text-base-content/90">{question.options[opt]}</span>
            </button>
          )
        ))}
      </div>

      {/* Explanation Section */}
      {showExplanation && question.explanation && (
        <div className="mt-6 p-4 bg-base-200/50 rounded-xl border border-base-content/5">
          <div className="flex items-center justify-between mb-2">
             <h4 className="font-bold text-sm uppercase tracking-wider opacity-70">Explanation</h4>
             <AudioReader text={question.explanation} />
          </div>
          <p className="text-base-content/80 text-sm leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
