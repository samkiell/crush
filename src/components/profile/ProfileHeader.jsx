import { motion } from 'framer-motion';
import { MapPin, Calendar, Edit, Link as LinkIcon, Settings } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ProfileHeader({ user, isOwnProfile, onEdit }) {
    if (!user) return null;

    return (
        <div className="relative mb-8">
            {/* Cover Image (Optional placeholder for now) */}
            <div className="h-48 w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-90"></div>

            <div className="px-6 pb-6">
                <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-32 h-32 rounded-full border-4 border-base-100 bg-base-200 overflow-hidden shadow-lg">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* User Info */}
                    <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content">{user.name}</h1>
                                <p className="text-base-content/60 font-medium">@{user.username}</p>
                            </div>

                            {isOwnProfile && (
                                <div className="flex gap-2">
                                    <Link href="/settings" className="btn btn-ghost btn-sm btn-circle">
                                        <Settings size={20} />
                                    </Link>
                                    <button
                                        onClick={onEdit}
                                        className="btn btn-primary btn-sm gap-2"
                                    >
                                        <Edit size={16} />
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio & Details */}
                <div className="space-y-4">
                    {user.bio && (
                        <p className="text-base-content/80 max-w-2xl text-lg leading-relaxed">
                            {user.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
                        </div>
                        {/* Add more details here if available, e.g. Location, Website */}
                    </div>
                </div>
            </div>
        </div>
    );
}
