'use client';

import { useState } from 'react';
import { FileText, BookOpen, Layers, Edit, Trash2, Plus } from 'lucide-react';

export default function ContentOverviewPage() {
    const [activeTab, setActiveTab] = useState('subjects');

    const subjects = [
        { id: 'math', name: 'Mathematics', questions: 1250, lastUpdated: '2 days ago' },
        { id: 'eng', name: 'English Language', questions: 1500, lastUpdated: '1 week ago' },
        { id: 'phy', name: 'Physics', questions: 800, lastUpdated: '3 days ago' },
        { id: 'chem', name: 'Chemistry', questions: 850, lastUpdated: '5 days ago' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto pb-24 md:pb-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-accent" />
                        Content Overview
                    </h1>
                    <p className="text-base-content/60">Manage subjects, exams, and resources</p>
                </div>
                <button className="btn btn-primary gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Subject
                </button>
            </div>

            <div className="tabs tabs-boxed bg-base-100 p-1 mb-6 inline-flex">
                <button
                    className={`tab ${activeTab === 'subjects' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('subjects')}
                >
                    Subjects
                </button>
                <button
                    className={`tab ${activeTab === 'resources' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('resources')}
                >
                    Resources
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    <div key={subject.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="card-body">
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-3 bg-accent/10 text-accent rounded-xl">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
                                        <Layers className="w-4 h-4" />
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><a><Edit className="w-4 h-4" /> Edit</a></li>
                                        <li><a className="text-error"><Trash2 className="w-4 h-4" /> Delete</a></li>
                                    </ul>
                                </div>
                            </div>
                            <h3 className="card-title text-lg">{subject.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-base-content/60 mt-2">
                                <span>{subject.questions} Questions</span>
                                <span>•</span>
                                <span>Updated {subject.lastUpdated}</span>
                            </div>
                            <div className="card-actions justify-end mt-4">
                                <button className="btn btn-sm btn-outline w-full">Manage Content</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
