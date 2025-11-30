'use client';

import { useState } from 'react';
import { User, Shield, Palette, Database } from 'lucide-react';

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data & Activity', icon: Database },
];

export default function SettingsLayout({ children, activeTab, onTabChange }) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-base-200/50">
            {/* Sidebar / Mobile Tabs */}
            <aside className="w-full lg:w-64 bg-base-100 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-base-300 sticky top-0 z-20">
                <div className="p-4 lg:p-6">
                    <h1 className="text-2xl font-bold text-base-content hidden lg:block">Settings</h1>
                </div>

                <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible px-4 lg:px-2 pb-2 lg:pb-0 gap-2 lg:gap-1 no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap
                  ${isActive
                                        ? 'bg-primary text-primary-content shadow-md'
                                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full">
                <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 min-h-[500px]">
                    {children}
                </div>
            </main>
        </div>
    );
}
