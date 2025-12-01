'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure
} from '@/store/slices/dashboardSlice';
import { usersAPI } from '@/services/api';

// Import new dashboard components
import HeroBanner from '@/components/dashboard/HeroBanner';
import DailyPlanSection from '@/components/dashboard/DailyPlanSection';
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel';
import PerformanceDashboard from '@/components/dashboard/PerformanceDashboard';
import GamificationHub from '@/components/dashboard/GamificationHub';
import QuickActionsDock from '@/components/dashboard/QuickActionsDock';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { stats, progress, loading, error } = useSelector((state) => state.dashboard);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      dispatch(fetchDashboardStart());
      const [statsResponse, progressResponse] = await Promise.all([
        usersAPI.getProfile(),
        usersAPI.getProgress()
      ]);
      dispatch(fetchDashboardSuccess({
        stats: statsResponse.data.stats,
        progress: progressResponse.data
      }));
    } catch (error) {
      dispatch(fetchDashboardFailure(error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-base-content mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-error mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Banner */}
        <HeroBanner user={user} stats={stats} />

        {/* Quick Actions Dock */}
        <div className="mt-6">
          <QuickActionsDock />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Daily Plan */}
            <DailyPlanSection stats={stats} />

            {/* Performance Dashboard */}
            <PerformanceDashboard stats={stats} progress={progress} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Insights Panel */}
            <AIInsightsPanel stats={stats} />

            {/* Gamification Hub */}
            <GamificationHub stats={stats} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
