'use client';

import { Calendar, Target, Flame, TrendingUp } from 'lucide-react';

export default function HeroBanner({ user, stats }) {
    // Mock data - replace with real data
    const examDate = new Date('2025-05-15');
    const today = new Date();
    const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    const dailyGoalProgress = 5; // out of 8 topics
    const dailyGoalTotal = 8;
    const currentStreak = 12;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}></div>
            </div>

            <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Left - Greeting & Exam Countdown */}
                    <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-2">
                            Welcome back, {user?.username || 'Student'}! 👋
                        </h2>
                        <p className="text-base-content/70 mb-4">
                            Keep pushing! You're making excellent progress.
                        </p>

                        {/* Exam Countdown */}
                        <div className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-full inline-flex border border-error/20">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold">
                                JAMB Exam in <span className="text-lg font-bold">{daysUntilExam}</span> days
                            </span>
                        </div>
                    </div>

                    {/* Right - Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        {/* Daily Goal */}
                        <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-primary" />
                                <span className="text-sm text-base-content/60">Daily Goal</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-base-content">{dailyGoalProgress}</span>
                                <span className="text-sm text-base-content/60">/ {dailyGoalTotal}</span>
                            </div>
                            <div className="mt-2">
                                <div className="w-full bg-base-300 rounded-full h-2">
                                    <div
                                        className="bg-primary rounded-full h-2 transition-all duration-500"
                                        style={{ width: `${(dailyGoalProgress / dailyGoalTotal) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Current Streak */}
                        <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <span className="text-sm text-base-content/60">Streak</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-orange-500">{currentStreak}</span>
                                <span className="text-sm text-base-content/60">days</span>
                            </div>
                            <p className="text-xs text-success mt-1">🔥 On fire!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
