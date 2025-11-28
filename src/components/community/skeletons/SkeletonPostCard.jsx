'use client';

const SkeletonPostCard = () => {
    return (
        <div className="bg-base-100 rounded-2xl p-6 shadow-sm shadow-black/5 animate-pulse border border-base-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-base-content/10 rounded-2xl" />
                    <div className="space-y-2">
                        {/* Author name */}
                        <div className="h-4 w-24 bg-base-content/10 rounded-full" />
                        {/* Timestamp */}
                        <div className="h-3 w-16 bg-base-content/10 rounded-full" />
                    </div>
                </div>
                {/* Category badge */}
                <div className="h-6 w-20 bg-base-content/10 rounded-full" />
            </div>

            {/* Title */}
            <div className="h-6 w-3/4 bg-base-content/10 rounded-lg mb-3" />

            {/* Content preview */}
            <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-base-content/10 rounded-lg" />
                <div className="h-4 w-5/6 bg-base-content/10 rounded-lg" />
                <div className="h-4 w-4/6 bg-base-content/10 rounded-lg" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-7 w-16 bg-base-content/10 rounded-xl" />
                <div className="h-7 w-20 bg-base-content/10 rounded-xl" />
                <div className="h-7 w-14 bg-base-content/10 rounded-xl" />
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-4 border-t border-base-300">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-base-content/10 rounded-full" />
                        <div className="h-4 w-6 bg-base-content/10 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-base-content/10 rounded-full" />
                        <div className="h-4 w-6 bg-base-content/10 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-base-content/10 rounded-full" />
                        <div className="h-4 w-6 bg-base-content/10 rounded-full" />
                    </div>
                </div>
                <div className="h-4 w-20 bg-base-content/10 rounded-lg" />
            </div>
        </div>
    );
};

export default SkeletonPostCard;