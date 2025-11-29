'use client';

import { Sparkles, Brain, TrendingUp, Clock, Target } from 'lucide-react';

export default function AIInsightsPanel({ stats }) {
    // Mock AI insights - replace with real ML predictions
    const insights = [
        {
            id: 1,
            type: 'mastery',
            icon: Target,
            title: 'Topic Mastery Prediction',
            description: 'At your current pace, you\'ll master Calculus in:',
            value: '~4 days',
            date: 'Dec 3, 2025',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            id: 2,
            type: 'recommendation',
            icon: Brain,
            title: 'Focus Recommendation',
            description: 'Your weakest subject is Chemistry (58%). Focus on:',
            value: 'Organic Chemistry',
            impact: '+12% score boost',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
        },
        {
            id: 3,
            type: 'productivity',
            icon: TrendingUp,
            title: 'Peak Performance Time',
            description: 'You tend to score 15% higher on:',
            value: 'Math between 9-11 AM',
            suggestion: 'Schedule hard topics in the morning',
            color: 'text-info',
            bgColor: 'bg-info/10',
        },
        {
            id: 4,
            type: 'difficulty',
            icon: TrendingUp,
            title: 'Difficulty Level',
            description: 'Currently at Level 7 (Advanced). Based on 85% accuracy:',
            value: 'Ready for Level 8',
            action: 'Challenge yourself!',
            color: 'text-success',
            bgColor: 'bg-success/10',
        },
    ];

    return (
        <div className="bg-base-200 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">AI Insights</h2>
                    <p className="text-xs text-base-content/60">Personalized recommendations</p>
                </div>
            </div>

            {/* Insights List */}
            <div className="space-y-4">
                {insights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                        <div
                            key={insight.id}
                            className="bg-base-100 rounded-xl p-4 border border-base-300 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className={`${insight.bgColor} p-2 rounded-lg flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${insight.color}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-sm text-base-content mb-1">
                                        {insight.title}
                                    </h3>
                                    <p className="text-xs text-base-content/60 mb-2">
                                        {insight.description}
                                    </p>

                                    {/* Value/Prediction */}
                                    <div className={`font-bold ${insight.color} mb-1`}>
                                        {insight.value}
                                    </div>

                                    {/* Additional Info */}
                                    {insight.date && (
                                        <p className="text-xs text-base-content/50">
                                            Target: {insight.date}
                                        </p>
                                    )}
                                    {insight.impact && (
                                        <p className="text-xs text-success">
                                            {insight.impact}
                                        </p>
                                    )}
                                    {insight.suggestion && (
                                        <p className="text-xs text-base-content/60 italic">
                                            💡 {insight.suggestion}
                                        </p>
                                    )}
                                    {insight.action && (
                                        <button className="btn btn-xs btn-outline mt-2">
                                            {insight.action}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Study Streak Reminder */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-base-content mb-1">
                            Keep Your Streak Alive! 🔥
                        </p>
                        <p className="text-xs text-base-content/60">
                            2 more hours to maintain your 12-day streak
                        </p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                </div>
            </div>
        </div>
    );
}
