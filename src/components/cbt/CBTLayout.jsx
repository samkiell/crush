'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CBTLayout({
    header,
    sidebar, // Question Grid
    children, // Question Card
    footer, // Controls
    subjectName = "JAMB Mock Exam"
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-base-200 overflow-hidden">
            {/* Minimal Header */}
            <header className="h-16 bg-base-100 border-b border-base-content/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="font-bold text-xl text-primary">CrushEdu CBT</div>
                    <div className="h-6 w-px bg-base-content/10 hidden md:block"></div>
                    <h1 className="font-medium text-base-content/80 hidden md:block">{subjectName}</h1>
                </div>

                <button
                    className="md:hidden btn btn-ghost btn-circle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Sidebar (Desktop) */}
                <aside className="hidden md:block w-80 bg-base-100 border-r border-base-content/5 overflow-y-auto p-6 shrink-0">
                    {sidebar}
                </aside>

                {/* Sidebar (Mobile Drawer) */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="absolute inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                            />
                            <motion.aside
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="absolute right-0 top-0 bottom-0 w-80 bg-base-100 z-40 shadow-2xl p-6 overflow-y-auto"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg">Question Navigator</h3>
                                    <button onClick={() => setIsSidebarOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                {sidebar}
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Question Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
                    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer Controls */}
            <footer className="shrink-0 z-20">
                {footer}
            </footer>
        </div>
    );
}
