const SkeletonPostDetails = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-6">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-base-300 w-12 h-12"></div>
                            <div className="space-y-2">
                                <div className="h-5 bg-base-300 rounded w-32"></div>
                                <div className="h-4 bg-base-300 rounded w-24"></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-6 bg-base-300 rounded w-20"></div>
                            <div className="h-6 bg-base-300 rounded w-20"></div>
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="h-8 bg-base-300 rounded w-3/4 mb-6"></div>
                    <div className="space-y-3 mb-8">
                        <div className="h-4 bg-base-300 rounded w-full"></div>
                        <div className="h-4 bg-base-300 rounded w-full"></div>
                        <div className="h-4 bg-base-300 rounded w-full"></div>
                        <div className="h-4 bg-base-300 rounded w-5/6"></div>
                        <div className="h-4 bg-base-300 rounded w-full"></div>
                        <div className="h-4 bg-base-300 rounded w-4/5"></div>
                    </div>

                    {/* Tags Skeleton */}
                    <div className="flex gap-2 mb-6">
                        <div className="h-8 bg-base-300 rounded w-16"></div>
                        <div className="h-8 bg-base-300 rounded w-20"></div>
                        <div className="h-8 bg-base-300 rounded w-14"></div>
                    </div>

                    <div className="divider my-0"></div>

                    {/* Actions Skeleton */}
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex gap-6">
                            <div className="h-8 bg-base-300 rounded w-20"></div>
                            <div className="h-8 bg-base-300 rounded w-24"></div>
                            <div className="h-8 bg-base-300 rounded w-20"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-8 bg-base-300 rounded w-8"></div>
                            <div className="h-8 bg-base-300 rounded w-8"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Skeleton */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-6">
                    <div className="h-6 bg-base-300 rounded w-32 mb-6"></div>

                    {/* Comment Input Skeleton */}
                    <div className="flex gap-3 mb-8">
                        <div className="rounded-full bg-base-300 w-10 h-10"></div>
                        <div className="flex-1 h-24 bg-base-300 rounded-xl"></div>
                    </div>

                    {/* Comments List Skeleton */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3">
                                <div className="rounded-full bg-base-300 w-8 h-8"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-20 bg-base-300 rounded-2xl w-full"></div>
                                    <div className="flex gap-4 ml-2">
                                        <div className="h-3 bg-base-300 rounded w-12"></div>
                                        <div className="h-3 bg-base-300 rounded w-12"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonPostDetails;
