'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Plus, MessageSquarePlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ChatRoomList({
    rooms,
    activeRoom,
    onRoomSelect,
    loading,
    onCreateRoom
}) {
    const { user } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-base-100 border-r border-base-200">
            {/* Header */}
            <div className="p-4 border-b border-base-200 flex items-center justify-between sticky top-0 bg-base-100 z-10">
                <h2 className="text-xl font-bold">Chats</h2>
                <button
                    onClick={onCreateRoom}
                    className="btn btn-sm btn-primary gap-2"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">New Room</span>
                </button>
            </div>

            {/* Search */}
            <div className="px-4 py-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered input-sm w-full pl-9 rounded-full bg-base-200 border-none focus:ring-0"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {loading ? (
                    <div className="p-4 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <div className="skeleton w-12 h-12 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-4 w-1/2"></div>
                                    <div className="skeleton h-3 w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                            <MessageSquarePlus className="w-8 h-8 text-base-content/40" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">No rooms found</h3>
                        <p className="text-base-content/60 text-sm mb-6">
                            {searchQuery ? 'Try a different search term' : 'Get the conversation started!'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={onCreateRoom}
                                className="btn btn-primary"
                            >
                                Create a Room
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-base-200/50">
                        {filteredRooms.map((room) => {
                            const isActive = activeRoom?._id === room._id;

                            return (
                                <button
                                    key={room._id}
                                    onClick={() => onRoomSelect(room)}
                                    className={`w-full p-4 flex items-center gap-3 transition-colors hover:bg-base-200/50 ${isActive ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    {/* Avatar Placeholder */}
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-lg">
                                        {room.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className={`font-semibold truncate ${isActive ? 'text-primary' : ''}`}>
                                                {room.name}
                                            </h3>
                                            {room.lastMessage?.timestamp && (
                                                <span className="text-xs text-base-content/40 flex-shrink-0 ml-2">
                                                    {formatDistanceToNow(new Date(room.lastMessage.timestamp), { addSuffix: false })
                                                        .replace('about ', '')
                                                        .replace('less than a minute', 'now')
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-base-content/60 truncate">
                                            {room.lastMessage?.content ? (
                                                <>
                                                    <span className="font-medium text-base-content/80">
                                                        {room.lastMessage.sender?.name === user?.name ? 'You' : room.lastMessage.sender?.name}:
                                                    </span>{' '}
                                                    {room.lastMessage.content}
                                                </>
                                            ) : (
                                                <span className="italic opacity-50">No messages yet</span>
                                            )}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
