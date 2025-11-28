'use client';

import CommunityLayout from '@/components/community/CommunityLayout';
import HeroSection from '@/components/community/HeroSection';
import Feed from '@/components/community/Feed';
import FilterBar from '@/components/community/FilterBar';
import SearchBar from '@/components/community/SearchBar';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function CommunityPage() {
  return (
    <CommunityLayout>
      <div className="w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Search and Create Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1">
            <SearchBar />
          </div>
          <Link
            href="/community/create"
            className="btn btn-primary rounded-xl gap-2 shadow-sm hover:shadow-lg whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">New Post</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar />
        </div>

        {/* Feed */}
        <Feed />
      </div>
    </CommunityLayout>
  );
}
