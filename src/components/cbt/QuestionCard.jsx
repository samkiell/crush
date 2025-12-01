'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export default function QuestionCard({
    question,
    selectedOption,
    onOptionSelect,
    questionNumber
}) {
    if (!question) return null;

    const options = [
        { id: 'A', text: question.optionA },
        { id: 'B', text: question.optionB },
        { id: 'C', text: question.optionC },
        { id: 'D', text: question.optionD },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Question Header */}
            <div className="mb-6">
                <span className="text-sm font-bold text-primary mb-2 block">Question {questionNumber}</span>
                <h2 className="text-xl md:text-2xl font-medium text-base-content leading-relaxed">
                    {question.text}
                </h2>
                {question.image && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-base-content/10">
                        <img src={question.image} alt="Question Diagram" className="w-full h-auto max-h-64 object-contain bg-base-200" />
                    </div>
                )}
            </div>

            {/* Options */}
            <div className="space-y-3">
                {options.map((option) => {
                    const isSelected = selectedOption === option.id;

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => onOptionSelect(option.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`
                                w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group
                                ${isSelected
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-base-content/10 bg-base-100 hover:border-primary/50 hover:bg-base-200/50'
                                }
                            `}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors shrink-0
                                ${isSelected
                                    ? 'bg-primary border-primary text-primary-content'
                                    : 'bg-base-200 border-transparent text-base-content/60 group-hover:bg-base-300'
                                }
                            `}>
                                {option.id}
                            </div>

                            <span className={`text-base md:text-lg ${isSelected ? 'text-base-content font-medium' : 'text-base-content/80'}`}>
                                {option.text}
                            </span>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="ml-auto text-primary"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
