const SkeletonPostCard = () => {
    return (
        <div className="card bg-base-100 shadow-sm mb-4 border border-base-200 animate-pulse">
            <div className="card-body p-5">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-base-300 w-10 h-10"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-base-300 rounded w-24"></div>
                            <div className="h-3 bg-base-300 rounded w-16"></div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-5 bg-base-300 rounded w-16"></div>
                        <div className="h-5 bg-base-300 rounded w-16"></div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-3 mb-4">
                    <div className="h-6 bg-base-300 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-base-300 rounded w-full"></div>
                        <div className="h-4 bg-base-300 rounded w-full"></div>
                        <div className="h-4 bg-base-300 rounded w-2/3"></div>
                    </div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex gap-2 mt-3">
                    <div className="h-5 bg-base-300 rounded w-12"></div>
                    <div className="h-5 bg-base-300 rounded w-16"></div>
                    <div className="h-5 bg-base-300 rounded w-10"></div>
                </div>

                <div className="divider my-2"></div>

                {/* Footer Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="h-4 bg-base-300 rounded w-8"></div>
                        <div className="h-4 bg-base-300 rounded w-8"></div>
                        <div className="h-4 bg-base-300 rounded w-8"></div>
                    </div>
                    <div className="h-8 bg-base-300 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonPostCard;
