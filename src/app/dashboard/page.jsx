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

// Import new dashboard layers
import MomentumLayer from '@/components/dashboard/MomentumLayer';
import ProgressLayer from '@/components/dashboard/ProgressLayer';
import DeepDiveLayer from '@/components/dashboard/DeepDiveLayer';

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
        <span className="loading loading-spinner loading-lg text-primary"></span>
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
    <div className="min-h-screen bg-base-100 pb-20 md:pb-6">
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">

        {/* 1. Momentum Layer (Above the fold) */}
        <section>
          <MomentumLayer user={user} stats={stats} />
        </section>

        {/* 2. Progress Layer */}
        <section>
          <ProgressLayer stats={stats} progress={progress} />
        </section>

        {/* 3. Deep Dive Layer (Collapsible) */}
        <section>
          <DeepDiveLayer stats={stats} user={user} />
        </section>

      </div>
    </div>
  );
}
