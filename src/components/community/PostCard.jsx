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
        <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 mb-4 border border-base-200">
            <div className="card-body p-5">
                {/* Header: Author & Meta */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                {post.author?.avatar ? (
                                    <img src={post.author.avatar} alt={post.author.name} />
                                ) : (
                                    <span className="text-lg">{post.author?.name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm flex items-center gap-1">
                                {post.author?.name || 'Anonymous'}
                                {post.author?.badges?.includes('Mentor') && (
                                    <span className="badge badge-primary badge-xs">Mentor</span>
                                )}
                            </h4>
                            <p className="text-xs text-base-content/60">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {post.isQuestion && (
                            <span className={`badge ${post.isSolved ? 'badge-success' : 'badge-warning'} badge-sm`}>
                                {post.isSolved ? 'Solved' : 'Question'}
                            </span>
                        )}
                        <span className="badge badge-ghost badge-sm">{post.category}</span>
                    </div>
                </div>

                {/* Content */}
                <Link href={`/community/${post._id}`} className="group">
                    <h3 className="card-title text-lg mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-base-content/80 line-clamp-3 text-sm">
                        {post.content}
                    </p>
                </Link>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="divider my-2"></div>

                {/* Footer: Actions & Stats */}
                <div className="flex items-center justify-between text-sm text-base-content/70">
                    <div className="flex gap-4">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                        </button>
                        <Link href={`/community/${post._id}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.commentsCount}</span>
                        </Link>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                        </div>
                    </div>

                    <Link href={`/community/${post._id}`} className="btn btn-sm btn-ghost text-primary">
                        Join Discussion
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
