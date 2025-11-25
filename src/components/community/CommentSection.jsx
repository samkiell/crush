'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, selectCommunityComments, toggleReaction } from '@/store/slices/communitySlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Reply, Send } from 'lucide-react';
import Link from 'next/link';

const CommentItem = ({ comment, allComments, onReply, onLike }) => {
    const replies = allComments.filter(c => c.parentComment === comment._id);

    return (
        <div className="mb-4">
            <div className="flex gap-3">
                <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                        {comment.author?.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.name} />
                        ) : (
                            <span className="text-xs">{comment.author?.name?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="bg-base-200 rounded-2xl p-3 px-4 inline-block min-w-[200px]">
                        <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="font-bold text-sm flex items-center gap-2">
                                {comment.author?.name || 'Anonymous'}
                                {comment.author?.badges?.map((badge, idx) => (
                                    <span key={idx} className="badge badge-xs badge-primary">{badge}</span>
                                ))}
                            </span>
                            <span className="text-xs text-base-content/50">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-sm text-base-content/90 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-base-content/60">
                        <button
                            onClick={() => onLike(comment._id)}
                            className="hover:text-primary font-medium flex items-center gap-1"
                        >
                            <ThumbsUp className="w-3 h-3" />
                            {comment.likes > 0 && <span>{comment.likes}</span>} Like
                        </button>
                        <button
                            onClick={() => onReply(comment)}
                            className="hover:text-primary font-medium flex items-center gap-1"
                        >
                            <Reply className="w-3 h-3" /> Reply
                        </button>
                    </div>
                </div>
            </div>

            {/* Recursive Replies */}
            {replies.length > 0 && (
                <div className="ml-8 sm:ml-12 border-l-2 border-base-200 pl-4 mt-2">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            allComments={allComments}
                            onReply={onReply}
                            onLike={onLike}
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

    // Filter top-level comments (simplified for now, ideally recursive)
    const rootComments = comments.filter(c => !c.parentComment);

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
                <h3 className="font-bold text-lg mb-4">Discussion ({comments.length})</h3>

                {/* Comment Input */}
                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span>Me</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            {replyTo && (
                                <div className="text-xs text-base-content/60 mb-2 flex items-center justify-between bg-base-200 p-2 rounded">
                                    <span>Replying to <b>{replyTo.author?.name}</b></span>
                                    <button type="button" onClick={() => setReplyTo(null)} className="hover:text-error">Cancel</button>
                                </div>
                            )}
                            <div className="relative">
                                <textarea
                                    className="textarea textarea-bordered w-full pr-12 resize-none"
                                    placeholder="Add to the discussion..."
                                    rows="3"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>
                                <button
                                    type="submit"
                                    className="absolute bottom-3 right-3 btn btn-circle btn-primary btn-sm"
                                    disabled={!newComment.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="bg-base-200 p-6 rounded-lg text-center mb-8">
                        <p className="text-base-content/70">
                            Please <Link href={`/login?redirect=/community/${postId}`} className="link link-primary font-bold">login</Link> to join the discussion.
                            onLike={handleLike}
                            />
                        ))}

                            {comments.length === 0 && (
                                <p className="text-center text-base-content/50 py-4">No comments yet. Be the first!</p>
                            )}
                    </div>

                    {comments.length === 0 && (
                    <p className="text-center text-base-content/50 py-4">No comments yet. Be the first!</p>
                )}
            </div>
        </div>
        </div >
    );
};

export default CommentSection;
