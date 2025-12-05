'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
    fetchMessages,
    sendMessage,
    joinChatRoom,
    leaveChatRoom
} from '@/store/slices/chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Users, Settings, LogOut, UserPlus, Info, ArrowLeft, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '@/hooks/useSocket';

export default function ChatWindow({ room, onBack }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { messages, loading, typingUsers } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [showRoomInfo, setShowRoomInfo] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Initialize socket connection
    const socket = useSocket();

    const roomMessages = messages[room._id] || [];
    const roomTypingUsers = typingUsers[room._id] || [];

    const isMember = Array.isArray(room.members) && room.members.some(
        (member) => member && ((member._id || member) === (user?._id || user?.id))
    );

    useEffect(() => {
        if (room._id && isMember) {
            dispatch(fetchMessages({ roomId: room._id }));
        }
    }, [room._id, isMember, dispatch]);

    // Handle room join/leave events
    useEffect(() => {
        if (socket && room._id && user) {
            socket.emit('room:join', { roomId: room._id, userId: user.id || user._id });
            
            return () => {
                socket.emit('room:leave', { roomId: room._id });
            };
        }
    }, [socket, room._id, user]);

    // Handle outside click for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = async (content) => {
        const tempId = Date.now().toString();
        const optimisticMessage = {
            _id: tempId,
            content,
            sender: user,
            room: room._id,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        try {
            dispatch(addMessageOptimistic({ roomId: room._id, message: optimisticMessage }));
            
            await dispatch(sendMessage({
                roomId: room._id,
                content,
                type: 'text',
                tempId, // Pass tempId for reconciliation
            })).unwrap();
        } catch (error) {
            toast.error('Failed to send message');
            // Optionally remove optimistic message on error
        }
    };

    const handleJoinRoom = async () => {
        try {
            await dispatch(joinChatRoom(room._id)).unwrap();
            toast.success('Joined room successfully!');
            // Redirect to chat page
            router.push('/chat');
        } catch (error) {
            toast.error(error || 'Failed to join room');
        }
    };

    const handleLeaveRoom = async () => {
        if (!confirm('Are you sure you want to leave this room?')) return;

        try {
            await dispatch(leaveChatRoom(room._id)).unwrap();
            if (onBack) onBack();
            toast.success('Left room successfully');
        } catch (error) {
            toast.error(error || 'Failed to leave room');
        }
    };

    if (!isMember) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-base-100 p-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
                <p className="text-base-content/60 max-w-xs mb-8">{room.description}</p>

                <button onClick={handleJoinRoom} className="btn btn-primary btn-lg w-full max-w-xs gap-2 rounded-2xl flex items-center justify-center">
                    <UserPlus size={20} />
                    Join to Chat
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-base-100 relative">
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-base-200 bg-base-100/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="btn btn-ghost btn-sm btn-circle md:hidden">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-base leading-tight">{room.name}</h3>
                        <span className="text-xs text-base-content/50">
                            {room.memberCount || room.members?.length || 0} members
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowRoomInfo(!showRoomInfo)}
                        className={`btn btn-ghost btn-sm btn-circle ${showRoomInfo ? 'text-primary bg-primary/10' : ''}`}
                    >
                        <Info size={20} />
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className={`btn btn-ghost btn-sm btn-circle ${showDropdown ? 'bg-base-200' : ''}`}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showDropdown && (
                            <ul className="absolute right-0 top-full mt-2 z-[20] menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-200">
                                <li>
                                    <button onClick={handleLeaveRoom} className="text-error">
                                        <LogOut size={16} />
                                        Leave Room
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Room Info Overlay */}
            {showRoomInfo && (
                <div className="absolute top-[60px] left-0 right-0 bg-base-100/95 backdrop-blur-sm border-b border-base-200 p-4 z-20 animate-in slide-in-from-top-2">
                    <p className="text-sm text-base-content/80 mb-3">{room.description}</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="badge badge-primary badge-outline">{room.subject}</span>
                        <span className="badge badge-ghost">{room.type}</span>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <MessageList
                messages={roomMessages}
                loading={loading}
                roomId={room._id}
                typingUsers={roomTypingUsers}
            />

            {/* Input Area */}
            <MessageInput
                roomId={room._id}
                onSendMessage={handleSendMessage}
                socket={socket}
                user={user}
            />
            
            {/* Spacer for Bottom Nav on Mobile */}
            <div className="h-20 md:hidden flex-shrink-0" />
        </div>
    );
}
