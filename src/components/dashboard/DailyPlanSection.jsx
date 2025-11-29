'use client';

import { Clock, PlayCircle, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function DailyPlanSection({ stats }) {
    // Mock daily plan - replace with real data
    const dailyPlan = [
        {
            id: 1,
            time: '9:00 AM',
            subject: 'Chemistry',
            topic: 'Redox Reactions',
            duration: '45 min',
            status: 'completed',
            progress: 100,
        },
        {
            id: 2,
            time: '11:00 AM',
            subject: 'Mathematics',
            topic: 'Calculus - Differentiation',
            duration: '60 min',
            status: 'in-progress',
            progress: 65,
        },
        {
            id: 3,
            time: '2:00 PM',
            subject: 'English',
            topic: 'Comprehension Practice',
            duration: '30 min',
            status: 'pending',
            progress: 0,
        },
        {
            id: 4,
            time: '4:00 PM',
            subject: 'Physics',
            topic: 'Mechanics - Newton\'s Laws',
            duration: '45 min',
            status: 'pending',
            progress: 0,
        },
    ];

    const getSubjectColor = (subject) => {
        const colors = {
            Mathematics: 'badge-primary',
            English: 'badge-secondary',
            Physics: 'badge-accent',
            Chemistry: 'badge-info',
            Biology: 'badge-success',
        };
        return colors[subject] || 'badge-neutral';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-success" />;
            case 'in-progress':
                return <PlayCircle className="w-5 h-5 text-primary animate-pulse" />;
            default:
                return <Circle className="w-5 h-5 text-base-content/30" />;
        }
    };

    return (
        <div className="bg-base-200 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-base-content">Today's Plan</h2>
                    <p className="text-sm text-base-content/60">
                        {dailyPlan.filter(p => p.status === 'completed').length} of {dailyPlan.length} completed
                    </p>
                </div>
                <button className="btn btn-ghost btn-sm gap-2">
                    View All
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Time Blocks */}
            <div className="space-y-4">
                {dailyPlan.map((block) => (
                    <div
                        key={block.id}
                        className={`bg-base-100 rounded-xl p-4 border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${block.status === 'in-progress'
                                ? 'border-primary shadow-lg shadow-primary/20'
                                : block.status === 'completed'
                                    ? 'border-success/30 opacity-75'
                                    : 'border-base-300'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <div className="flex-shrink-0 mt-1">
                                {getStatusIcon(block.status)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`badge ${getSubjectColor(block.subject)} badge-sm`}>
                                                {block.subject}
                                            </span>
                                            <span className="text-xs text-base-content/60 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {block.time}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-base-content">{block.topic}</h3>
                                        <p className="text-sm text-base-content/60">{block.duration}</p>
                                    </div>

                                    {/* Action Button */}
                                    {block.status === 'in-progress' && (
                                        <button className="btn btn-primary btn-sm gap-2">
                                            <PlayCircle className="w-4 h-4" />
                                            Resume
                                        </button>
                                    )}
                                    {block.status === 'pending' && (
                                        <button className="btn btn-outline btn-sm">
                                            Start
                                        </button>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                {block.progress > 0 && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs text-base-content/60 mb-1">
                                            <span>Progress</span>
                                            <span>{block.progress}%</span>
                                        </div>
                                        <div className="w-full bg-base-300 rounded-full h-2">
                                            <div
                                                className={`rounded-full h-2 transition-all duration-500 ${block.status === 'completed' ? 'bg-success' : 'bg-primary'
                                                    }`}
                                                style={{ width: `${block.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Next Up Card */}
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-base-content/60 mb-1">Up Next</p>
                        <p className="font-semibold text-base-content">
                            {dailyPlan.find(p => p.status === 'pending')?.topic || 'All done for today! 🎉'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-base-content/60">Starts in</p>
                        <p className="text-lg font-bold text-primary">25 min</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
