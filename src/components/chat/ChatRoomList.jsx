'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Users, Hash, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SUBJECTS = [
    'General', 'Mathematics', 'English', 'Physics', 'Chemistry',
    'Biology', 'Commerce', 'Economics', 'Government', 'Literature'
];

const ROOM_TYPES = [
    { value: null, label: 'All Rooms' },
    { value: 'public', label: 'Public' },
    { value: 'study-group', label: 'Study Groups' },
    { value: 'subject', label: 'Subject Rooms' },
];

export default function ChatRoomList({
    rooms,
    activeRoom,
    onRoomSelect,
    filter,
    onFilterChange,
    loading,
}) {
    const { user } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getRoomIcon = (type) => {
        switch (type) {
            case 'study-group':
                return <Users className="w-5 h-5" />;
            case 'subject':
                return <Hash className="w-5 h-5" />;
            default:
                return <Hash className="w-5 h-5" />;
        }
    };

    const getSubjectColor = (subject) => {
        const colors = {
            Mathematics: 'badge-primary',
            English: 'badge-secondary',
            Physics: 'badge-accent',
            Chemistry: 'badge-info',
            Biology: 'badge-success',
            General: 'badge-neutral',
        };
        return colors[subject] || 'badge-neutral';
    };

    return (
        <div className="h-full flex flex-col bg-base-200 rounded-2xl overflow-hidden">
            {/* Search & Filters */}
            <div className="p-4 space-y-3 border-b border-base-300">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-bordered w-full"
                />

                {/* Type Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {ROOM_TYPES.map((type) => (
                        <button
                            key={type.value || 'all'}
                            onClick={() => onFilterChange({ ...filter, type: type.value })}
                            className={`btn btn-sm flex-shrink-0 ${filter.type === type.value ? 'btn-primary' : 'btn-ghost'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Subject Filter */}
                <select
                    value={filter.subject || ''}
                    onChange={(e) => onFilterChange({ ...filter, subject: e.target.value || null })}
                    className="select select-bordered w-full"
                >
                    <option value="">All Subjects</option>
                    {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                            {subject}
                        </option>
                    ))}
                </select>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton h-20 w-full"></div>
                        ))}
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-base-content/60">No rooms found</p>
                        <p className="text-sm text-base-content/40 mt-1">
                            Try adjusting your filters or create a new room
                        </p>
                    </div>
                ) : (
                    <div className="p-2 space-y-2">
                        {filteredRooms.map((room) => {
                            const isActive = activeRoom?._id === room._id;
                            const isMember = room.members?.some(
                                (member) => member._id === user?.id || member === user?.id
                            );

                            return (
                                <button
                                    key={room._id}
                                    onClick={() => onRoomSelect(room)}
                                    className={`w-full text-left p-3 rounded-xl transition-all ${isActive
                                            ? 'bg-primary text-primary-content shadow-lg scale-[1.02]'
                                            : 'bg-base-100 hover:bg-base-100/80 hover:shadow-md hover:scale-[1.01]'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-content/20' : 'bg-base-200'
                                            }`}>
                                            {getRoomIcon(room.type)}
                                        </div>

                                        {/* Room Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold truncate">{room.name}</h3>
                                                {room.lastMessage?.timestamp && (
                                                    <span className={`text-xs flex-shrink-0 ${isActive ? 'opacity-80' : 'text-base-content/60'
                                                        }`}>
                                                        {formatDistanceToNow(new Date(room.lastMessage.timestamp), {
                                                            addSuffix: false,
                                                        }).replace('about ', '')}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Subject Badge */}
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`badge badge-sm ${isActive ? 'badge-outline' : getSubjectColor(room.subject)
                                                    }`}>
                                                    {room.subject}
                                                </span>
                                                <span className={`text-xs flex items-center gap-1 ${isActive ? 'opacity-80' : 'text-base-content/60'
                                                    }`}>
                                                    <Users className="w-3 h-3" />
                                                    {room.memberCount || room.members?.length || 0}
                                                </span>
                                            </div>

                                            {/* Last Message */}
                                            {room.lastMessage?.content && (
                                                <p className={`text-sm mt-1 truncate ${isActive ? 'opacity-90' : 'text-base-content/70'
                                                    }`}>
                                                    {room.lastMessage.sender?.username}: {room.lastMessage.content}
                                                </p>
                                            )}
                                        </div>

                                        {/* Chevron */}
                                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`} />
                                    </div>

                                    {/* Member Badge */}
                                    {isMember && (
                                        <div className="mt-2">
                                            <span className={`text-xs ${isActive ? 'opacity-80' : 'text-success'
                                                }`}>
                                                ✓ Member
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
