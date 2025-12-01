'use client';

import { ChevronLeft, ChevronRight, Flag, Send } from 'lucide-react';

export default function ExamControls({
    currentQuestion,
    totalQuestions,
    onNext,
    onPrev,
    onSubmit,
    onFlag,
    isFlagged,
    className = ''
}) {
    return (
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 bg-base-100 border-t border-base-content/5 p-4 md:px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] ${className}`}>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start flex-1">
                <button
                    onClick={onPrev}
                    disabled={currentQuestion === 1}
                    className="btn btn-outline border-base-content/20 hover:border-primary hover:bg-primary hover:text-white disabled:bg-base-200 disabled:border-transparent flex items-center gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Prev</span>
                </button>

                <button
                    onClick={onFlag}
                    className={`btn flex items-center gap-2 ${isFlagged ? 'btn-warning text-warning-content' : 'btn-ghost hover:bg-warning/10 text-warning'}`}
                >
                    <Flag className={`w-5 h-5 ${isFlagged ? 'fill-current' : ''}`} />
                    <span className="hidden md:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
                </button>

                <button
                    onClick={onNext}
                    disabled={currentQuestion === totalQuestions}
                    className="btn btn-outline border-base-content/20 hover:border-primary hover:bg-primary hover:text-white disabled:bg-base-200 disabled:border-transparent flex items-center gap-2"
                >
                    <span className="hidden md:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Submit Button */}
            <button
                onClick={onSubmit}
                className="btn btn-primary px-8 shadow-lg shadow-primary/20 w-full md:w-auto flex items-center gap-2"
            >
                <span>Submit Exam</span>
                <Send className="w-4 h-4" />
            </button>
        </div>
    );
}
