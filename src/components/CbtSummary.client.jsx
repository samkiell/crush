'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertCircle, Clock, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CbtSummary({ sessionId }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // We can fetch the summary from the submit endpoint again or a dedicated summary endpoint.
                // For now, let's assume we can hit the submit endpoint to get the result if it's already submitted,
                // OR we create a GET /api/cbt/:sessionId/submit (which acts as get result).
                // But typically we might pass data via state or fetch fresh.
                // Let's try fetching session status which might have summary data, or just re-calculate.
                // Actually, the prompt says "Redirect to /cbt/[sessionId]/summary".
                // We need to fetch the data here.
                
                // Let's use the submit endpoint again? No, that's POST.
                // Let's assume we can get the result from a GET endpoint.
                // I'll implement a GET handler in the submit route or a new summary route.
                // For simplicity, let's use the POST submit route which returns the summary if already submitted.
                
                const res = await fetch(`/api/cbt/${sessionId}/submit`, { method: 'POST' });
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data.summary);
                } else {
                    // If it fails (maybe not submitted?), redirect to session
                    // router.push(`/cbt/${sessionId}`);
                }
            } catch (error) {
                console.error("Failed to load summary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [sessionId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!summary) return null;

    const { score, totalQuestions, correct, wrong, unanswered, percentage } = summary;
    
    // Determine grade color
    let gradeColor = 'text-error';
    if (percentage >= 70) gradeColor = 'text-success';
    else if (percentage >= 50) gradeColor = 'text-warning';

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-base-100 rounded-3xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-primary/10 p-8 text-center border-b border-base-200">
                    <h1 className="text-2xl font-bold mb-2">Session Complete!</h1>
                    <p className="text-base-content/60">Here is how you performed</p>
                </div>

                <div className="p-8">
                    {/* Score Card */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {/* Circular Progress (Simplified SVG) */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-base-200"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * percentage) / 100}
                                    className={`${gradeColor} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-bold ${gradeColor}`}>{Math.round(percentage)}%</span>
                                <span className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="bg-success/10 p-4 rounded-2xl text-center">
                            <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                            <div className="text-2xl font-bold text-success">{correct}</div>
                            <div className="text-xs text-base-content/60 font-medium">Correct</div>
                        </div>
                        <div className="bg-error/10 p-4 rounded-2xl text-center">
                            <XCircle className="w-6 h-6 text-error mx-auto mb-2" />
                            <div className="text-2xl font-bold text-error">{wrong}</div>
                            <div className="text-xs text-base-content/60 font-medium">Wrong</div>
                        </div>
                        <div className="bg-base-200 p-4 rounded-2xl text-center">
                            <AlertCircle className="w-6 h-6 text-base-content/40 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-base-content/70">{unanswered}</div>
                            <div className="text-xs text-base-content/60 font-medium">Skipped</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link 
                            href={`/cbt/${sessionId}/review`}
                            className="btn btn-primary btn-lg w-full text-white shadow-lg shadow-primary/20"
                        >
                            <RotateCcw className="w-5 h-5" /> Review Questions
                        </Link>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/cbt" className="btn btn-outline w-full">
                                <ArrowRight className="w-5 h-5" /> New Session
                            </Link>
                            <Link href="/dashboard" className="btn btn-ghost w-full">
                                <Home className="w-5 h-5" /> Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
