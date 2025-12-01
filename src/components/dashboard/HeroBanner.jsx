'use client';

import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy, ArrowRight } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui';
import { stagger, variants } from '@/lib/motionConfig';

export default function HeroBanner({ user, stats }) {
    // Calculate days until JAMB (Example date: April 19, 2026)
    const examDate = new Date('2026-04-19');
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const firstName = user?.name?.split(' ')[0] || 'Scholar';

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger.container(0.1)}
            initial="initial"
            animate="animate"
        >
            {/* Welcome & Countdown Card */}
            <AnimatedCard
                variant="gradient"
                className="md:col-span-2 relative overflow-hidden"
                hoverable={true}
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Calendar className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                    <motion.div variants={variants.fadeUp}>
                        <h1 className="text-3xl font-bold mb-2">
                            Ready to crush it, {firstName}? 🚀
                        </h1>
                        <p className="text-white/90 mb-6 max-w-md">
                            Your daily goals are set. Let's make today count towards your success.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex items-end gap-2 mb-2"
                        variants={variants.scale}
                    >
                        <span className="text-6xl font-bold font-display">{daysRemaining}</span>
                        <span className="text-xl font-medium mb-2 opacity-90">days until JAMB</span>
                    </motion.div>

                    <div className="w-full bg-white/20 h-2 rounded-full mb-6 max-w-md">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.max(0, Math.min(100, 100 - (daysRemaining / 365) * 100))}%` }}
                        />
                    </div>

                    <AnimatedButton
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-primary"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        Go to Study Plan
                    </AnimatedButton>
                </div>
            </AnimatedCard>

            {/* Streak & Stats Card */}
            <div className="grid grid-rows-2 gap-6">
                {/* Streak Card */}
                <AnimatedCard
                    variant="elevated"
                    className="border-warning/20 bg-gradient-to-br from-base-100 to-base-200"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base-content">Current Streak</h3>
                        <div className="p-2 bg-warning/10 rounded-full text-warning">
                            <Flame className="w-5 h-5 fill-warning" />
                        </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-warning">
                            {stats?.streak || 0}
                        </span>
                        <span className="text-sm text-base-content/60">days on fire! 🔥</span>
                    </div>
                    <p className="text-xs text-base-content/50 mt-2">
                        Keep it up! You're building a habit.
                    </p>
                </AnimatedCard>

                {/* Quick Stat */}
                <AnimatedCard variant="glass">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base-content">Topics Mastered</h3>
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-primary">
                            {stats?.topicsMastered || 0}
                        </span>
                        <span className="text-sm text-base-content/60">topics</span>
                    </div>
                    <p className="text-xs text-base-content/50 mt-2">
                        Top 5% of students this week
                    </p>
                </AnimatedCard>
            </div>
        </motion.div>
    );
}
