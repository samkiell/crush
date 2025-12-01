'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertCircle, Home, RotateCcw } from 'lucide-react';

export default function ResultPage() {
    // Mock result data (in a real app, retrieve from state/API)
    const result = {
        score: 28,
        total: 40,
        percentage: 70,
        correct: 28,
        wrong: 8,
        skipped: 4,
        timeSpent: "1h 45m"
    };

    const getGradeColor = (p) => {
        if (p >= 70) return 'text-success';
        if (p >= 50) return 'text-warning';
        return 'text-error';
    };

    const getGradeMessage = (p) => {
        if (p >= 70) return 'Excellent Work! 🌟';
        if (p >= 50) return 'Good Effort! 👍';
        return 'Keep Practicing! 💪';
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-base-100 w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-primary/10 p-8 text-center border-b border-base-content/5">
                    <h1 className="text-2xl font-bold text-base-content mb-2">Exam Result</h1>
                    <p className="text-base-content/60">JAMB Mathematics 1978</p>
                </div>

                <div className="p-8">
                    {/* Score Circle */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <div className="relative w-40 h-40 mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    className="stroke-base-200 fill-none"
                                    strokeWidth="12"
                                />
                                <motion.circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    className={`fill-none ${getGradeColor(result.percentage).replace('text-', 'stroke-')}`}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray="439.8"
                                    initial={{ strokeDashoffset: 439.8 }}
                                    animate={{ strokeDashoffset: 439.8 - (439.8 * result.percentage) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-bold ${getGradeColor(result.percentage)}`}>
                                    {result.percentage}%
                                </span>
                            </div>
                        </div>
                        <h2 className={`text-2xl font-bold ${getGradeColor(result.percentage)}`}>
                            {getGradeMessage(result.percentage)}
                        </h2>
                        <p className="text-base-content/60 mt-2">
                            You scored {result.score} out of {result.total}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="bg-success/10 p-4 rounded-2xl text-center">
                            <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                            <div className="text-2xl font-bold text-success">{result.correct}</div>
                            <div className="text-xs text-base-content/60 uppercase tracking-wider">Correct</div>
                        </div>
                        <div className="bg-error/10 p-4 rounded-2xl text-center">
                            <XCircle className="w-6 h-6 text-error mx-auto mb-2" />
                            <div className="text-2xl font-bold text-error">{result.wrong}</div>
                            <div className="text-xs text-base-content/60 uppercase tracking-wider">Wrong</div>
                        </div>
                        <div className="bg-base-200 p-4 rounded-2xl text-center">
                            <AlertCircle className="w-6 h-6 text-base-content/40 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-base-content/60">{result.skipped}</div>
                            <div className="text-xs text-base-content/60 uppercase tracking-wider">Skipped</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/dashboard" className="btn btn-outline flex-1 gap-2">
                            <Home className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <Link href="/cbt" className="btn btn-primary flex-1 gap-2 shadow-lg shadow-primary/20">
                            <RotateCcw className="w-4 h-4" />
                            Take Another Test
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
