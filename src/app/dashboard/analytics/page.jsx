'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { AnalyticsDashboard } from '@/components/analytics';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const user = useSelector(selectUser);
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        // Simulate fetching analytics data
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // In a real app, you would fetch this from an API endpoint
                // const response = await fetch('/api/analytics');
                // const data = await response.json();

                // Mock data for demonstration
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockData = {
                    stats: {
                        averageScore: 72,
                        testsTaken: 15,
                        studyHours: 42,
                        improvement: 12,
                        masteryLevel: 'Intermediate'
                    },
                    historyData: [
                        { date: 'Nov 24', score: 55 },
                        { date: 'Nov 25', score: 58 },
                        { date: 'Nov 26', score: 62 },
                        { date: 'Nov 27', score: 60 },
                        { date: 'Nov 28', score: 68 },
                        { date: 'Nov 29', score: 70 },
                        { date: 'Nov 30', score: 75 },
                    ],
                    subjectData: [
                        { subject: 'Maths', score: 78, color: '#FF6B6B' },
                        { subject: 'English', score: 65, color: '#4ECDC4' },
                        { subject: 'Physics', score: 55, color: '#45B7D1' },
                        { subject: 'Chemistry', score: 82, color: '#96CEB4' },
                        { subject: 'Biology', score: 60, color: '#FFEEAD' },
                        { subject: 'Econ', score: 70, color: '#D4A5A5' },
                    ],
                    insights: [
                        {
                            type: 'success',
                            title: 'Chemistry Whiz!',
                            description: 'You are performing exceptionally well in Chemistry (82%). Consider taking advanced modules.'
                        },
                        {
                            type: 'warning',
                            title: 'Physics Needs Attention',
                            description: 'Your Physics score (55%) is below your average. We recommend reviewing "Motion" and "Forces".'
                        },
                        {
                            type: 'tip',
                            title: 'Consistency Key',
                            description: 'You perform 15% better on tests taken in the morning. Try to schedule your study sessions then.'
                        },
                        {
                            type: 'info',
                            title: 'Exam Readiness',
                            description: 'Based on your current trajectory, you are on track to hit your target score by mid-December.'
                        }
                    ]
                };

                setAnalyticsData(mockData);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAnalytics();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 pb-20 md:pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnalyticsDashboard
                        stats={analyticsData?.stats}
                        historyData={analyticsData?.historyData}
                        subjectData={analyticsData?.subjectData}
                        insights={analyticsData?.insights}
                    />
                </motion.div>
            </div>
        </div>
    );
}
