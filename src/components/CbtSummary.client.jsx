'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, Clock, ArrowRight, RotateCcw } from 'lucide-react';

export default function CbtSummary({ summary, session }) {
  const router = useRouter();

  if (!summary || !session) return null;

  const { totalQuestions, correct, wrong, unanswered, percentage, score } = summary;
  const { subject, year, startTime, endTime, sessionId } = session;

  // Calculate duration
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  const getGradeColor = (p) => {
    if (p >= 70) return 'text-success';
    if (p >= 50) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-base-content">Session Complete!</h1>
          <p className="text-base-content/60 capitalize">{subject} • {year}</p>
        </div>

        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-200/50 rounded-3xl p-8 text-center border border-base-content/5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="text-sm font-medium text-base-content/60 mb-2">Total Score</div>
            <div className={`text-6xl font-black mb-2 ${getGradeColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-base-content/80 font-medium">
              {score} / {totalQuestions} points
            </div>
          </div>
          
          {/* Background decoration */}
          <div className={`absolute inset-0 opacity-10 blur-3xl ${getGradeColor(percentage).replace('text-', 'bg-')}`} />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-base-100 border border-base-content/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold">{correct}</div>
              <div className="text-xs text-base-content/60">Correct</div>
            </div>
          </div>

          <div className="bg-base-100 border border-base-content/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold">{wrong}</div>
              <div className="text-xs text-base-content/60">Wrong</div>
            </div>
          </div>

          <div className="bg-base-100 border border-base-content/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-base-content/10 text-base-content/60 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold">{unanswered}</div>
              <div className="text-xs text-base-content/60">Unanswered</div>
            </div>
          </div>

          <div className="bg-base-100 border border-base-content/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold">{minutes}m {seconds}s</div>
              <div className="text-xs text-base-content/60">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button 
            onClick={() => router.push(`/cbt/${sessionId}/review`)}
            className="btn btn-primary w-full btn-lg rounded-xl shadow-lg shadow-primary/20"
          >
            Review Questions
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn btn-ghost w-full rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
