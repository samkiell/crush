"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  MetricCard,
} from "@/components/admin/AnalyticsCharts";
import { assignVariant, setExperimentAssignment, trackExperiment } from "@/lib/abTesting";

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateExp, setShowCreateExp] = useState(false);
  
  // New Experiment Form State
  const [newExp, setNewExp] = useState({
    name: "",
    description: "",
    variants: [{ name: "control", weight: 50 }, { name: "variant-a", weight: 50 }],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, experimentsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/experiments"),
      ]);

      const analytics = await analyticsRes.json();
      const exps = await experimentsRes.json();

      setAnalyticsData(analytics);
      setExperiments(exps.experiments || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperiment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExp),
      });
      
      if (res.ok) {
        setShowCreateExp(false);
        fetchData(); // Refresh list
        // Reset form
        setNewExp({
            name: "",
            description: "",
            variants: [{ name: "control", weight: 50 }, { name: "variant-a", weight: 50 }],
            startDate: "",
            endDate: "",
        });
      }
    } catch (error) {
      console.error("Failed to create experiment", error);
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...newExp.variants];
    updatedVariants[index][field] = value;
    setNewExp({ ...newExp, variants: updatedVariants });
  };

  const addVariant = () => {
    setNewExp({
      ...newExp,
      variants: [...newExp.variants, { name: `variant-${String.fromCharCode(98 + newExp.variants.length)}`, weight: 0 }]
    });
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
            Monitor your app's growth and manage experiments.
          </p>
        </div>
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("experiments")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "experiments"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            A/B Testing
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && analyticsData && (
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

      {/* Experiments Tab */}
      {activeTab === "experiments" && (
        <div className="space-y-6 transition-all duration-500 ease-in-out">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Active Experiments
            </h2>
            <button
              onClick={() => setShowCreateExp(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + New Experiment
            </button>
          </div>

          {/* Create Experiment Modal/Form */}
          {showCreateExp && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Create New Experiment</h3>
              <form onSubmit={handleCreateExperiment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={newExp.name}
                    onChange={(e) => setNewExp({ ...newExp, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Variants</label>
                  {newExp.variants.map((variant, idx) => (
                    <div key={idx} className="flex gap-4 mb-2">
                      <input
                        type="text"
                        placeholder="Variant Name"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Weight %"
                        className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(idx, "weight", parseInt(e.target.value))}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addVariant} className="text-sm text-blue-600 hover:text-blue-500">
                    + Add Variant
                  </button>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateExp(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Experiment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Experiments List */}
          <div className="grid gap-4">
            {experiments.map((exp) => (
              <div
                key={exp._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {exp.name}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        exp.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {exp.status}
                      </span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {exp.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {exp.metrics?.impressions || 0}
                    </div>
                    <div className="text-xs text-gray-500">Impressions</div>
                  </div>
                </div>

                {/* Results Preview */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Results</h4>
                  <div className="space-y-3">
                    {exp.variants.map((variant) => {
                      // Calculate conversion rate for this variant (mock logic if results structure is complex)
                      // In real app, we'd parse exp.results map
                      const variantResults = exp.results?.[variant.name] || { impressions: 0, conversions: 0 };
                      const rate = variantResults.impressions > 0 
                        ? ((variantResults.conversions / variantResults.impressions) * 100).toFixed(1) 
                        : 0;
                      
                      return (
                        <div key={variant.name} className="flex items-center gap-4">
                          <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                            {variant.name}
                          </div>
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${Math.min(rate * 5, 100)}%` }} // Scale for visibility
                            />
                          </div>
                          <div className="w-16 text-right text-sm font-bold text-gray-900 dark:text-white">
                            {rate}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {experiments.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No experiments found. Create one to get started!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
