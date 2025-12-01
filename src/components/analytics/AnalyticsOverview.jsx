'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award, Clock, Target, BookOpen } from 'lucide-react';
import { AnimatedCard } from '@/components/ui';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, colorClass, delay }) => (
    <AnimatedCard
        variant="elevated"
        className="relative overflow-hidden"
        delay={delay}
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorClass}`}>
            <Icon className="w-24 h-24" />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl bg-base-100/50 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-base-content/70">{title}</h3>
            </div>

            <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-base-content">{value}</span>
                {trend && (
                    <div className={`flex items-center text-sm font-bold ${trend > 0 ? 'text-success' : 'text-error'}`}>
                        {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <p className="text-sm text-base-content/50">{subtitle}</p>
        </div>
    </AnimatedCard>
);

const AnalyticsOverview = ({ stats }) => {
    // Default stats if not provided
    const defaultStats = {
        averageScore: 0,
        testsTaken: 0,
        studyHours: 0,
        improvement: 0,
        masteryLevel: 'Novice'
    };

    const data = { ...defaultStats, ...stats };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
                title="Average Score"
                value={`${data.averageScore}%`}
                subtitle="Across all subjects"
                icon={Target}
                trend={data.improvement}
                colorClass="text-primary"
                delay={0}
            />
            <StatCard
                title="Tests Taken"
                value={data.testsTaken}
                subtitle="Total mock exams"
                icon={BookOpen}
                colorClass="text-secondary"
                delay={0.1}
            />
            <StatCard
                title="Study Time"
                value={`${data.studyHours}h`}
                subtitle="Total focused hours"
                icon={Clock}
                colorClass="text-accent"
                delay={0.2}
            />
            <StatCard
                title="Mastery Level"
                value={data.masteryLevel}
                subtitle="Based on performance"
                icon={Award}
                colorClass="text-warning"
                delay={0.3}
            />
        </div>
    );
};

export default AnalyticsOverview;
