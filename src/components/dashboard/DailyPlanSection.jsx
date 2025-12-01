'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui';
import { stagger, variants } from '@/lib/motionConfig';

export default function DailyPlanSection({ stats }) {
    const dailyGoals = [
        { id: 1, title: 'Complete 20 Physics Questions', completed: true, subject: 'Physics' },
        { id: 2, title: 'Read Chapter 4: Cell Biology', completed: false, subject: 'Biology' },
        { id: 3, title: 'Take English Mock Test', completed: false, subject: 'English' },
    ];

    const progress = Math.round((dailyGoals.filter(g => g.completed).length / dailyGoals.length) * 100);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-base-content">Today's Plan</h2>
                <AnimatedButton variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View Full Schedule
                </AnimatedButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progress Card */}
                <AnimatedCard className="flex flex-col items-center justify-center text-center">
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                className="stroke-base-300 fill-none"
                                strokeWidth="12"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="56"
                                className="stroke-primary fill-none"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray="351.86"
                                initial={{ strokeDashoffset: 351.86 }}
                                animate={{ strokeDashoffset: 351.86 - (351.86 * progress) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-base-content">{progress}%</span>
                            <span className="text-xs text-base-content/60">Complete</span>
                        </div>
                    </div>
                    <h3 className="font-semibold text-base-content">Daily Goals</h3>
                    <p className="text-sm text-base-content/60">
                        {dailyGoals.filter(g => g.completed).length} of {dailyGoals.length} tasks done
                    </p>
                </AnimatedCard>

                {/* Task List */}
                <div className="md:col-span-2 space-y-3">
                    <motion.div
                        variants={stagger.container(0.1)}
                        initial="initial"
                        animate="animate"
                        className="space-y-3"
                    >
                        {dailyGoals.map((goal) => (
                            <motion.div
                                key={goal.id}
                                variants={variants.slideLeft}
                                className={`
                  group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                  ${goal.completed
                                        ? 'bg-base-100/50 border-base-200 opacity-70'
                                        : 'bg-base-100 border-base-300 shadow-sm hover:shadow-md hover:border-primary/30'
                                    }
                `}
                            >
                                <button className={`
                  flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${goal.completed
                                        ? 'bg-success border-success text-white'
                                        : 'border-base-300 text-transparent group-hover:border-primary'
                                    }
                `}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </button>

                                <div className="flex-1">
                                    <h4 className={`font-medium ${goal.completed ? 'line-through text-base-content/50' : 'text-base-content'}`}>
                                        {goal.title}
                                    </h4>
                                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                                        {goal.subject}
                                    </span>
                                </div>

                                {!goal.completed && (
                                    <AnimatedButton variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                        Start
                                    </AnimatedButton>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
