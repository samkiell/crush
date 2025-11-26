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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="card bg-primary text-primary-content shadow-lg">
                <div className="card-body p-4 sm:p-6 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="card-title text-2xl sm:text-3xl font-bold">{stats.activeUsers || 0}</h2>
                        <p className="text-sm sm:text-base text-primary-content/80">Active Learners</p>
                    </div>
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 opacity-50" />
                </div>
            </div>

            <div className="card bg-secondary text-secondary-content shadow-lg">
                <div className="card-body p-4 sm:p-6 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="card-title text-2xl sm:text-3xl font-bold">{stats.discussions || 0}</h2>
                        <p className="text-sm sm:text-base text-secondary-content/80">Discussions</p>
                    </div>
                    <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 opacity-50" />
                </div>
            </div>

            <div className="card bg-accent text-accent-content shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="card-body p-4 sm:p-6 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="card-title text-2xl sm:text-3xl font-bold">{stats.topContributors?.length || 0}</h2>
                        <p className="text-sm sm:text-base text-accent-content/80">Top Mentors</p>
                    </div>
                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 opacity-50" />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
