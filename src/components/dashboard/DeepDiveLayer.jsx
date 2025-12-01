'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, BookOpen, Brain, Award, Trophy, Zap, BarChart3, Star } from 'lucide-react';
import { stagger, variants } from '@/lib/motionConfig';

const CollapseSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-base-100 border border-base-200 rounded-2xl shadow-sm mb-3 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-base-200/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-medium">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-base-content/50" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-4 pt-0 border-t border-base-200/50">
                            <div className="pt-4">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function DeepDiveLayer({ stats, user }) {
    return (
        <motion.div
            className="space-y-2"
            variants={stagger.container(0.1)}
            initial="initial"
            animate="animate"
        >
            <h2 className="text-xl font-bold text-base-content px-1 mb-4">Deep Dive</h2>

            {/* Subject Performance */}
            <CollapseSection title="Subject Performance" icon={BarChart3}>
                <div className="space-y-4">
                    {[
                        { subject: 'Mathematics', score: 85, target: 90 },
                        { subject: 'English', score: 78, target: 85 },
                        { subject: 'Physics', score: 92, target: 95 },
                    ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{item.subject}</span>
                                <span className="text-base-content/60">{item.score}% / {item.target}%</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: `${item.score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CollapseSection>

            {/* Topic Mastery */}
            <CollapseSection title="Topic Mastery" icon={BookOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { topic: 'Algebra', status: 'Mastered', color: 'badge-success' },
                        { topic: 'Mechanics', status: 'Learning', color: 'badge-warning' },
                        { topic: 'Organic Chem', status: 'Weak', color: 'badge-error' },
                        { topic: 'Grammar', status: 'In Progress', color: 'badge-info' },
                    ].map((topic, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl">
                            <span className="font-medium text-sm">{topic.topic}</span>
                            <span className={`badge badge-sm ${topic.color}`}>{topic.status}</span>
                        </div>
                    ))}
                </div>
            </CollapseSection>

            {/* AI Insights */}
            <CollapseSection title="AI Insights" icon={Brain}>
                <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
                    <p className="text-sm text-base-content/80 italic">
                        "Based on your recent tests, you should focus on <strong>Organic Chemistry</strong> this weekend. You tend to score 15% higher in the mornings!"
                    </p>
                </div>
            </CollapseSection>

            {/* Achievements */}
            <CollapseSection title="Achievements" icon={Award}>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { name: 'Speed Demon', icon: '⚡' },
                        { name: 'On Fire', icon: '🔥' },
                        { name: 'Scholar', icon: '🎓' },
                    ].map((badge, idx) => (
                        <div key={idx} className="flex flex-col items-center p-3 bg-base-200 rounded-xl min-w-[100px]">
                            <span className="text-2xl mb-1">{badge.icon}</span>
                            <span className="text-xs font-medium text-center">{badge.name}</span>
                        </div>
                    ))}
                </div>
            </CollapseSection>

            {/* Leaderboard */}
            <CollapseSection title="Leaderboard" icon={Trophy}>
                <div className="space-y-2">
                    {[
                        { rank: 1, name: 'Adewale', points: 2840 },
                        { rank: 2, name: 'Chioma', points: 2720 },
                        { rank: 3, name: 'You', points: 2520, highlight: true },
                    ].map((user, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${user.highlight ? 'bg-primary/10 border border-primary/20' : 'bg-base-100'}`}>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-base-content/50">#{user.rank}</span>
                                <span className="font-medium">{user.name}</span>
                            </div>
                            <span className="font-bold text-primary">{user.points}</span>
                        </div>
                    ))}
                </div>
            </CollapseSection>

            {/* Daily Challenge */}
            <CollapseSection title="Daily Challenge" icon={Star}>
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-xl border border-warning/20">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-warning" />
                        <div>
                            <p className="font-bold text-sm">Complete 50 Questions</p>
                            <p className="text-xs opacity-70">Reward: +100 XP</p>
                        </div>
                    </div>
                    <button className="btn btn-sm btn-warning">Start</button>
                </div>
            </CollapseSection>

        </motion.div>
    );
}
