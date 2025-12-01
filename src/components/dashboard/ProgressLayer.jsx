'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target } from 'lucide-react';
import { stagger, variants } from '@/lib/motionConfig';

export default function ProgressLayer({ stats, progress }) {
    const weeklyActivity = [
        { day: 'M', val: 60 },
        { day: 'T', val: 45 },
        { day: 'W', val: 80 },
        { day: 'T', val: 30 },
        { day: 'F', val: 90 },
        { day: 'S', val: 50 },
        { day: 'S', val: 20 },
    ];

    const maxActivity = Math.max(...weeklyActivity.map(d => d.val));

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={stagger.container(0.1)}
            initial="initial"
            animate="animate"
        >
            {/* Performance Overview */}
            <motion.div variants={variants.fadeUp} className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-base-content mb-4 text-lg">Performance Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-base-200/50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                            <Target className="w-4 h-4" /> Accuracy
                        </div>
                        <p className="text-2xl font-bold text-base-content">78%</p>
                        <div className="mt-2 text-xs text-success font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +2.4%
                        </div>
                    </div>
                    <div className="bg-base-200/50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-sm text-base-content/60 mb-2">
                            <Clock className="w-4 h-4" /> Time Spent
                        </div>
                        <p className="text-2xl font-bold text-base-content">12.5h</p>
                        <div className="mt-2 text-xs text-success font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +1.5h
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div variants={variants.fadeUp} className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-base-content text-lg">Weekly Activity</h3>
                    <span className="text-xs text-base-content/50 font-medium">Last 7 Days</span>
                </div>
                <div className="flex items-end justify-between h-32 gap-2">
                    {weeklyActivity.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                            <div
                                className="w-full bg-primary/20 rounded-t-lg relative group hover:bg-primary transition-all duration-300"
                                style={{ height: `${(d.val / maxActivity) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-content text-base-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {d.val} min
                                </div>
                            </div>
                            <span className="text-xs text-base-content/40 font-medium">{d.day}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
