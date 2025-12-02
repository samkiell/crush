'use client';

export default function QuestionNavigator({ total, current, answers, onJump }) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4 overflow-y-auto max-h-60">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${i === current ? 'bg-primary text-white ring-2 ring-primary-content' : 
              answers[i] ? 'bg-success text-white' : 'bg-base-200 text-base-content hover:bg-base-300'}
          `}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
