'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostDetails, selectCurrentPost, selectCommunityLoading, selectCommunityError, toggleReaction } from '@/store/slices/communitySlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Eye, MessageSquare, Share2, Flag } from 'lucide-react';
import CommentSection from './CommentSection';
import SkeletonPostDetails from './skeletons/SkeletonPostDetails';
import ReportModal from './ReportModal';

const PostDetails = ({ postId }) => {
    const dispatch = useDispatch();
    const post = useSelector(selectCurrentPost);
    const loading = useSelector(selectCommunityLoading);
    const error = useSelector(selectCommunityError);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        if (postId) {
            dispatch(fetchPostDetails(postId));

            const interval = setInterval(() => {
                dispatch(fetchPostDetails({ id: postId, isPolling: true }));
            }, 15000); // Poll every 15 seconds

            return () => clearInterval(interval);
        }
    }, [dispatch, postId]);

    const handleLike = () => {
        if (post) {
            dispatch(toggleReaction({ id: post._id, targetType: 'CommunityPost', type: 'like' }));
        }
    };

    if (loading) {
        return <SkeletonPostDetails />;
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>Error: {error}</span>
            </div>
        );
    }

    if (!post) return null;

    return (
    return (
        <div className="space-y-8">
            <div className="relative bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 dark:border-white/5 overflow-hidden">
                {/* Decorative Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

                <div className="p-8 sm:p-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl w-14 h-14 shadow-lg shadow-primary/20 flex items-center justify-center">
                                    {post.author?.avatar ? (
                                        <img src={post.author.avatar} alt={post.author.name} className="rounded-2xl" />
                                    ) : (
                                        <span className="text-xl font-bold">{post.author?.name?.charAt(0) || 'U'}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-base-content flex items-center gap-2">
                                    {post.author?.name || 'Anonymous'}
                                    {post.author?.badges?.map((badge, idx) => (
                                        <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                            {badge}
                                        </span>
                                    ))}
                                </h4>
                                <p className="text-sm text-base-content/50 font-medium">
                                    Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {post.isQuestion && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.isSolved
                                        ? 'bg-success/10 text-success'
                                        : 'bg-warning/10 text-warning'
                                    }`}>
                                    {post.isSolved ? 'Solved' : 'Question'}
                                </span>
                            )}
                            <span className="px-3 py-1 rounded-full bg-base-200/50 text-base-content/60 text-xs font-medium backdrop-blur-sm">
                                {post.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-base-content leading-tight">
                        {post.title}
                    </h1>
                    <div className="prose prose-lg max-w-none mb-8 text-base-content/80 leading-relaxed">
                        <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-base-content/10 to-transparent my-6"></div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4 sm:gap-6">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary/5 text-base-content/60 hover:text-primary transition-all duration-200 group"
                            >
                                <div className="p-2 rounded-full bg-base-200/50 group-hover:bg-primary/10 transition-colors">
                                    <ThumbsUp className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{post.likes} Likes</span>
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-base-content/60 cursor-default">
                                <div className="p-2 rounded-full bg-base-200/50">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{post.commentsCount} Comments</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-base-content/60 cursor-default hidden sm:flex">
                                <div className="p-2 rounded-full bg-base-200/50">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{post.views} Views</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-ghost btn-circle hover:bg-base-200/50" title="Share">
                                <Share2 className="w-5 h-5 text-base-content/60" />
                            </button>
                            <button
                                className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error"
                                title="Report"
                                onClick={() => setIsReportModalOpen(true)}
                            >
                                <Flag className="w-5 h-5 text-base-content/60" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <CommentSection postId={post._id} />

            {/* Report Modal */}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                targetType="CommunityPost"
                targetId={post._id}
            />
        </div>
    );
};

export default PostDetails;
