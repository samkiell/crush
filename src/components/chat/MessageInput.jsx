'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Image as ImageIcon, Paperclip, X, Smile } from 'lucide-react';
import { sendMessage, setTypingUser } from '@/store/slices/chatSlice';
import { useSocket } from '@/hooks/useSocket';

export default function MessageInput({ roomId, onSendMessage }) {
    const [content, setContent] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const socket = useSocket();
    const { user } = useSelector((state) => state.auth);
    const textareaRef = useRef(null);

    const handleTyping = () => {
        if (!socket) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing_start', { roomId, username: user.username });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing_stop', { roomId, username: user.username });
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const messageContent = content.trim();
        setContent('');

        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        if (onSendMessage) {
            onSendMessage(messageContent);
        }

        // Stop typing indicator immediately
        if (isTyping) {
            setIsTyping(false);
            socket?.emit('typing_stop', { roomId, username: user.username });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const autoResize = (e) => {
        const target = e.target;
        target.style.height = 'auto';
        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
        setContent(target.value);
        handleTyping();
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 bg-base-100 border-t border-base-200 flex items-end gap-2">
            <button
                type="button"
                className="btn btn-circle btn-ghost btn-sm text-base-content/50 hover:text-primary hover:bg-base-200"
            >
                <ImageIcon size={20} />
            </button>

            <div className="flex-1 bg-base-200 rounded-2xl px-4 py-2 min-h-[44px] flex items-center">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={autoResize}
                    onKeyDown={handleKeyDown}
                    placeholder="Message..."
                    className="w-full bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed max-h-[120px] py-1 placeholder:text-base-content/40"
                    rows={1}
                />
            </div>

            <button
                type="submit"
                disabled={!content.trim()}
                className={`btn btn-circle btn-sm ${content.trim() ? 'btn-primary' : 'btn-ghost text-base-content/30'}`}
            >
                <Send size={18} className={content.trim() ? 'ml-0.5' : ''} />
            </button>
        </form>
    );
}
