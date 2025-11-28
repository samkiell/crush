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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Active Learners */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm shadow-black/5 hover:shadow-lg hover:shadow-black/10 transition-all hover:scale-[1.02]">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-base-content">{stats.activeUsers || 0}</h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Learners</p>
                </div>
            </div>

            {/* Discussions */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm shadow-black/5 hover:shadow-lg hover:shadow-black/10 transition-all hover:scale-[1.02]">
                <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                    <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-base-content">{stats.discussions || 0}</h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Discussions</p>
                </div>
            </div>

            {/* Top Mentors */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm shadow-black/5 hover:shadow-lg hover:shadow-black/10 transition-all hover:scale-[1.02]">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    <Trophy className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-base-content">{stats.topContributors?.length || 0}</h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Mentors</p>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
