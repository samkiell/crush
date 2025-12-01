'use client';

import AnalyticsOverview from './AnalyticsOverview';
import PerformanceCharts from './PerformanceCharts';
import InsightsPanel from './InsightsPanel';

const AnalyticsDashboard = ({ stats, historyData, subjectData, insights }) => {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-base-content">Performance Analytics</h2>
                    <p className="text-base-content/60">Track your progress and identify areas for improvement.</p>
                </div>

                {/* Optional: Date Range Picker or Filter could go here */}
                <select className="select select-bordered select-sm w-full md:w-auto rounded-xl">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>All Time</option>
                </select>
            </div>

            {/* Overview Cards */}
            <AnalyticsOverview stats={stats} />

            {/* Charts & Insights Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <PerformanceCharts historyData={historyData} subjectData={subjectData} />
                </div>
                <div className="xl:col-span-1">
                    <InsightsPanel insights={insights} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
