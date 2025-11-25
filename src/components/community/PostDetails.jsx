const post = useSelector(selectCurrentPost);
const loading = useSelector(selectCommunityLoading);
const error = useSelector(selectCommunityError);

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
    <div className="space-y-6">
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-12">
                                {post.author?.avatar ? (
                                    <img src={post.author.avatar} alt={post.author.name} />
                                ) : (
                                    <span className="text-xl">{post.author?.name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                {post.author?.name || 'Anonymous'}
                                {post.author?.badges?.map((badge, idx) => (
                                    <span key={idx} className="badge badge-primary badge-xs">{badge}</span>
                                ))}
                            </h4>
                            <p className="text-sm text-base-content/60">
                                Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {post.isQuestion && (
                            <span className={`badge ${post.isSolved ? 'badge-success' : 'badge-warning'}`}>
                                {post.isSolved ? 'Solved' : 'Question'}
                            </span>
                        )}
                        <span className="badge badge-ghost">{post.category}</span>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                <div className="prose max-w-none mb-6 text-base-content/90">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="badge badge-outline badge-primary p-3">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="divider my-0"></div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                    <div className="flex gap-6">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 btn btn-ghost btn-sm hover:text-primary"
                        >
                            <ThumbsUp className="w-5 h-5" />
                            <span>{post.likes} Likes</span>
                        </button>
                        <div className="flex items-center gap-2 btn btn-ghost btn-sm no-animation cursor-default">
                            <MessageSquare className="w-5 h-5" />
                            <span>{post.commentsCount} Comments</span>
                        </div>
                        <div className="flex items-center gap-2 btn btn-ghost btn-sm no-animation cursor-default">
                            <Eye className="w-5 h-5" />
                        </div>
                        );
};

                        export default PostDetails;
