'use client';

import Link from 'next/link';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleReaction } from '@/store/slices/communitySlice';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();
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
    };

    return (
        <Link href={`/community/${post._id}`} className="block">
            <div className="group bg-base-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-base-300 hover:scale-[1.01] cursor-pointer">
                {/* Header: Author & Meta */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl w-10 h-10 shadow-sm flex items-center justify-center">
                                {post.author?.avatar ? (
                                    <img src={post.author.avatar} alt={post.author.name} className="rounded-2xl" />
                                ) : (
                                    <span className="text-lg font-bold">{post.author?.name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-base-content flex items-center gap-2">
                                {post.author?.name || 'Anonymous'}
                                {post.author?.badges?.includes('Mentor') && (
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                        Mentor
                                    </span>
                                )}
                            </h4>
                            <p className="text-xs text-base-content/60 font-medium">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
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
                <div>
                    <h3 className="text-xl font-semibold text-base-content mb-2 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-base-content/70 text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.content}
                    </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.location.href = `/community/tags/${tag}`;
                                }}
                                className="text-xs font-medium text-primary bg-primary/5 px-3 py-1 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-base-300">
                    <div className="flex gap-4">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-primary transition-colors group/like"
                        >
                            <div className="p-2 rounded-full bg-base-200 group-hover/like:bg-primary/10 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                            </div>
                            <span>{post.likes}</span>
                        </button>

                        <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                            <div className="p-2 rounded-full bg-base-200">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <span>{post.commentsCount}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                            <div className="p-2 rounded-full bg-base-200">
                                <Eye className="w-4 h-4" />
                            </div>
                            <span>{post.views}</span>
                        </div>
                    </div>

                    {/* Read More - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-focus transition-colors">
                        Read More
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;
