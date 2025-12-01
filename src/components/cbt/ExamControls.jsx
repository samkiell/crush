'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flag, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExamControls({
    currentQuestion,
    totalQuestions,
    onNext,
    onPrev,
    onSubmit,
    onFlag,
    isFlagged,
    timeLeft = 0, // in seconds
    className = ''
}) {
    // Format time as HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Warning state for low time (e.g., last 5 mins)
    const isLowTime = timeLeft < 300;

    return (
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 bg-base-100 border-t border-base-content/5 p-4 md:px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] ${className}`}>

            {/* Timer (Mobile: Top, Desktop: Left) */}
            <div className={`
                flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg bg-base-200/50
                ${isLowTime ? 'text-error animate-pulse' : 'text-base-content'}
            `}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                <button
                    onClick={onPrev}
                    disabled={currentQuestion === 1}
                    className="btn btn-outline border-base-content/20 hover:border-primary hover:bg-primary hover:text-white disabled:bg-base-200 disabled:border-transparent"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Prev</span>
                </button>

                <button
                    onClick={onFlag}
                    className={`btn gap-2 ${isFlagged ? 'btn-warning text-warning-content' : 'btn-ghost hover:bg-warning/10 text-warning'}`}
                >
                    <Flag className={`w-5 h-5 ${isFlagged ? 'fill-current' : ''}`} />
                    <span className="hidden md:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
                </button>

                <button
                    onClick={onNext}
                    disabled={currentQuestion === totalQuestions}
                    className="btn btn-outline border-base-content/20 hover:border-primary hover:bg-primary hover:text-white disabled:bg-base-200 disabled:border-transparent"
                >
                    <span className="hidden md:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Submit Button */}
            <button
                onClick={onSubmit}
                className="btn btn-primary px-8 shadow-lg shadow-primary/20 w-full md:w-auto"
            >
                Submit Exam
                <Send className="w-4 h-4 ml-2" />
            </button>
        </div>
    );
}
