'use client';

const SkeletonPostDetails = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Main Post Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-10 shadow-lg shadow-black/10 border border-gray-100 dark:border-neutral-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
                        <div className="space-y-2">
                            <div className="h-5 w-32 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                            <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        </div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                </div>

                {/* Title */}
                <div className="space-y-3 mb-6">
                    <div className="h-8 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                    <div className="h-8 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                </div>

                {/* Content */}
                <div className="space-y-3 mb-8">
                    <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                    <div className="h-4 w-4/6 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-8">
                    <div className="h-8 w-20 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                    <div className="h-8 w-24 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                    <div className="h-8 w-16 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Comment Section Skeleton */}
            <div className="space-y-4">
                <div className="h-6 w-32 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-800 rounded-2xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                            <div className="h-16 w-full bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonPostDetails;
