'use client';

import Link from 'next/link';
import { Activity, TrendingUp, BarChart3, Target, ArrowRight } from 'lucide-react';
import AnalyticsChart from '../AnalyticsChart';

export default function PerformanceDashboard({ stats, progress }) {
    // Mock performance data
    const weeklyActivity = [
        { day: 'Mon', minutes: 120 },
        { day: 'Tue', minutes: 90 },
        { day: 'Wed', minutes: 150 },
        { day: 'Thu', minutes: 45 },
        { day: 'Fri', minutes: 180 },
        { day: 'Sat', minutes: 200 },
        { day: 'Sun', minutes: 60 },
    ];

    const subjectPerformance = [
        { subject: 'Math', score: 85, target: 90 },
        { subject: 'English', score: 78, target: 85 },
        { subject: 'Physics', score: 92, target: 90 },
        { subject: 'Chemistry', score: 58, target: 80 },
        { subject: 'Biology', score: 76, target: 85 },
    ];

    const topicMastery = [
        { topic: 'Algebra', progress: 95, status: 'mastered' },
        { topic: 'Calculus', progress: 65, status: 'in-progress' },
        { topic: 'Geometry', progress: 100, status: 'mastered' },
        { topic: 'Mechanics', progress: 45, status: 'learning' },
        { topic: 'Organic Chemistry', progress: 30, status: 'weak' },
    ];

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-success';
        if (progress >= 50) return 'bg-primary';
        return 'bg-warning';
    };

    const getStatusBadge = (status) => {
        const badges = {
            mastered: 'badge-success',
            'in-progress': 'badge-primary',
            learning: 'badge-warning',
            weak: 'badge-error',
        };
        return badges[status] || 'badge-neutral';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-base-content">Performance Overview</h2>
                <Link href="/dashboard/analytics" className="btn btn-sm btn-ghost text-primary hover:bg-primary/10">
                    View Full Analytics <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Study Time */}
                <div className="bg-base-200 rounded-xl p-5 border border-base-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs text-success flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +12%
                        </span>
                    </div>
                    <h3 className="text-sm text-base-content/60 mb-1">This Week</h3>
                    <p className="text-2xl font-bold text-base-content">
                        {weeklyActivity.reduce((sum, d) => sum + d.minutes, 0)} min
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                        Avg: {Math.round(weeklyActivity.reduce((sum, d) => sum + d.minutes, 0) / 7)} min/day
                    </p>
                </div>

                {/* Average Accuracy */}
                <div className="bg-base-200 rounded-xl p-5 border border-base-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                            <Target className="w-5 h-5 text-success" />
                        </div>
                        <span className="text-xs text-success flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +5.2%
                        </span>
                    </div>
                    <h3 className="text-sm text-base-content/60 mb-1">Avg Accuracy</h3>
                    <p className="text-2xl font-bold text-base-content">78.5%</p>
                    <p className="text-xs text-base-content/50 mt-1">
                        Improvement: 0.8% per day
                    </p>
                </div>

                {/* Topics Mastered */}
                <div className="bg-base-200 rounded-xl p-5 border border-base-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-xs text-success flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +3
                        </span>
                    </div>
                    <h3 className="text-sm text-base-content/60 mb-1">Topics Mastered</h3>
                    <p className="text-2xl font-bold text-base-content">
                        {topicMastery.filter(t => t.status === 'mastered').length}
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                        Out of {topicMastery.length} total
                    </p>
                </div>
            </div>

            {/* Weekly Activity Heatmap */}
            <div className="bg-base-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-base-content mb-4">
                    Weekly Activity
                </h3>
                <div className="flex items-end justify-between gap-2 h-32">
                    {weeklyActivity.map((day, index) => {
                        const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes));
                        const height = (day.minutes / maxMinutes) * 100;

                        return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-focus cursor-pointer relative group"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-base-content text-base-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {day.minutes} min
                                    </div>
                                </div>
                                <span className="text-xs text-base-content/60">{day.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-base-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-base-content mb-4">
                    Subject Performance
                </h3>
                <div className="space-y-4">
                    {subjectPerformance.map((subject, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-base-content">
                                    {subject.subject}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-base-content/60">
                                        Target: {subject.target}%
                                    </span>
                                    <span className={`text-sm font-bold ${subject.score >= subject.target ? 'text-success' : 'text-warning'
                                        }`}>
                                        {subject.score}%
                                    </span>
                                </div>
                            </div>
                            <div className="relative w-full bg-base-300 rounded-full h-3">
                                {/* Target marker */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-base-content/30"
                                    style={{ left: `${subject.target}%` }}
                                ></div>
                                {/* Progress bar */}
                                <div
                                    className={`rounded-full h-3 transition-all duration-500 ${subject.score >= subject.target ? 'bg-success' : 'bg-primary'
                                        }`}
                                    style={{ width: `${subject.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Topic Mastery Progress */}
            <div className="bg-base-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-base-content mb-4">
                    Topic Mastery Progress
                </h3>
                <div className="space-y-3">
                    {topicMastery.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-base-content">
                                        {topic.topic}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`badge badge-sm ${getStatusBadge(topic.status)}`}>
                                            {topic.status}
                                        </span>
                                        <span className="text-sm text-base-content/60">
                                            {topic.progress}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-2">
                                    <div
                                        className={`${getProgressColor(topic.progress)} rounded-full h-2 transition-all duration-500`}
                                        style={{ width: `${topic.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
