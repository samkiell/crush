'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, TrendingUp, Clock, Target, MoreHorizontal } from 'lucide-react';
import { stagger, variants } from '@/lib/motionConfig';

export default function ProgressLayer({ stats, progress }) {
    // Mock data - replace with real props
    const dailyGoals = [
        { id: 1, title: '20 Physics Questions', completed: true, subject: 'Physics' },
        { id: 2, title: 'Read Cell Biology', completed: false, subject: 'Biology' },
        { id: 3, title: 'English Mock Test', completed: false, subject: 'English' },
    ];

    const completedGoals = dailyGoals.filter(g => g.completed).length;
    const progressPercentage = Math.round((completedGoals / dailyGoals.length) * 100);

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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger.container(0.1)}
            initial="initial"
            animate="animate"
        >
            {/* Daily Goals Card */}
            <motion.div variants={variants.fadeUp} className="bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-base-content">Daily Goals</h3>
                        <p className="text-xs text-base-content/60">{completedGoals}/{dailyGoals.length} Completed</p>
                    </div>
                    <div className="radial-progress text-primary text-xs font-bold" style={{ "--value": progressPercentage, "--size": "2.5rem" }}>
                        {progressPercentage}%
                    </div>
                </div>
                <div className="space-y-2">
                    {dailyGoals.slice(0, 2).map((goal) => (
                        <div key={goal.id} className="flex items-center gap-2 text-sm">
                            {goal.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                            ) : (
                                <Circle className="w-4 h-4 text-base-content/30 flex-shrink-0" />
                            )}
                            <span className={`truncate ${goal.completed ? 'text-base-content/50 line-through' : 'text-base-content/80'}`}>
                                {goal.title}
                            </span>
                        </div>
                    ))}
                    {dailyGoals.length > 2 && (
                        <p className="text-xs text-primary font-medium cursor-pointer hover:underline pl-6">
                            +{dailyGoals.length - 2} more items
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Today's Plan Card */}
            <motion.div variants={variants.fadeUp} className="bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-base-content">Today's Plan</h3>
                    <button className="btn btn-ghost btn-xs btn-circle">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative flex items-center justify-center py-2">
                    {/* Simplified visual representation of a plan */}
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-1 bg-primary/20 h-16 rounded-full relative">
                            <div className="absolute top-0 w-full bg-primary h-1/2 rounded-full" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="bg-base-200 p-2 rounded-xl text-xs">
                                <span className="font-semibold block text-primary">Now</span>
                                <span className="opacity-70">Physics Practice</span>
                            </div>
                            <div className="text-xs opacity-50 pl-2">
                                Next: Biology Review
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Performance Overview */}
            <motion.div variants={variants.fadeUp} className="bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-base-content mb-4">Performance</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-200/50 p-3 rounded-2xl">
                        <div className="flex items-center gap-1 text-xs text-base-content/60 mb-1">
                            <Target className="w-3 h-3" /> Accuracy
                        </div>
                        <p className="text-lg font-bold text-base-content">78%</p>
                    </div>
                    <div className="bg-base-200/50 p-3 rounded-2xl">
                        <div className="flex items-center gap-1 text-xs text-base-content/60 mb-1">
                            <Clock className="w-3 h-3" /> Time
                        </div>
                        <p className="text-lg font-bold text-base-content">2.5h</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-success font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% vs last week</span>
                </div>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div variants={variants.fadeUp} className="bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-base-content mb-4">Activity</h3>
                <div className="flex items-end justify-between h-24 gap-1">
                    {weeklyActivity.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                            <div
                                className="w-full bg-primary/20 rounded-t-md relative group hover:bg-primary transition-colors"
                                style={{ height: `${(d.val / maxActivity) * 100}%` }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-base-content text-base-100 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {d.val}m
                                </div>
                            </div>
                            <span className="text-[10px] text-base-content/40 font-medium">{d.day}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
