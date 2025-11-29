'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, setActiveRoom, createChatRoom } from '@/store/slices/chatSlice';
import ChatRoomList from '@/components/chat/ChatRoomList';
import ChatWindow from '@/components/chat/ChatWindow';
import CreateRoomModal from '@/components/chat/CreateRoomModal';
import { Plus, MessageCircle } from 'lucide-react';

export default function ChatPage() {
    const dispatch = useDispatch();
    const { rooms, activeRoom, loading } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState({ type: null, subject: null });

    useEffect(() => {
        // Fetch chat rooms on mount
        dispatch(fetchChatRooms({ userId: user?.id }));
    }, [dispatch, user]);

    const handleRoomSelect = (room) => {
        dispatch(setActiveRoom(room));
    };

    const handleCreateRoom = async (roomData) => {
        try {
            await dispatch(createChatRoom(roomData)).unwrap();
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        dispatch(fetchChatRooms({ ...newFilter, userId: user?.id }));
    };

    return (
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-xl border-b border-base-300">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MessageCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-base-content">Study Chat Rooms</h1>
                                <p className="text-sm text-base-content/60">Connect with fellow students</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="btn btn-primary gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
                    {/* Room List Sidebar */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <ChatRoomList
                            rooms={rooms}
                            activeRoom={activeRoom}
                            onRoomSelect={handleRoomSelect}
                            filter={filter}
                            onFilterChange={handleFilterChange}
                            loading={loading}
                        />
                    </div>

                    {/* Chat Window */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        {activeRoom ? (
                            <ChatWindow room={activeRoom} />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-base-200 rounded-2xl">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-base-300 rounded-full flex items-center justify-center">
                                        <MessageCircle className="w-12 h-12 text-base-content/40" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-base-content mb-2">
                                        Select a chat room
                                    </h3>
                                    <p className="text-base-content/60">
                                        Choose a room from the list or create a new one
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Room Modal */}
            {isCreateModalOpen && (
                <CreateRoomModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateRoom}
                />
            )}
        </div>
    );
}
