'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
                )}

<div
    className={`
                        px-4 py-2 rounded-2xl text-[15px] leading-relaxed break-words relative
                        ${isOwn
            ? 'bg-primary text-primary-content rounded-tr-sm'
            : 'bg-base-200 text-base-content rounded-tl-sm'
        }
                    `}
>
    {message.content}

    <div className={`
                        text-[10px] flex items-center justify-end gap-1 mt-1 opacity-70
                        ${isOwn ? 'text-primary-content/80' : 'text-base-content/50'}
                    `}>
        {format(new Date(message.createdAt), 'HH:mm')}
        {isOwn && (
            <span>
                {message.readBy?.length > 0 ? <CheckCheck size={12} /> : <Check size={12} />}
            </span>
        )}
    </div>
</div>
            </div >
        </div >
    );
};

export default function MessageList({ messages, loading, roomId, typingUsers }) {
    const bottomRef = useRef(null);
    const { user } = useSelector((state) => state.auth);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    if (loading && messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-base-content/40 p-8 text-center">
                <p>No messages yet.</p>
                <p className="text-sm">Be the first to say hello!</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {messages.map((msg, index) => {
                const isOwn = (msg.sender._id || msg.sender) === user?.id;
                const prevMsg = messages[index - 1];
                const nextMsg = messages[index + 1];

                const isSameSenderAsPrev = prevMsg && (prevMsg.sender._id || prevMsg.sender) === (msg.sender._id || msg.sender);
                const isSameSenderAsNext = nextMsg && (nextMsg.sender._id || nextMsg.sender) === (msg.sender._id || msg.sender);

                // Show avatar only for the last message in a group from the same sender
                const showAvatar = !isOwn && !isSameSenderAsNext;
                // Show header (name) only for the first message in a group
                const showHeader = !isOwn && !isSameSenderAsPrev;

                return (
                    <MessageItem
                        key={msg._id || index}
                        message={msg}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                        showHeader={showHeader}
                    />
                );
            })}

            {/* Typing Indicator */}
            {typingUsers && typingUsers.length > 0 && (
                <div className="flex items-center gap-2 ml-10 mt-2">
                    <div className="bg-base-200 px-3 py-2 rounded-full rounded-tl-none">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                    <span className="text-xs text-base-content/40">
                        {typingUsers.length === 1
                            ? `${typingUsers[0].username} is typing...`
                            : 'Multiple people typing...'}
                    </span>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}
