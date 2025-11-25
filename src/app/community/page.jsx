import CommunityLayout from '@/components/community/CommunityLayout';
import HeroSection from '@/components/community/HeroSection';
import Feed from '@/components/community/Feed';

export const metadata = {
  title: 'Community | CrushEdu',
  description: 'Join the discussion, ask questions, and learn from peers.',
};

export default function CommunityPage() {
  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto">
        <HeroSection />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Latest Discussions</h2>
          <div className="join">
            <button className="join-item btn btn-sm btn-active">Latest</button>
            <button className="join-item btn btn-sm">Popular</button>
            <button className="join-item btn btn-sm">Unsolved</button>
          </div>
        </div>

        <Feed />
      </div>
    </CommunityLayout>
  );
}
