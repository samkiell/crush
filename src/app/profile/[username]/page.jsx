'use client';

import { useState, useEffect, use } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, AlertCircle } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileFeed from '@/components/profile/ProfileFeed';
import EditProfileModal from '@/components/profile/EditProfileModal';
import PostCard from '@/components/community/PostCard';

export default function ProfilePage({ params }) {
    const { username } = use(params);
    const router = useRouter();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const isOwnProfile = currentUser?.username === username;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/users/${username}`);
                setProfileData(response.data.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username, isEditModalOpen]); // Refetch when edit modal closes to update data

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
                <AlertCircle className="text-error mb-4" size={48} />
                <h1 className="text-2xl font-bold text-base-content mb-2">Profile Not Found</h1>
                <p className="text-base-content/60 mb-6">{error}</p>
                <button onClick={() => router.back()} className="btn btn-primary">
                    Go Back
                </button>
            </div>
        );
    }

    const { user, stats } = profileData;

    return (
        <div className="min-h-screen bg-base-200 pb-20">
            <div className="max-w-5xl mx-auto pt-6 px-4">

                <ProfileHeader
                    user={user}
                    isOwnProfile={isOwnProfile}
                    onEdit={() => setIsEditModalOpen(true)}
                />

                <ProfileStats stats={stats} />

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-base-300 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'posts'
                                ? 'text-primary'
                                : 'text-base-content/60 hover:text-base-content'
                            }`}
                    >
                        Posts
                        {activeTab === 'posts' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('highlights')}
                        className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'highlights'
                                ? 'text-primary'
                                : 'text-base-content/60 hover:text-base-content'
                            }`}
                    >
                        Study Highlights
                        {activeTab === 'highlights' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('bookmarks')}
                        className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'bookmarks'
                                ? 'text-primary'
                                : 'text-base-content/60 hover:text-base-content'
                            }`}
                    >
                        Bookmarks
                        {activeTab === 'bookmarks' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'posts' && (
                        <ProfileFeed username={username} />
                    )}

                    {activeTab === 'highlights' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                                <h3 className="text-lg font-bold mb-4">Top Subjects</h3>
                                <div className="space-y-4">
                                    {stats.topSubjects?.map((subject, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">{subject.name}</span>
                                                <span className="font-bold">{subject.score}%</span>
                                            </div>
                                            <div className="w-full bg-base-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${subject.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {(!stats.topSubjects || stats.topSubjects.length === 0) && (
                                        <p className="text-base-content/60 text-sm">No exam data available yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                                <h3 className="text-lg font-bold mb-4">Achievements</h3>
                                <div className="flex flex-wrap gap-3">
                                    {user.badges?.map((badge, index) => (
                                        <span key={index} className="badge badge-primary badge-lg py-4">
                                            {badge}
                                        </span>
                                    ))}
                                    {(!user.badges || user.badges.length === 0) && (
                                        <p className="text-base-content/60 text-sm">No badges earned yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookmarks' && (
                        <div className="space-y-6">
                            {user.bookmarks && user.bookmarks.length > 0 ? (
                                user.bookmarks.map((post) => (
                                    <PostCard key={post._id} post={{ ...post, author: { name: 'Unknown', avatar: '' } }} />
                                    // Note: Bookmarks population in API might need to populate author too for full card details.
                                    // For now, passing basic post. 
                                ))
                            ) : (
                                <div className="text-center py-12 text-base-content/60">
                                    <p className="text-lg">No bookmarks yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />
        </div>
    );
}
