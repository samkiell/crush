'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, selectCommunityStats } from '@/store/slices/communitySlice';
import { Users, MessageCircle, Trophy } from 'lucide-react';

const HeroSection = () => {
    const dispatch = useDispatch();
    const stats = useSelector(selectCommunityStats);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-secondary/10 p-1 mb-8">
            <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-3xl"></div>

            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
                {/* Active Learners */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-white/20 shadow-sm backdrop-blur-md transition-transform hover:scale-[1.02]">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-base-content">{stats.activeUsers || 0}</h3>
                        <p className="text-sm font-medium text-base-content/60">Active Learners</p>
                    </div>
                </div>

                {/* Discussions */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-white/20 shadow-sm backdrop-blur-md transition-transform hover:scale-[1.02]">
                    <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-base-content">{stats.discussions || 0}</h3>
                        <p className="text-sm font-medium text-base-content/60">Discussions</p>
                    </div>
                </div>

                {/* Top Mentors */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-white/20 shadow-sm backdrop-blur-md transition-transform hover:scale-[1.02]">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-base-content">{stats.topContributors?.length || 0}</h3>
                        <p className="text-sm font-medium text-base-content/60">Top Mentors</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
