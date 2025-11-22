'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure
} from '../../store/slices/dashboardSlice';
import { usersAPI } from '../../services/api';
import AnalyticsChart from '../../components/AnalyticsChart';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, progress, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-base-content/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Error loading dashboard: {error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn btn-primary rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-base-content mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
            <div className="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-3">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-base-content/70">Total Questions</p>
                  <p className="text-2xl font-bold text-base-content">{stats.totalQuestions}</p>
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-3">
              <div className="flex items-center">
                <div className="bg-success/10 p-3 rounded-full">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-base-content/70">Exams Completed</p>
                  <p className="text-2xl font-bold text-base-content">{stats.completedExams}</p>
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-3">
              <div className="flex items-center">
                <div className="bg-accent/10 p-3 rounded-full">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-base-content/70">Average Score</p>
                  <p className="text-2xl font-bold text-base-content">{stats.averageScore}%</p>
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-3">
              <div className="flex items-center">
                <div className="bg-error/10 p-3 rounded-full">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-base-content/70">Weak Topics</p>
                  <p className="text-2xl font-bold text-base-content">{stats.weakTopics.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
            <div className="bg-base-200 rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-base-content mb-4">Progress Over Time</h2>
              <AnalyticsChart
                data={progress.map(p => ({ label: p.date, value: p.score }))}
                type="line"
              />
            </div>

            <div className="bg-base-200 rounded-x-l p-6 shadow">
              <h2 className="text-xl font-bold text-base-content mb-4">Subject Performance</h2>
              <AnalyticsChart
                data={[
                  { label: 'Mathematics', value: 85 },
                  { label: 'English', value: 78 },
                  { label: 'Physics', value: 92 },
                  { label: 'Chemistry', value: 88 },
                  { label: 'Biology', value: 76 }
                ]}
                type="bar"
              />
            </div>
          </div>

          {/* Weak Topics */}
          <div className="bg-base-100 rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-base-content mb-4">Areas for Improvement</h2>
              <p className="text-base-content/70">Great job! No weak areas identified.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.weakTopics.map((topic, index) => (
                  <div key={index} className="bg-base-200 border border-base-300 rounded-lg p-4">
                    <h3 className="font-semibold text-error">{topic.name}</h3>
                    <p className="text-sm text-error/80">Score: {topic.score}%</p>
                    <p className="text-sm text-base-content/70 mt-2">
                      Focus on practicing more questions in this area.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-base-100 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-base-content mb-4">Recent Activity</h2>
