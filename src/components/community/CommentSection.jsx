'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, selectCommunityComments, toggleReaction } from '@/store/slices/communitySlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Reply, Send, Flag } from 'lucide-react';
import Link from 'next/link';

import ReportModal from './ReportModal';

const CommentItem = ({ comment, allComments, onReply, onLike, onReport }) => {
    const replies = allComments.filter(c => c.parentComment === comment._id);

    return (
        <div className="mb-6 group">
            <div className="flex gap-4">
                <div className="avatar placeholder mt-1">
                    <div className="bg-gradient-to-br from-neutral to-neutral-focus text-neutral-content rounded-2xl w-10 h-10 shadow-sm">
                        {comment.author?.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.name} className="rounded-2xl" />
                        ) : (
                            <span className="text-sm font-bold">{comment.author?.name?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-[1.5rem] rounded-tl-none p-4 px-6 inline-block min-w-[200px] shadow-sm border border-white/20 dark:border-white/5">
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="font-bold text-sm text-base-content flex items-center gap-2">
                                {comment.author?.name || 'Anonymous'}
                                {comment.author?.badges?.map((badge, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{badge}</span>
                                ))}
                            </span>
                            <span className="text-xs text-base-content/40 font-medium">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 ml-2">
                        <button
                            onClick={() => onLike(comment._id)}
                            className="text-xs font-bold text-base-content/50 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-base-200/50"
                        >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            {comment.likes > 0 ? `${comment.likes} Likes` : 'Like'}
                        </button>
                        <button
                            onClick={() => onReply(comment)}
                            className="text-xs font-bold text-base-content/50 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-base-200/50"
                        >
                            <Reply className="w-3.5 h-3.5" /> Reply
                        </button>
                        <button
                            onClick={() => onReport(comment._id)}
                            className="text-xs font-bold text-base-content/50 hover:text-error transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-error/10 ml-auto opacity-0 group-hover:opacity-100"
                        >
                            <Flag className="w-3.5 h-3.5" /> Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Recursive Replies */}
            {replies.length > 0 && (
                <div className="ml-8 sm:ml-14 border-l-2 border-base-content/5 pl-6 mt-4 space-y-4">
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

    useEffect(() => {
        if (postId) {
            dispatch(fetchComments(postId));

            const interval = setInterval(() => {
                dispatch(fetchComments({ postId, isPolling: true }));
            }, 15000); // Poll every 15 seconds

            return () => clearInterval(interval);
        }
    }, [dispatch, postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await dispatch(addComment({
            postId,
            content: newComment,
            parentComment: replyTo?._id || null,
        }));

        setNewComment('');
        setReplyTo(null);
    };

    const handleLike = (commentId) => {
        dispatch(toggleReaction({ id: commentId, targetType: 'Comment', type: 'like' }));
    };

    const handleReport = (commentId) => {
        setReportTargetId(commentId);
        setReportModalOpen(true);
    };

    // Filter top-level comments (simplified for now, ideally recursive)
    const rootComments = comments.filter(c => !c.parentComment);

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 px-2">Discussion ({comments.length})</h3>

            {/* Comment Input */}
            {isAuthenticated ? (
                <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-lg shadow-black/5 border border-white/20 dark:border-white/5 mb-10">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <div className="avatar placeholder pt-1">
                            <div className="bg-primary text-primary-content rounded-2xl w-10 h-10 shadow-md">
                                <span>Me</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            {replyTo && (
                                <div className="text-xs font-medium text-base-content/60 mb-2 flex items-center justify-between bg-base-200/50 p-2 px-3 rounded-xl border border-base-content/5">
                                    <span>Replying to <b className="text-primary">{replyTo.author?.name}</b></span>
                                    <button type="button" onClick={() => setReplyTo(null)} className="hover:text-error transition-colors">Cancel</button>
                                </div>
                            )}
                            <div className="relative group">
                                <textarea
                                    className="textarea w-full bg-base-200/30 focus:bg-white dark:focus:bg-black/20 border-transparent focus:border-primary rounded-2xl pr-12 resize-none text-base transition-all duration-200 min-h-[80px] shadow-inner"
                                    placeholder="Add to the discussion..."
                                    rows="3"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>
                                <button
                                    type="submit"
                                    className="absolute bottom-3 right-3 btn btn-circle btn-primary btn-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 border-none transition-all duration-200 hover:scale-110"
                                    disabled={!newComment.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-base-200/50 backdrop-blur-sm p-8 rounded-3xl text-center mb-10 border border-base-content/5">
                    <p className="text-base-content/70 font-medium">
                        Please <Link href={`/login?redirect=/community/${postId}`} className="text-primary hover:underline font-bold">login</Link> to join the discussion.
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-2">
                {rootComments.map((comment) => (
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
                        <div className="bg-base-200/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/30">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="text-base-content/50 font-medium">No comments yet. Be the first to start the conversation!</p>
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
