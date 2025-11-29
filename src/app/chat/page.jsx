'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, setActiveRoom, createChatRoom, clearActiveRoom } from '@/store/slices/chatSlice';
import ChatRoomList from '@/components/chat/ChatRoomList';
import ChatWindow from '@/components/chat/ChatWindow';
import CreateRoomModal from '@/components/chat/CreateRoomModal';
import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
    const dispatch = useDispatch();
    const { rooms, activeRoom, loading } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchChatRooms({ userId: user?.id }));
        // Cleanup active room on unmount
        return () => {
            dispatch(clearActiveRoom());
        };
    }, [dispatch, user]);

    const handleRoomSelect = (room) => {
        dispatch(setActiveRoom(room));
    };

    const handleBack = () => {
        dispatch(clearActiveRoom());
    };

    const handleCreateRoom = async (roomData) => {
        try {
            await dispatch(createChatRoom(roomData)).unwrap();
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    return (
        <div className="fixed inset-0 top-[64px] bg-base-100 flex">
            {/* Sidebar / List View */}
            <div className={`
                w-full md:w-[380px] lg:w-[420px] h-full border-r border-base-200 flex-shrink-0 flex flex-col
                ${activeRoom ? 'hidden md:flex' : 'flex'}
            `}>
                <ChatRoomList
                    rooms={rooms}
                    activeRoom={activeRoom}
                    onRoomSelect={handleRoomSelect}
                    loading={loading}
                    onCreateRoom={() => setIsCreateModalOpen(true)}
                />
            </div>

            {/* Main Chat Window */}
            <div className={`
                flex-1 h-full bg-base-100
                ${activeRoom ? 'block' : 'hidden md:flex md:items-center md:justify-center'}
            `}>
                {activeRoom ? (
                    <ChatWindow
                        room={activeRoom}
                        onBack={handleBack}
                    />
                ) : (
                    <div className="hidden md:flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
                            <MessageCircle size={48} className="text-base-content/30" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
                        <p className="mb-6">Choose a room from the left or create a new one.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="btn btn-primary btn-outline"
                        >
                            Create New Room
                        </button>
                    </div>
                )}
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
