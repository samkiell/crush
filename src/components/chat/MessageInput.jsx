'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

export default function MessageInput({ onSendMessage, replyingTo, onCancelReply }) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() || isSending) return;

        setIsSending(true);
        try {
            await onSendMessage(message, replyingTo?._id);
            setMessage('');
            if (onCancelReply) onCancelReply();
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="p-4">
            {/* Reply Preview */}
            {replyingTo && (
                <div className="mb-2 p-2 bg-base-200 rounded-lg flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-base-content/60 mb-1">
                            Replying to {replyingTo.sender?.username}
                        </p>
                        <p className="text-sm text-base-content truncate">
                            {replyingTo.content}
                        </p>
                    </div>
                    <button
                        onClick={onCancelReply}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
                {/* Attachment Button (Optional - can add file upload later) */}
                <button
                    type="button"
                    className="btn btn-ghost btn-circle flex-shrink-0"
                    title="Attach file (coming soon)"
                    disabled
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                {/* Message Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message... (Shift+Enter for new line)"
                        className="textarea textarea-bordered w-full resize-none pr-12"
                        rows={1}
                        style={{
                            minHeight: '48px',
                            maxHeight: '120px',
                            overflowY: message.split('\n').length > 3 ? 'scroll' : 'hidden',
                        }}
                    />
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim() || isSending}
                    className="btn btn-primary btn-circle flex-shrink-0"
                >
                    {isSending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </form>
        </div>
    );
}
