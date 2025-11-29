'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editMessage, deleteMessage, reactToMessage } from '@/store/slices/chatSlice';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Reply, Edit2, Trash2, Smile } from 'lucide-react';
import toast from 'react-hot-toast';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '🎉', '🔥'];

function MessageItem({ message, onReply }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const isOwnMessage = message.sender?._id === user?.id;
    const isDeleted = message.isDeleted;

    const handleEdit = async () => {
        if (!editContent.trim()) return;

        try {
            await dispatch(editMessage({
                messageId: message._id,
                content: editContent,
            })).unwrap();
            setIsEditing(false);
            toast.success('Message updated');
        } catch (error) {
            toast.error('Failed to edit message');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this message?')) return;

        try {
            await dispatch(deleteMessage(message._id)).unwrap();
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const handleReaction = async (emoji) => {
        try {
            await dispatch(reactToMessage({
                messageId: message._id,
                emoji,
            })).unwrap();
            setShowEmojiPicker(false);
        } catch (error) {
            toast.error('Failed to add reaction');
        }
    };

    // Group reactions by emoji
    const groupedReactions = message.reactions?.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction.user);
        return acc;
    }, {});

    return (
        <div className={`flex gap-3 p-3 hover:bg-base-300/50 rounded-lg group ${isOwnMessage ? 'flex-row-reverse' : ''
            }`}>
            {/* Avatar */}
            <div className="avatar placeholder flex-shrink-0">
                <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                    <span className="text-sm">
                        {message.sender?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </div>
            </div>

            {/* Message Content */}
            <div className={`flex-1 min-w-0 ${isOwnMessage ? 'text-right' : ''}`}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-base-content">
                        {message.sender?.username || 'Unknown User'}
                    </span>
                    <span className="text-xs text-base-content/50">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                    {message.isEdited && (
                        <span className="text-xs text-base-content/40 italic">(edited)</span>
                    )}
                </div>

                {/* Reply Reference */}
                {message.replyTo && (
                    <div className="mb-2 p-2 bg-base-300/50 rounded border-l-2 border-primary text-sm">
                        <span className="text-base-content/60">
                            {message.replyTo.content}
                        </span>
                    </div>
                )}

                {/* Message Body */}
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleEdit} className="btn btn-primary btn-sm">
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(message.content);
                                }}
                                className="btn btn-ghost btn-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`inline-block p-3 rounded-2xl ${isOwnMessage
                            ? 'bg-primary text-primary-content'
                            : 'bg-base-100'
                        } ${isDeleted ? 'italic opacity-60' : ''}`}>
                        <p className="text-sm break-words">{message.content}</p>
                    </div>
                )}

                {/* Reactions */}
                {groupedReactions && Object.keys(groupedReactions).length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                        {Object.entries(groupedReactions).map(([emoji, users]) => (
                            <button
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all ${users.some(u => (u._id || u) === user?.id)
                                        ? 'bg-primary/20 border border-primary'
                                        : 'bg-base-200 hover:bg-base-300'
                                    }`}
                            >
                                <span>{emoji}</span>
                                <span className="text-xs">{users.length}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Actions (on hover) */}
                {!isDeleted && (
                    <div className={`mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isOwnMessage ? 'justify-end' : ''
                        }`}>
                        {/* Emoji Reaction */}
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="btn btn-ghost btn-xs"
                                title="Add reaction"
                            >
                                <Smile className="w-4 h-4" />
                            </button>

                            {showEmojiPicker && (
                                <div className="absolute bottom-full mb-2 bg-base-100 shadow-xl rounded-lg p-2 flex gap-1 z-10">
                                    {EMOJI_REACTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleReaction(emoji)}
                                            className="hover:scale-125 transition-transform text-lg p-1"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reply */}
                        <button
                            onClick={() => onReply(message)}
                            className="btn btn-ghost btn-xs"
                            title="Reply"
                        >
                            <Reply className="w-4 h-4" />
                        </button>

                        {/* Edit/Delete (own messages only) */}
                        {isOwnMessage && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-ghost btn-xs"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-ghost btn-xs text-error"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MessageList({ messages, loading, roomId }) {
    const messagesEndRef = useRef(null);
    const [replyingTo, setReplyingTo] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleReply = (message) => {
        setReplyingTo(message);
        // You can emit this to parent or handle it in MessageInput
    };

    if (loading && messages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                    <p className="text-base-content/60 mb-2">No messages yet</p>
                    <p className="text-sm text-base-content/40">
                        Be the first to start the conversation!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4 space-y-1">
            {messages.map((message) => (
                <MessageItem
                    key={message._id}
                    message={message}
                    onReply={handleReply}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
