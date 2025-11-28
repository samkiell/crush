'use client';

const SkeletonPostCard = () => {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm shadow-black/5 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
                    <div className="space-y-2">
                        {/* Author name */}
                        <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        {/* Timestamp */}
                        <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                </div>
                {/* Category badge */}
                <div className="h-6 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full" />
            </div>

            {/* Title */}
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded-lg mb-3" />

            {/* Content preview */}
            <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-4 w-4/6 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-7 w-16 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                <div className="h-7 w-20 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                <div className="h-7 w-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-4 w-6 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-4 w-6 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-4 w-6 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                </div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
            </div>
        </div>
    );
};

export default SkeletonPostCard;