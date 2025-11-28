'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        } else {
            params.delete('search');
        }
        params.delete('page'); // Reset to page 1

        router.push(`/community?${params.toString()}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
        router.push(`/community?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
                {/* Clear button on the left (only shows when there's text) */}
                {searchQuery && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`input w-full ${searchQuery ? 'pl-10' : 'pl-4'} pr-12 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus:border-primary rounded-xl transition-all`}
                />

                {/* Search button on the right (always visible and functional) */}
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    aria-label="Search"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
