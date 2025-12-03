p'use client';

import { motion } from 'framer-motion';

export default function QuestionGrid({
    totalQuestions = 40,
    currentQuestion = 1,
    answers = {}, // Map of questionId -> answer
    flagged = [], // Array of flagged questionIds
    onQuestionSelect,
    className = ''
}) {
    // Generate array of question numbers
    const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1);

    const getStatusColor = (num) => {
        const isCurrent = currentQuestion === num;
        const isAnswered = answers[num] !== undefined;
        const isFlagged = flagged.includes(num);

        if (isCurrent) return 'bg-primary text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100';
        if (isFlagged) return 'bg-warning text-warning-content';
        if (isAnswered) return 'bg-success text-success-content';
        return 'bg-base-200 text-base-content/70 hover:bg-base-300';
    };

    return (
        <div className={`bg-base-100 rounded-2xl shadow-sm border border-base-content/5 p-4 ${className}`}>
            <h3 className="text-sm font-bold text-base-content/70 mb-4 uppercase tracking-wider">
                Question Navigator
            </h3>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {questions.map((num) => (
                    <motion.button
                        key={num}
                        onClick={() => onQuestionSelect(num)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-200
                            ${getStatusColor(num)}
                        `}
                    >
                        {num}
                    </motion.button>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-base-content/60 border-t border-base-content/5 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-success"></div> Answered
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-warning"></div> Flagged
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-base-200"></div> Unanswered
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded border-2 border-primary"></div> Current
                </div>
            </div>
        </div>
    );
}
