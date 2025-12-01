'use client';

import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { useTheme } from '@/utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-base-100 p-4 rounded-xl shadow-xl border border-base-300">
                <p className="font-bold text-base-content mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}%</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const PerformanceCharts = ({ historyData, subjectData }) => {
    // Mock data if not provided
    const mockHistory = [
        { date: 'Mon', score: 45 },
        { date: 'Tue', score: 52 },
        { date: 'Wed', score: 48 },
        { date: 'Thu', score: 60 },
        { date: 'Fri', score: 58 },
        { date: 'Sat', score: 65 },
        { date: 'Sun', score: 72 },
    ];

    const mockSubjects = [
        { subject: 'Maths', score: 75, color: '#FF6B6B' },
        { subject: 'Eng', score: 60, color: '#4ECDC4' },
        { subject: 'Phy', score: 45, color: '#45B7D1' },
        { subject: 'Chem', score: 80, color: '#96CEB4' },
        { subject: 'Bio', score: 55, color: '#FFEEAD' },
    ];

    const history = historyData || mockHistory;
    const subjects = subjectData || mockSubjects;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score History Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-base-100 rounded-3xl p-6 shadow-sm border border-base-300"
            >
                <h3 className="text-lg font-bold text-base-content mb-6">Score History</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--fallback-bc,oklch(var(--bc)/0.1))" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--fallback-bc,oklch(var(--bc)/0.6))', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--fallback-bc,oklch(var(--bc)/0.6))', fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Subject Performance Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-base-100 rounded-3xl p-6 shadow-sm border border-base-300"
            >
                <h3 className="text-lg font-bold text-base-content mb-6">Subject Mastery</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--fallback-bc,oklch(var(--bc)/0.1))" />
                            <XAxis
                                dataKey="subject"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--fallback-bc,oklch(var(--bc)/0.6))', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--fallback-bc,oklch(var(--bc)/0.6))', fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                {subjects.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score >= 70 ? '#22c55e' : entry.score >= 50 ? '#eab308' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default PerformanceCharts;
