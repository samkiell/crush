'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


const FilterBar = () => {
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'latest';

    const filters = [
        { id: 'latest', label: 'Latest' },
        { id: 'popular', label: 'Popular' },
        { id: 'unsolved', label: 'Unsolved' },
    ];

    return (
        <div className="flex items-center gap-2 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
            {filters.map((filter) => {
                const isActive = currentSort === filter.id;
                return (
                    <Link
                        key={filter.id}
                        href={`/community?sort=${filter.id}`}
                        className={`
                            px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${isActive
                                ? 'bg-white dark:bg-neutral-800 text-primary shadow-sm'
                                : 'text-base-content/60 hover:text-base-content hover:bg-white/50 dark:hover:bg-white/5'
                            }
                        `}
                    >
                        {filter.label}
                    </Link>
                );
            })}
        </div>
    );
};

export default FilterBar;
