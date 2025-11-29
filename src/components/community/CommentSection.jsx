'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, selectCommunityComments, toggleReaction, deleteComment } from '@/store/slices/communitySlice';
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Reply, Send, Flag, MessageSquare, ImagePlus, X, FileText, Trash2, MoreVertical, Loader2 } from 'lucide-react';
import axios from 'axios';

import Link from 'next/link';
import ReportModal from './ReportModal';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';

const CommentItem = ({ comment, allComments, onReply, onLike, onReport, onDelete, currentUser }) => {
    const replies = allComments.filter(c => c.parentComment === comment._id);

    return (
        <div className="mb-6 group">
            <div className="flex gap-4">
                <div className="avatar placeholder mt-1 flex-shrink-0">
                    <div className="bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-2xl w-10 h-10 shadow-sm">
                        {comment.author?.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.name} className="rounded-2xl" />
                        ) : (
                            <span className="text-sm font-bold">{comment.author?.name?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="bg-base-200 rounded-2xl rounded-tl-none p-4 px-5 shadow-sm border border-base-300">
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="font-semibold text-sm text-base-content flex items-center gap-2">
                                {comment.author?.name || 'Anonymous'}
                                {comment.author?.badges?.map((badge, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                        {badge}
                                    </span>
                                ))}
                            </span>
                            <span className="text-xs text-base-content/60 font-medium">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                        {comment.attachments && comment.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {comment.attachments.map((att, idx) => (
                                    <div key={idx} className="relative rounded-xl overflow-hidden border border-base-300 max-w-[200px] max-h-[200px]">
                                        {att.type.startsWith('image/') ? (
                                            <img src={att.url} alt="Attachment" className="w-full h-full object-cover" />
                                        ) : (
                                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-base-200 flex items-center gap-2 w-full h-full hover:bg-base-300 transition-colors">
                                                <FileText className="w-5 h-5" />
                                                <span className="text-xs truncate max-w-[100px]">{att.name}</span>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 ml-2">
                        <button
                            onClick={() => onLike(comment._id)}
                            className="text-xs font-semibold text-base-content/60 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-base-200"
                        >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            {comment.likes > 0 ? `${comment.likes} Likes` : 'Like'}
                        </button>
                        <button
                            onClick={() => onReply(comment)}
                            className="text-xs font-semibold text-base-content/60 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-base-200"
                        >
                            <Reply className="w-3.5 h-3.5" /> Reply
                        </button>
                        <details className="dropdown dropdown-end ml-auto">
                            <summary className="btn btn-ghost btn-xs btn-circle text-base-content/60 list-none">
                                <MoreVertical className="w-4 h-4" />
                            </summary>
                            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-200">
                                <li>
                                    <button
                                        onClick={(e) => {
                                            onReport(comment._id);
                                            e.currentTarget.closest('details').removeAttribute('open');
                                        }}
                                        className="text-xs text-base-content/80 hover:text-error"
                                    >
                                        <Flag className="w-3.5 h-3.5" /> Report
                                    </button>
                                </li>
                                {currentUser && (currentUser._id === comment.author?._id || currentUser.role === 'admin') && (
                                    <li>
                                        <button
                                            onClick={(e) => {
                                                onDelete(comment._id);
                                                e.currentTarget.closest('details').removeAttribute('open');
                                            }}
                                            className="text-xs text-error hover:bg-error/10"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </details>
                    </div>
                </div>
            </div>

            {/* Recursive Replies */}
            {replies.length > 0 && (
                <div className="ml-8 sm:ml-14 border-l-2 border-base-300 pl-6 mt-4 space-y-4">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            allComments={allComments}
                            onReply={onReply}
                            onLike={onLike}
                            onReport={onReport}
                            onDelete={onDelete}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection = ({ postId }) => {
    const dispatch = useDispatch();
    const comments = useSelector(selectCommunityComments);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportTargetId, setReportTargetId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        files.forEach(file => {
            if (file.size > MAX_SIZE) {
                showErrorToast(`File ${file.name} is too large (Max 5MB)`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachments(prev => [...prev, {
                    file,
                    preview: reader.result,
                    type: file.type,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (postId) {
            dispatch(fetchComments(postId));

            const interval = setInterval(() => {
                dispatch(fetchComments({ postId, isPolling: true }));
            }, 15000);

            return () => clearInterval(interval);
        }
    }, [dispatch, postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            // Upload attachments first
            const uploadedAttachments = [];
            if (attachments.length > 0) {
                for (const att of attachments) {
                    const formData = new FormData();
                    formData.append('file', att.file);
                    formData.append('type', replyTo ? 'replies' : 'comments');

                    const response = await axios.post('/api/media/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    uploadedAttachments.push(response.data);
                }
            }

            await dispatch(addComment({
                postId,
                content: newComment,
                parentComment: replyTo?._id || null,
                attachments: uploadedAttachments
            })).unwrap();

            setNewComment('');
            setAttachments([]);
            setReplyTo(null);
            showSuccessToast('Comment posted!');
        } catch (error) {
            showErrorToast(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId) => {
        try {
            const result = await dispatch(toggleReaction({
                id: commentId,
                targetType: 'Comment',
                type: 'like',
                targetId: commentId
            })).unwrap();

            if (result.action === 'added') {
                showSuccessToast('Comment liked! 👍');
            } else {
                showSuccessToast('Like removed');
            }
        } catch (error) {
            showErrorToast(error);
        }
    };

    const handleReport = (commentId) => {
        setReportTargetId(commentId);
        setReportModalOpen(true);
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            await dispatch(deleteComment(commentId)).unwrap();
            showSuccessToast('Comment deleted');
        } catch (error) {
            showErrorToast(error);
        }
    };

    const rootComments = comments
        .filter(c => !c.parentComment)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 px-2">Discussion ({comments.length})</h3>

            {/* Comment Input */}
            {isAuthenticated ? (
                <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300 mb-10">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <div className="avatar placeholder pt-1 flex-shrink-0">
                            <div className="bg-primary text-primary-content rounded-2xl w-10 h-10 shadow-sm">
                                <span>Me</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            {replyTo && (
                                <div className="text-xs font-medium text-base-content/60 mb-2 flex items-center justify-between bg-base-200 p-2 px-3 rounded-xl border border-base-300">
                                    <span>
                                        Replying to <b className="text-primary">{replyTo.author?.name}</b>
                                    </span>
                                    <button type="button" onClick={() => setReplyTo(null)} className="hover:text-red-600 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            )}
                            <div className="flex flex-col gap-2 p-3 rounded-xl bg-base-200 border border-base-300 focus-within:border-primary transition-all">
                                <textarea
                                    className="w-full bg-transparent focus:outline-none resize-none text-base text-base-content placeholder:text-base-content/50 min-h-[60px]"
                                    placeholder="Add to the discussion..."
                                    rows="2"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />

                                {/* Attachments Preview */}
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {attachments.map((file, index) => (
                                            <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-base-300 group">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-base-100">
                                                        <FileText className="w-6 h-6 text-base-content/50" />
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <label className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-primary">
                                        <ImagePlus className="w-5 h-5" />
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*,application/pdf"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        className="btn btn-circle btn-primary btn-sm shadow-sm hover:shadow-lg border-none transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={(!newComment.trim() && attachments.length === 0) || submitting}
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-base-200 p-8 rounded-2xl text-center mb-10 border border-base-300">
                    <p className="text-base-content/70 font-medium">
                        Please{' '}
                        <Link href={`/auth/login?redirect=/community/${postId}`} className="text-primary hover:underline font-bold">
                            login
                        </Link>{' '}
                        to join the discussion.
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-2">
                {rootComments.map(comment => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        allComments={comments}
                        onReply={setReplyTo}
                        onLike={handleLike}
                        onReport={handleReport}
                        onDelete={handleDelete}
                        currentUser={user}
                    />
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-10">
                        <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/40">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="text-base-content/60 font-medium">No comments yet. Be the first to start the conversation!</p>
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                targetType="Comment"
                targetId={reportTargetId}
            />
        </div>
    );
};

export default CommentSection;
