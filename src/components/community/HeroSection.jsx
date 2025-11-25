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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card bg-primary text-primary-content shadow-lg">
                <div className="card-body p-6 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="card-title text-3xl font-bold">{stats.activeUsers || 0}</h2>
                        <p className="text-primary-content/80">Active Learners</p>
                    </div>
                    <Users className="w-10 h-10 opacity-50" />
                </div>
            </div>

            <div className="card bg-secondary text-secondary-content shadow-lg">
                <div className="card-body p-6 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="card-title text-3xl font-bold">{stats.discussions || 0}</h2>
                        <p className="text-secondary-content/80">Discussions</p>
                    </div>
                    <MessageCircle className="w-10 h-10 opacity-50" />
                </div>
            </div>

            <div className="card bg-accent text-accent-content shadow-lg">
                <div className="card-body p-6 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="card-title text-3xl font-bold">{stats.topContributors?.length || 0}</h2>
                        <p className="text-accent-content/80">Top Mentors</p>
                    </div>
                    <Trophy className="w-10 h-10 opacity-50" />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
