'use client';

import { Star } from 'lucide-react';

export default function QuestionNavigator({ total, current, answers, bookmarks = new Set(), onJump }) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4 overflow-y-auto max-h-60 custom-scrollbar">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === current;
        const isAnswered = answers[i];
        const isBookmarked = bookmarks.has ? bookmarks.has(`q-${i}`) || bookmarks.has(i) : false; // Handle different ID formats if needed, but assuming index or ID mapping

        // Determine base style
        let style = "bg-base-200 text-base-content/70 hover:bg-base-300 border border-base-300"; // Unanswered
        if (isAnswered) style = "bg-success text-success-content border-success"; // Answered
        if (isCurrent) style = "bg-primary text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 border-primary"; // Current
        
        // Bookmark override or overlay? User said "Bookmarked = gold star". 
        // Usually bookmark is an icon ON the button, not replacing the color entirely if it's also answered.
        // But if I must follow "Bookmarked = gold star" as a status color:
        // Let's add a star icon overlay instead, so we can see if it's answered AND bookmarked.
        
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${style}`}
          >
            {i + 1}
            {/* Bookmark Indicator */}
            {bookmarks.has && (bookmarks.has(i) || bookmarks.has(`q-${i}`)) && (
               <div className="absolute -top-1 -right-1 bg-base-100 rounded-full p-0.5 shadow-sm">
                 <Star size={10} className="text-warning fill-warning" />
               </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
