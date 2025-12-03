'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Play, BookOpen, Users, ArrowRight, Wallet, Plus, HelpCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { stagger, variants } from '@/lib/motionConfig';

export default function MomentumLayer({ user, stats }) {
    const firstName = user?.name?.split(' ')[0] || 'Scholar';

    const [quote, setQuote] = useState('Ready to crush your goals today? 🚀');
    const [activeSession, setActiveSession] = useState(null);

    useEffect(() => {
        // Load active session from localStorage
        const savedSession = localStorage.getItem('last_active_session');
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                // Optional: Check if session is too old (e.g., > 24 hours)
                const ONE_DAY = 24 * 60 * 60 * 1000;
                if (Date.now() - parsed.timestamp < ONE_DAY) {
                    setActiveSession(parsed);
                }
            } catch (e) {
                console.error('Failed to parse active session', e);
            }
        }

        const quotes = [
            "Crush your limits, one question at a time! 🚀",
            "Did you know? The brain is like a muscle—the more you use it, the stronger it gets. 💪",
            "What’s one new thing you’ll master today?",
            "Success is the sum of small efforts, repeated day in and day out.",
            "Don't just study hard, study smart with CrushEdu.",
            "Your only limit is your mind. Crush it!",
            "Fact: Spaced repetition is the most effective way to learn. 🧠",
            "Are you ready to turn your dreams into reality?",
            "Every pro was once a beginner. Keep going!",
            "Consistency is key. You're doing great!",
            "Believe you can and you're halfway there.",
            "Crush the exam, own your future.",
            "Did you know? Teaching someone else is the best way to learn.",
            "What if you gave it 100% today?",
            "The future belongs to those who prepare for it today.",
            "Stay focused, stay hungry, stay Crushing.",
            "Mistakes are proof that you are trying.",
            "Fact: Taking breaks actually helps memory retention. ⏸️",
            "You are capable of more than you know.",
            "Make today count!",
            "Don't watch the clock; do what it does. Keep going.",
            "CrushEdu is here to fuel your journey.",
            "Success doesn't come to you, you go to it.",
            "Did you know? Hydration boosts brain function. Drink up! 💧",
            "What’s your goal for this session?",
            "Dream big, study hard, Crush everything.",
            "The secret of getting ahead is getting started.",
            "Your potential is endless.",
            "Fact: Writing things down helps you remember them better. ✍️",
            "Be stronger than your excuses.",
            "You’re building your future, one answer at a time.",
            "Crush the doubt, unleash the scholar.",
            "It always seems impossible until it's done.",
            "Did you know? Classical music can improve concentration. 🎵",
            "Who are you doing this for? Keep them in mind.",
            "Strive for progress, not perfection.",
            "The best way to predict the future is to create it.",
            "You have what it takes to Crush this exam!",
            "Fact: Sleep is crucial for memory consolidation. 😴",
            "Don't stop until you're proud.",
            "Every study session brings you closer to victory.",
            "Crush your fears with preparation.",
            "Did you know? Visualizing success improves performance. 👁️",
            "What’s the one topic you want to conquer today?",
            "Discipline is choosing between what you want now and what you want most.",
            "You are a force to be reckoned with.",
            "Keep calm and Crush on.",
            "Fact: A positive mindset increases problem-solving ability. 😊",
            "Your hard work will pay off. Believe it.",
            "Let's make history today. Ready to Crush it?"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    // Calculate days until JAMB (Main Exam: April 25, 2026)
    const examDate = new Date('2026-04-25');
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    const quickActions = [
        { label: 'Start Test', icon: Play, href: '/cbt', color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Study Mode', icon: BookOpen, href: '/study', color: 'text-secondary', bg: 'bg-secondary/10' },
        { label: 'Community', icon: Users, href: '/community', color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Coming Soon', icon: HelpCircle, href: '#', color: 'text-info', bg: 'bg-info/10' },
    ];

    return (
        <motion.div
            className="space-y-6"
            variants={stagger.container(0.1)}
            initial="initial"
            animate="animate"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 1. Wallet Balance & Greeting */}
                <motion.div
                    variants={variants.scale}
                    className="md:col-span-4 bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between gap-4"
                >
                    {/* Greeting */}
                    <div>
                        <h1 className="text-lg font-bold text-primary">
                            {(() => {
                                const hour = new Date().getHours();
                                if (hour < 12) return 'Good Morning';
                                if (hour < 18) return 'Good Afternoon';
                                if (hour < 22) return 'Good Evening';
                                return 'Good Night';
                            })()}, {firstName}
                        </h1>
                        <p className="text-xs text-base-content/70 font-medium">
                            {quote}
                        </p>
                    </div>

                    {/* Balance */}
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <p className="text-xs text-base-content/60 font-medium mb-1">Wallet Balance</p>
                            <h3 className="text-2xl font-bold text-base-content">₦{user?.balance?.toLocaleString() || '2,300'}</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>

                    <button className="btn btn-primary w-full gap-2 rounded-xl flex items-center justify-center">
                        <Plus className="w-4 h-4" /> Top Up Wallet
                    </button>
                </motion.div>

                {/* 2. JAMB Countdown */}
                <motion.div
                    variants={variants.scale}
                    className="md:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-content p-6 shadow-xl flex flex-col justify-between min-h-[180px]"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Calendar className="w-40 h-40" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-lg font-semibold opacity-90">JAMB Countdown</h2>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-5xl font-bold font-display">{daysRemaining}</span>
                            <span className="text-xl opacity-80">days left 🔥</span>
                        </div>
                    </div>

                    <div className="relative z-10 mt-4">
                        <div className="w-full bg-black/20 h-2 rounded-full mb-2">
                            <div
                                className="bg-cyan-300 h-2 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(103,232,249,0.8),0_0_30px_rgba(103,232,249,0.4)]"
                                style={{ width: `${Math.max(0, Math.min(100, 100 - (daysRemaining / 365) * 100))}%` }}
                            />
                        </div>
                        <p className="text-sm opacity-80">Main Exam: April 25 - May 5, 2026</p>
                    </div>
                </motion.div>

                {/* 3. Quick Actions (Hidden for Admin) */}
                {user?.role !== 'admin' && (
                    <motion.div
                        variants={stagger.container(0.05)}
                        className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
                    >
                        {quickActions.map((action) => (
                            <Link key={action.label} href={action.href} className="block h-full">
                                <motion.div
                                    variants={variants.fadeUp}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full"
                                >
                                    <div className={`p-3 rounded-xl ${action.bg} ${action.color} mb-2`}>
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-semibold text-base-content/80 text-center">{action.label}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                )}

                {/* 4. Streak & Resume (Hidden for Admin) */}
                {user?.role !== 'admin' && (
                    <div className="md:col-span-4 flex flex-col gap-4">
                        {/* Resume Session Card */}
                        {activeSession && (
                            <Link href={activeSession.href} className="block group">
                                <motion.div
                                    variants={variants.scale}
                                    className="bg-base-100 border-2 border-primary/20 rounded-3xl p-5 shadow-xl hover:border-primary transition-all relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <RotateCcw className="w-24 h-24 rotate-12" />
                                    </div>

                                    <div className="flex items-center justify-between mb-3 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary shadow-sm">
                                                <RotateCcw className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Resume Session</span>
                                        </div>
                                        <div className="bg-base-200 rounded-full p-1 shadow-sm group-hover:scale-110 transition-transform">
                                            <ArrowRight className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg text-base-content line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                            {activeSession.title}
                                        </h3>
                                        <p className="text-xs text-base-content/60 mb-4 font-medium">{activeSession.type}</p>
                                        
                                        <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden border border-base-300">
                                            <div 
                                                className="bg-primary h-full rounded-full shadow-sm" 
                                                style={{ width: `${activeSession.progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wide">Progress</span>
                                            <span className="text-[10px] font-bold text-primary">{activeSession.progress}% Completed</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )}

                        {/* Streak Card */}
                        <motion.div
                            variants={variants.scale}
                            className="flex-1 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-3xl p-6 flex flex-col justify-center shadow-sm relative overflow-hidden min-h-[140px]"
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-sm text-base-content/60 font-medium mb-1">Daily Streak</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-orange-600">{stats?.streak || 0}</span>
                                        <span className="text-sm text-orange-600/80">days</span>
                                    </div>
                                    <p className="text-xs text-base-content/50 mt-1">You're on fire! 🔥</p>
                                </div>
                                <div className="relative">
                                    <div className="p-4 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-500/30">
                                        <Flame className="w-8 h-8 fill-current" />
                                    </div>
                                    <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
