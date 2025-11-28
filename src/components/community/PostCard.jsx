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
                targetId: post._id // Add targetId explicitly
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
        <div className="group bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm shadow-black/5 hover:shadow-lg hover:shadow-black/10 transition-all duration-300 border border-gray-100 dark:border-neutral-800 hover:scale-[1.01]">
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {post.isQuestion && (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${post.isSolved
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                }`}
                        >
                            {post.isSolved ? 'Solved' : 'Question'}
                        </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <Link href={`/community/${post._id}`} className="block group-hover:opacity-90 transition-opacity">
                <h3 className="text-xl font-semibold text-base-content mb-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                    {post.content}
                </p>
            </Link>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                        <Link
                            key={index}
                            href={`/community/tags/${tag}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-medium text-primary bg-primary/5 px-3 py-1 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* Footer: Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex gap-4">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors group/like"
                    >
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 group-hover/like:bg-primary/10 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                        </div>
                        <span>{post.likes}</span>
                    </button>

                    <Link
                        href={`/community/${post._id}`}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors group/comment"
                    >
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 group-hover/comment:bg-primary/10 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <span>{post.commentsCount}</span>
                    </Link>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800">
                            <Eye className="w-4 h-4" />
                        </div>
                        <span>{post.views}</span>
                    </div>
                </div>

                <Link
                    href={`/community/${post._id}`}
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-focus transition-colors"
                >
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
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
