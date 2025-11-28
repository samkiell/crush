'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, selectCommunityComments, toggleReaction } from '@/store/slices/communitySlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Reply, Send, Flag, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import ReportModal from './ReportModal';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';

const CommentItem = ({ comment, allComments, onReply, onLike, onReport }) => {
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
                    <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl rounded-tl-none p-4 px-5 shadow-sm border border-gray-100 dark:border-neutral-700">
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="font-semibold text-sm text-base-content flex items-center gap-2">
                                {comment.author?.name || 'Anonymous'}
                                {comment.author?.badges?.map((badge, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                        {badge}
                                    </span>
                                ))}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 ml-2">
                        <button
                            onClick={() => onLike(comment._id)}
                            className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            {comment.likes > 0 ? `${comment.likes} Likes` : 'Like'}
                        </button>
                        <button
                            onClick={() => onReply(comment)}
                            className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                            <Reply className="w-3.5 h-3.5" /> Reply
                        </button>
                        <button
                            onClick={() => onReport(comment._id)}
                            className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto opacity-0 group-hover:opacity-100"
                        >
                            <Flag className="w-3.5 h-3.5" /> Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Recursive Replies */}
            {replies.length > 0 && (
                <div className="ml-8 sm:ml-14 border-l-2 border-gray-200 dark:border-neutral-800 pl-6 mt-4 space-y-4">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            allComments={allComments}
                            onReply={onReply}
                            onLike={onLike}
                            onReport={onReport}
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
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportTargetId, setReportTargetId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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
            await dispatch(addComment({
                postId,
                content: newComment,
                parentComment: replyTo?._id || null,
            })).unwrap();

            setNewComment('');
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

    const rootComments = comments.filter(c => !c.parentComment);

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 px-2">Discussion ({comments.length})</h3>

            {/* Comment Input */}
            {isAuthenticated ? (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm shadow-black/5 border border-gray-100 dark:border-neutral-800 mb-10">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <div className="avatar placeholder pt-1 flex-shrink-0">
                            <div className="bg-primary text-primary-content rounded-2xl w-10 h-10 shadow-sm">
                                <span>Me</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            {replyTo && (
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-between bg-gray-100 dark:bg-neutral-800 p-2 px-3 rounded-xl border border-gray-200 dark:border-neutral-700">
                                    <span>
                                        Replying to <b className="text-primary">{replyTo.author?.name}</b>
                                    </span>
                                    <button type="button" onClick={() => setReplyTo(null)} className="hover:text-red-600 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            )}
                            <div className="relative group">
                                <textarea
                                    className="textarea w-full bg-gray-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-900 border-gray-200 dark:border-neutral-700 focus:border-primary rounded-xl pr-12 resize-none text-base transition-all min-h-[80px]"
                                    placeholder="Add to the discussion..."
                                    rows="3"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute bottom-3 right-3 btn btn-circle btn-primary btn-sm shadow-sm hover:shadow-lg border-none transition-all duration-200 hover:scale-110"
                                    disabled={!newComment.trim() || submitting}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-neutral-800 p-8 rounded-2xl text-center mb-10 border border-gray-200 dark:border-neutral-700">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
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
                    />
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-10">
                        <div className="bg-gray-100 dark:bg-neutral-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">No comments yet. Be the first to start the conversation!</p>
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
