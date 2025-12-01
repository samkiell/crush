'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, BookOpen, Brain, Award, Trophy, Zap, BarChart3, Star } from 'lucide-react';
                            <span className="text-2xl mb-1">{badge.icon}</span>
                            <span className="text-xs font-medium text-center">{badge.name}</span>
                        </div >
                    ))}
                </div >
            </CollapseSection >

    {/* Leaderboard */ }
    < CollapseSection title = "Leaderboard" icon = { Trophy } >
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
            </CollapseSection >

    {/* Daily Challenge */ }
    < CollapseSection title = "Daily Challenge" icon = { Star } >
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
            </CollapseSection >

        </motion.div >
    );
}
