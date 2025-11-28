'use client';

import Link from 'next/link';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { MessageSquare, ThumbsUp, Eye, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleReaction } from '@/store/slices/communitySlice';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();

    const handleLike = (e) => {
        e.preventDefault(); // Prevent navigation if clicking like
        dispatch(toggleReaction({ id: post._id, targetType: 'CommunityPost', type: 'like' }));
    };

    return (
        <div className="group relative bg-white/60 dark:bg-neutral-900/60 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-white/20 dark:border-white/5 hover:scale-[1.01]">
            {/* Header: Author & Meta */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                        <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl w-10 h-10 shadow-md flex items-center justify-center">
                            {post.author?.avatar ? (
                                <img src={post.author.avatar} alt={post.author.name} className="rounded-2xl" />
                            ) : (
                                <span className="text-lg font-bold">{post.author?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-base-content flex items-center gap-2">
                            {post.author?.name || 'Anonymous'}
                            {post.author?.badges?.includes('Mentor') && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                    Mentor
                                </span>
                            )}
                        </h4>
                        <p className="text-xs text-base-content/50 font-medium">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
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
            <Link href={`/community/${post._id}`} className="block group-hover:opacity-90 transition-opacity">
                <h3 className="text-[22px] font-bold text-base-content mb-3 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                <p className="text-base-content/70 text-base leading-relaxed line-clamp-3 mb-4">
                    {post.content}
                </p>
            </Link>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                        <span key={index} className="text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer: Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-base-content/5">
                <div className="flex gap-6">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary transition-colors group/like"
                    >
                        <div className="p-2 rounded-full bg-base-200/50 group-hover/like:bg-primary/10 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                        </div>
                        <span>{post.likes}</span>
                    </button>

                    <Link href={`/community/${post._id}`} className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary transition-colors group/comment">
                        <div className="p-2 rounded-full bg-base-200/50 group-hover/comment:bg-primary/10 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <span>{post.commentsCount}</span>
                    </Link>

                    <div className="flex items-center gap-2 text-sm font-medium text-base-content/60">
                        <div className="p-2 rounded-full bg-base-200/50">
                            <Eye className="w-4 h-4" />
                        </div>
                        <span>{post.views}</span>
                    </div>
                </div>

                <Link
                    href={`/community/${post._id}`}
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-focus transition-colors"
                >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
