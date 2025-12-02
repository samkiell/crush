'use client';
import AudioReader from '@/components/AudioReader.client';
import { useSwipe } from '@/lib/swipeHandler';

export default function QuestionView({ question, selectedOption, onSelect, onNext, onPrev }) {
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
      <div className="flex justify-between items-start mb-4">
        <div className="prose dark:prose-invert max-w-none flex-1 select-none">
          <h3 className="text-lg font-medium leading-relaxed">
            {question.question}
          </h3>
        </div>
        <div className="ml-4">
          <AudioReader text={question.question} />
        </div>
      </div>

      <div className="space-y-3 mt-4">
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
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                ${selectedOption === opt ? 'bg-primary text-white border-primary' : 'border-base-content/30 text-base-content/70'}
              `}>
                {opt}
              </span>
              <span className="text-base-content/90">{question.options[opt]}</span>
            </button>
          )
        ))}
      </div>
    </div>
  );
}
