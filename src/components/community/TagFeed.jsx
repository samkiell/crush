'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectCommunityPosts, selectCommunityLoading, selectCommunityError } from '@/store/slices/communitySlice';
import PostCard from './PostCard';
import SkeletonPostCard from './skeletons/SkeletonPostCard';
import Link from 'next/link';
import { ArrowLeft, Hash } from 'lucide-react';
import { showErrorToast } from '@/utils/toast-helpers';

const TagFeed = ({ tag }) => {
    const dispatch = useDispatch();
    const posts = useSelector(selectCommunityPosts);
    const loading = useSelector(selectCommunityLoading);
    const error = useSelector(selectCommunityError);

    useEffect(() => {
        // Fetch posts with tag filter
        dispatch(fetchPosts({ page: 1, limit: 20, tag }));
    }, [dispatch, tag]);

    useEffect(() => {
        if (error) {
            showErrorToast(error);
        }
    }, [error]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/community" className="btn btn-ghost btn-circle">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
                </div>
                {[...Array(5)].map((_, i) => (
                    <SkeletonPostCard key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/community" className="btn btn-ghost btn-circle hover:bg-gray-100 dark:hover:bg-neutral-800">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <Hash className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-base-content">#{tag}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {posts.length} {posts.length === 1 ? 'discussion' : 'discussions'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Posts */}
            {posts.map(post => (
                <PostCard key={post._id} post={post} />
            ))}

            {posts.length === 0 && !loading && (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm shadow-black/5">
                    <div className="max-w-md mx-auto px-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
                            <Hash className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-base-content mb-2">No posts with #{tag}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Be the first to create a post with this tag!
                        </p>
                        <Link href="/community/create" className="btn btn-primary rounded-xl">
                            Create Post
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagFeed;
