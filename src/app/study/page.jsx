import React from 'react';
import { BookOpen, Search, Filter, PlayCircle, Clock, Award } from 'lucide-react';

export default function StudyPage() {
    return (
        <div className="min-h-screen bg-base-200/50 pb-20 md:pb-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 pt-8 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                        Study Center
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl">
                        Access comprehensive study materials, past questions, and interactive lessons to master your subjects.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Study Materials Card */}
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-content/5 group">
                        <div className="card-body">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="card-title text-xl mb-2">Study Materials</h2>
                            <p className="text-base-content/60 mb-4">
                                Browse through curated notes, textbooks, and video lectures.
                            </p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary btn-sm">Explore</button>
                            </div>
                        </div>
                    </div>

                    {/* Practice Mode Card */}
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-content/5 group">
                        <div className="card-body">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-6 h-6 text-secondary" />
                            </div>
                            <h2 className="card-title text-xl mb-2">Practice Mode</h2>
                            <p className="text-base-content/60 mb-4">
                                Test your knowledge with topic-wise practice questions.
                            </p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-secondary btn-sm">Start Practice</button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Tracker Card */}
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-content/5 group">
                        <div className="card-body">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Award className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="card-title text-xl mb-2">Your Progress</h2>
                            <p className="text-base-content/60 mb-4">
                                Track your study hours and performance analytics.
                            </p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-accent btn-sm">View Stats</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary" />
                        Recent Activity
                    </h3>
                    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-content/5 p-6 text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-base-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-base-content/30" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2">No recent study activity</h4>
                            <p className="text-base-content/60 mb-6">Start studying to see your recent topics and progress here.</p>
                            <button className="btn btn-outline btn-primary">Browse Topics</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
