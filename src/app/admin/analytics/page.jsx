"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  MetricCard,
} from "@/components/admin/AnalyticsCharts";

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const analyticsRes = await fetch("/api/admin/analytics");
      const analytics = await analyticsRes.json();
      setAnalyticsData(analytics);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Performance
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor your app's growth and user engagement.
          </p>
        </div>
      </div>

      {/* Overview Content */}
      {analyticsData && (
        <div className="space-y-8 transition-all duration-500 ease-in-out">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Active Users (7d)"
              value={analyticsData.metrics.activeUsers}
              trend="up"
              change={12} // Placeholder change
            />
            <MetricCard
              title="Active Sessions (24h)"
              value={analyticsData.metrics.activeSessions}
              trend="neutral"
            />
            <MetricCard
              title="Premium Conversion"
              value={`${analyticsData.metrics.conversionRate}%`}
              trend="up"
              change={2.5}
            />
            <MetricCard
              title="Total Questions Answered"
              value={analyticsData.metrics.totalQuestions.toLocaleString()}
              trend="up"
            />
          </div>
          
          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={analyticsData.metrics.totalUsers}
              trend="up"
            />
            <MetricCard
              title="New Users (30d)"
              value={analyticsData.metrics.newUsers}
              trend="neutral"
            />
            <MetricCard
              title="Avg. Session Score"
              value={`${analyticsData.metrics.averageScore}%`}
              trend="neutral"
            />
            <MetricCard
              title="Session Completion Rate"
              value={`${analyticsData.metrics.completionRate}%`}
              trend="neutral"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Traffic Trends
              </h3>
              <LineChart data={analyticsData.charts.traffic} />
            </div>

            {/* Device Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Device Distribution
              </h3>
              <div className="flex justify-center">
                <PieChart
                  data={analyticsData.charts.devices.map((d, i) => ({
                    ...d,
                    color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][i % 5],
                  }))}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {analyticsData.charts.devices.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
                          i % 5
                        ],
                      }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {d.label} ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Subjects */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Top Subjects
              </h3>
              <BarChart data={analyticsData.charts.subjects} height={250} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
