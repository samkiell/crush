'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const FilterBar = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentSort = searchParams.get('sort') || 'latest';

    const filters = [
        { id: 'latest', label: 'Latest' },
        { id: 'popular', label: 'Popular' },
        { id: 'unsolved', label: 'Unsolved' },
    ];

    const handleFilterClick = (filterId) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', filterId);
        params.delete('page'); // Reset to page 1 when changing sort
        router.push(`/community?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 p-1.5 rounded-2xl shadow-sm shadow-black/5">
            {filters.map((filter) => {
                const isActive = currentSort === filter.id;
                return (
                    <button
                        key={filter.id}
                        onClick={() => handleFilterClick(filter.id)}
                        className={`
              px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${isActive
                                ? 'bg-white dark:bg-neutral-900 text-primary shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-base-content hover:bg-white/50 dark:hover:bg-neutral-700'
                            }
            `}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
};

export default FilterBar;
