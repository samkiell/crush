'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostDetails, selectCurrentPost, selectCommunityLoading, selectCommunityError, toggleReaction } from '@/store/slices/communitySlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Eye, MessageSquare, Share2, Flag } from 'lucide-react';
import Link from 'next/link';
import CommentSection from './CommentSection';
import SkeletonPostDetails from './skeletons/SkeletonPostDetails';
import ReportModal from './ReportModal';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';

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
            }, 15000);

            return () => clearInterval(interval);
        }
    }, [dispatch, postId]);

    const handleLike = async () => {
        if (post) {
            try {
                const result = await dispatch(toggleReaction({
                    id: post._id,
                    targetType: 'CommunityPost',
                    type: 'like',
                    targetId: post._id
                })).unwrap();

                if (result.action === 'added') {
                    showSuccessToast('Post liked! 👍');
                } else {
                    showSuccessToast('Like removed');
                }
            } catch (error) {
                showErrorToast(error);
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.content.substring(0, 100) + '...',
                url: window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showSuccessToast('Link copied to clipboard!');
        }
    };

    if (loading) {
        return <SkeletonPostDetails />;
    }

    if (error) {
        return (
            <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-center">
                <p className="text-error font-semibold mb-3">Error loading post: {error}</p>
                <Link href="/community" className="btn btn-primary rounded-xl">
                    ← Back to Community
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bg-base-200 rounded-2xl p-8 text-center">
                <p className="text-base-content/60 font-medium mb-3">Post not found</p>
                <Link href="/community" className="btn btn-primary rounded-xl">
                    ← Back to Community
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-base-100 rounded-3xl shadow-lg border border-base-300 overflow-hidden">
                <div className="p-6 sm:p-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl w-14 h-14 shadow-sm flex items-center justify-center">
                                    {post.author?.avatar ? (
                                        <img src={post.author.avatar} alt={post.author.name} className="rounded-2xl" />
                                    ) : (
                                        <span className="text-xl font-bold">{post.author?.name?.charAt(0) || 'U'}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-base-content flex items-center gap-2">
                                    {post.author?.name || 'Anonymous'}
                                    {post.author?.badges?.map((badge, idx) => (
                                        <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                            {badge}
                                        </span>
                                    ))}
                                </h4>
                                <p className="text-sm text-base-content/60 font-medium">
                                    Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {post.isQuestion && (
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${post.isSolved
                                        ? 'bg-success/10 text-success'
                                        : 'bg-warning/10 text-warning'
                                        }`}
                                >
                                    {post.isSolved ? 'Solved' : 'Question'}
                                </span>
                            )}
                            <span className="px-3 py-1 rounded-full bg-base-200 text-base-content/70 text-xs font-medium">
                                {post.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-base-content leading-tight">
                        {post.title}
                    </h1>
                    <div className="prose prose-lg max-w-none mb-8 text-base-content/80 leading-relaxed">
                        <p className="whitespace-pre-wrap text-base sm:text-lg">{post.content}</p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag, index) => (
                                <Link
                                    key={index}
                                    href={`/community/tags/${tag}`}
                                    className="text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="h-px w-full bg-base-300 my-6" />

                    {/* Actions */}
                    {/* Actions */}
                    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
                        <div className="flex flex-row items-center gap-1 sm:gap-4">
                            <button
                                onClick={handleLike}
                                className="flex flex-row items-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl hover:bg-base-200 text-base-content/70 hover:text-primary transition-all duration-200 group shrink-0"
                            >
                                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-medium text-sm sm:text-base">
                                    {post.likes} <span className="hidden sm:inline">Likes</span>
                                </span>
                            </button>
                            <div className="flex flex-row items-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl text-base-content/70 cursor-default shrink-0">
                                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-medium text-sm sm:text-base">
                                    {post.commentsCount} <span className="hidden sm:inline">Comments</span>
                                </span>
                            </div>
                            <div className="flex flex-row items-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl text-base-content/70 cursor-default shrink-0">
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-medium text-sm sm:text-base">
                                    {post.views} <span className="hidden sm:inline">Views</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-1 sm:gap-2 shrink-0">
                            <button
                                onClick={handleShare}
                                className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200 mr-1 sm:mr-0"
                                title="Share"
                            >
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/70" />
                            </button>
                            <button
                                className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-error/10 hover:text-error"
                                title="Report"
                                onClick={() => setIsReportModalOpen(true)}
                            >
                                <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/70" />
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
