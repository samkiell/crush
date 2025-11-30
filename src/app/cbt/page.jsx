import React from 'react';
import { Monitor, Clock, CheckCircle, AlertCircle, BarChart2 } from 'lucide-react';

export default function CBTPage() {
    return (
        <div className="min-h-screen bg-base-200/50 pb-20 md:pb-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-secondary/10 via-base-100 to-primary/10 pt-8 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                                CBT Centre
                            </h1>
                            <p className="text-lg text-base-content/70 max-w-2xl">
                                Experience real-time Computer Based Tests simulation. Prepare for JAMB, WAEC, and other exams.
                            </p>
                        </div>
                        <button className="btn btn-primary btn-lg shadow-xl shadow-primary/20">
                            <Monitor className="w-5 h-5 mr-2" />
                            Take Mock Exam
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Available Tests */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-base-100 rounded-3xl shadow-sm border border-base-content/5 overflow-hidden">
                            <div className="p-6 border-b border-base-content/5 flex items-center justify-between">
                                <h3 className="font-bold text-lg">Available Exams</h3>
                                <span className="badge badge-primary badge-outline">Updated Today</span>
                            </div>
                            <div className="divide-y divide-base-content/5">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="p-6 hover:bg-base-200/50 transition-colors group cursor-pointer">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                                    J
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">JAMB Full Mock {item}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h 00m</span>
                                                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 180 Questions</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn btn-ghost btn-sm group-hover:bg-primary group-hover:text-white">Start</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Info */}
                    <div className="space-y-6">
                        {/* Performance Summary */}
                        <div className="bg-base-100 rounded-3xl shadow-sm border border-base-content/5 p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-secondary" />
                                Performance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Tests Taken</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Average Score</span>
                                    <span className="font-bold text-primary">0%</span>
                                </div>
                                <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                                    <div className="bg-primary h-full w-0"></div>
                                </div>
                                <p className="text-xs text-center text-base-content/50 mt-2">
                                    Take a test to see your analytics
                                </p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-primary/5 rounded-3xl border border-primary/10 p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                                <AlertCircle className="w-5 h-5" />
                                Instructions
                            </h3>
                            <ul className="space-y-3 text-sm text-base-content/80">
                                <li className="flex gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                                    Ensure you have a stable internet connection.
                                </li>
                                <li className="flex gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                                    Do not refresh the page during the exam.
                                </li>
                                <li className="flex gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                                    Submit before the timer runs out.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
