'use client';

import { Trophy, Award, Flame, Medal, Users, Star } from 'lucide-react';

export default function GamificationHub({ stats, user }) {
    // Mock gamification data
    const badges = [
        {
            id: 1,
            name: 'Speed Demon',
            description: 'Completed 50 questions in under 30 minutes',
            icon: '⚡',
            unlocked: true,
            unlockedDate: '2 hours ago',
        },
        {
            id: 2,
            name: 'Week Warrior',
            description: 'Maintained 7-day study streak',
            icon: '🔥',
            unlocked: true,
            unlockedDate: '3 days ago',
        },
        {
            id: 3,
            name: 'Perfect Score',
            description: 'Score 100% on any practice exam',
            icon: '💯',
            unlocked: false,
            progress: 75,
            requirement: '75% → 100%',
        },
        {
            id: 4,
            name: 'Consistent Scholar',
            description: 'Reach 15-day streak',
            icon: '📚',
            unlocked: false,
            progress: 80,
            requirement: '12 → 15 days',
        },
    ];

    const leaderboard = [
        { rank: 1, name: 'AdewaleJAMB', school: 'OAU Prep', points: 2845, avatar: 'A' },
        { rank: 2, name: 'ChiomaStudies', school: 'UNILAG Prep', points: 2720, avatar: 'C' },
        { rank: 3, name: 'TundeAce', school: 'UI Prep', points: 2650, avatar: 'T' },
        { rank: 4, name: 'FemiScholar', school: 'LASU Prep', points: 2580, avatar: 'F' },
        { rank: 5, name: 'You', school: 'Classora', points: 2520, avatar: user?.username?.charAt(0).toUpperCase() || 'U', isCurrentUser: true },
    ];

    const getMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="space-y-6">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border-2 border-orange-500/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                        <div>
                            <h3 className="text-2xl font-bold text-base-content">12 Days</h3>
                            <p className="text-sm text-base-content/60">Current Streak</p>
                        </div>
                    </div>
                    <Trophy className="w-10 h-10 text-orange-500/30" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">Next milestone</span>
                        <span className="font-semibold text-orange-500">15 days</span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full h-2 transition-all duration-500"
                            style={{ width: '80%' }}
                        ></div>
                    </div>
                    <p className="text-xs text-base-content/60 text-center mt-2">
                        🏆 Unlock "Consistent Scholar" badge in 3 days!
                    </p>
                </div>
            </div>

            {/* Badges Showcase */}
            <div className="bg-base-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-bold text-base-content">Achievements</h3>
                    </div>
                    <button className="btn btn-ghost btn-xs">View All</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`p-4 rounded-xl border-2 transition-all ${badge.unlocked
                                    ? 'bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 hover:shadow-lg'
                                    : 'bg-base-100 border-base-300 opacity-60'
                                }`}
                        >
                            <div className="text-center">
                                <div className={`text-4xl mb-2 ${!badge.unlocked && 'grayscale'}`}>
                                    {badge.icon}
                                </div>
                                <h4 className="font-semibold text-sm text-base-content mb-1">
                                    {badge.name}
                                </h4>
                                <p className="text-xs text-base-content/60 mb-2">
                                    {badge.description}
                                </p>

                                {badge.unlocked ? (
                                    <p className="text-xs text-success">✓ Unlocked {badge.unlockedDate}</p>
                                ) : (
                                    <div>
                                        <div className="w-full bg-base-300 rounded-full h-1.5 mb-1">
                                            <div
                                                className="bg-primary rounded-full h-1.5"
                                                style={{ width: `${badge.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-base-content/50">{badge.requirement}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-base-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-base-content">Leaderboard</h3>
                    </div>
                    <div className="flex gap-1">
                        <button className="btn btn-xs btn-primary">Friends</button>
                        <button className="btn btn-xs btn-ghost">School</button>
                        <button className="btn btn-xs btn-ghost">Nigeria</button>
                    </div>
                </div>

                <div className="space-y-2">
                    {leaderboard.map((user) => (
                        <div
                            key={user.rank}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${user.isCurrentUser
                                    ? 'bg-primary/10 border-2 border-primary/30 shadow-lg'
                                    : 'bg-base-100 hover:bg-base-100/80'
                                }`}
                        >
                            {/* Rank */}
                            <div className={`text-2xl font-bold w-10 text-center ${user.rank <= 3 ? '' : 'text-base-content/60'
                                }`}>
                                {getMedal(user.rank)}
                            </div>

                            {/* Avatar */}
                            <div className={`avatar placeholder ${user.isCurrentUser ? 'ring ring-primary ring-offset-base-100 ring-offset-2' : ''}`}>
                                <div className="bg-primary text-primary-content rounded-full w-10">
                                    <span className="text-sm font-semibold">{user.avatar}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm truncate ${user.isCurrentUser ? 'text-primary' : 'text-base-content'
                                    }`}>
                                    {user.name}
                                </p>
                                <p className="text-xs text-base-content/60 truncate">{user.school}</p>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <p className="font-bold text-base-content">{user.points.toLocaleString()}</p>
                                <p className="text-xs text-base-content/60">pts</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-base-100 rounded-lg text-center">
                    <p className="text-sm text-base-content/60">
                        You're <span className="font-bold text-warning">32 points</span> behind rank #4
                    </p>
                    <button className="btn btn-primary btn-sm mt-2">
                        View Full Leaderboard
                    </button>
                </div>
            </div>

            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-primary" />
                    <div>
                        <h3 className="font-bold text-base-content">Daily Challenge</h3>
                        <p className="text-xs text-base-content/60">Complete to earn bonus points</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-base-100/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" defaultChecked />
                            <span className="text-sm">Study 30 minutes</span>
                        </div>
                        <span className="badge badge-success badge-sm">+50 pts</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-100/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                            <span className="text-sm">Complete 20 questions</span>
                        </div>
                        <span className="badge badge-ghost badge-sm">+30 pts</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-base-100/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                            <span className="text-sm">Score 80%+ on a quiz</span>
                        </div>
                        <span className="badge badge-ghost badge-sm">+100 pts</span>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-base-content/60">
                        Resets in <span className="font-bold text-primary">4h 23m</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
