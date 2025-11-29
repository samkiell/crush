'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchMessages,
    sendMessage,
    joinChatRoom,
    leaveChatRoom,
} from '@/store/slices/chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Users, Settings, LogOut, UserPlus, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatWindow({ room }) {
    const dispatch = useDispatch();
    const { messages, loading } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [showRoomInfo, setShowRoomInfo] = useState(false);

    const roomMessages = messages[room._id] || [];
    const isMember = room.members?.some(
        (member) => (member._id || member) === user?.id
    );

    useEffect(() => {
        if (room._id && isMember) {
            // Fetch messages when room changes
            dispatch(fetchMessages({ roomId: room._id }));
        }
    }, [room._id, isMember, dispatch]);

    const handleSendMessage = async (content, replyTo = null) => {
        try {
            await dispatch(sendMessage({
                roomId: room._id,
                content,
                type: 'text',
                replyTo,
            })).unwrap();
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleJoinRoom = async () => {
        try {
            await dispatch(joinChatRoom(room._id)).unwrap();
            toast.success('Joined room successfully!');
        } catch (error) {
            toast.error(error || 'Failed to join room');
        }
    };

    const handleLeaveRoom = async () => {
        if (!confirm('Are you sure you want to leave this room?')) return;

        try {
            await dispatch(leaveChatRoom(room._id)).unwrap();
            toast.success('Left room successfully');
        } catch (error) {
            toast.error(error || 'Failed to leave room');
        }
    };

    if (!isMember) {
        return (
            <div className="h-full flex items-center justify-center bg-base-200 rounded-2xl">
                <div className="text-center max-w-md p-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserPlus className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-2">
                        {room.name}
                    </h3>
                    <p className="text-base-content/60 mb-1">{room.description}</p>
                    <div className="flex justify-center gap-2 mt-4 mb-6">
                        <span className="badge badge-primary">{room.subject}</span>
                        <span className="badge badge-ghost">
                            <Users className="w-3 h-3 mr-1" />
                            {room.memberCount || room.members?.length || 0} members
                        </span>
                    </div>
                    <button onClick={handleJoinRoom} className="btn btn-primary btn-lg gap-2">
                        <UserPlus className="w-5 h-5" />
                        Join Room
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-base-200 rounded-2xl overflow-hidden">
            {/* Room Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-base-content">{room.name}</h2>
                        <p className="text-sm text-base-content/60">
                            {room.memberCount || room.members?.length || 0} members
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowRoomInfo(!showRoomInfo)}
                        className="btn btn-ghost btn-sm btn-circle"
                        title="Room Info"
                    >
                        <Info className="w-5 h-5" />
                    </button>

                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                            <Settings className="w-5 h-5" />
                        </label>
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2"
                        >
                            <li>
                                <button onClick={handleLeaveRoom} className="text-error">
                                    <LogOut className="w-4 h-4" />
                                    Leave Room
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Room Info Panel (Collapsible) */}
            {showRoomInfo && (
                <div className="p-4 bg-base-100 border-b border-base-300">
                    <div className="space-y-2">
                        <p className="text-sm text-base-content/70">{room.description}</p>
                        <div className="flex gap-2">
                            <span className="badge badge-primary">{room.subject}</span>
                            <span className="badge badge-ghost">{room.type}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
                <MessageList messages={roomMessages} loading={loading} roomId={room._id} />
            </div>

            {/* Message Input */}
            <div className="border-t border-base-300 bg-base-100">
                <MessageInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}
