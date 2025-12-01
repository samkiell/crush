'use client';

import { motion } from 'framer-motion';
import { Lightbulb, ArrowUpRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

const InsightCard = ({ type, title, description, delay }) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-6 h-6 text-success" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-warning" />;
            case 'tip': return <Lightbulb className="w-6 h-6 text-primary" />;
            default: return <ArrowUpRight className="w-6 h-6 text-info" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-success/5 border-success/10';
            case 'warning': return 'bg-warning/5 border-warning/10';
            case 'tip': return 'bg-primary/5 border-primary/10';
            default: return 'bg-info/5 border-info/10';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className={`p-4 rounded-2xl border ${getBgColor()} flex gap-4 items-start`}
        >
            <div className="mt-1 shrink-0">
                {getIcon()}
            </div>
            <div>
                <h4 className="font-bold text-base-content text-sm mb-1">{title}</h4>
                <p className="text-xs text-base-content/70 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

const InsightsPanel = ({ insights }) => {
    // Mock insights if not provided
    const mockInsights = [
        {
            type: 'success',
            title: 'Consistent Performance',
            description: 'You have maintained an average score of above 60% for the last 3 tests. Keep it up!'
        },
        {
            type: 'warning',
            title: 'Focus on Physics',
            description: 'Your scores in Physics have dropped by 10% this week. Consider reviewing Mechanics.'
        },
        {
            type: 'tip',
            title: 'Time Management',
            description: 'You spent 5 mins on average per question in Math. Try to reduce this to 3 mins.'
        }
    ];

    const data = insights || mockInsights;

    return (
        <div className="bg-base-100 rounded-3xl p-6 shadow-sm border border-base-300 h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-base-content">AI Insights</h3>
            </div>

            <div className="space-y-4">
                {data.map((insight, index) => (
                    <InsightCard
                        key={index}
                        {...insight}
                        delay={0.4 + (index * 0.1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default InsightsPanel;
