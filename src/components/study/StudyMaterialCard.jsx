'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Type, MoreHorizontal, CheckCircle2, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatedButton } from '@/components/ui';

export default function StudyMaterialCard({ title, content, progress, onBookmark, onComplete }) {
    const [fontSize, setFontSize] = useState(16); // Base font size
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        if (onBookmark) onBookmark(!isBookmarked);
    };

    const adjustFontSize = (delta) => {
        setFontSize(prev => Math.min(Math.max(prev + delta, 14), 24));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden relative"
        >
            {/* Progress Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-base-200">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                />
            </div>

            {/* Header Controls */}
            <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-100/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowControls(!showControls)}
                        className="btn btn-ghost btn-sm btn-circle"
                        title="Text Settings"
                    >
                        <Type className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                        {showControls && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-1 bg-base-200 rounded-full p-1"
                            >
                                <button 
                                    onClick={() => adjustFontSize(-2)}
                                    className="btn btn-ghost btn-xs btn-circle"
                                >
                                    <ZoomOut className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono w-6 text-center">{fontSize}</span>
                                <button 
                                    onClick={() => adjustFontSize(2)}
                                    className="btn btn-ghost btn-xs btn-circle"
                                >
                                    <ZoomIn className="w-3 h-3" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBookmark}
                        className={`btn btn-ghost btn-sm btn-circle transition-colors ${isBookmarked ? 'text-primary fill-primary/20' : 'text-base-content/60'}`}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="btn btn-ghost btn-sm btn-circle text-base-content/60">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-6 font-display leading-tight">
                    {title}
                </h1>
                
                <div 
                    className="prose prose-lg max-w-none prose-headings:font-display prose-p:leading-relaxed prose-p:text-base-content/80"
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {/* Render content safely - assuming plain text or simple HTML for now */}
                    {/* In a real app, use a markdown renderer or sanitize HTML */}
                    {content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            </div>

            {/* Footer / Completion */}
            <div className="p-6 border-t border-base-200 bg-base-50/50 flex justify-center">
                <AnimatedButton
                    variant={progress >= 100 ? "success" : "primary"}
                    onClick={onComplete}
                    className="w-full md:w-auto min-w-[200px]"
                    rightIcon={<CheckCircle2 className="w-5 h-5" />}
                >
                    {progress >= 100 ? 'Completed' : 'Mark as Complete'}
                </AnimatedButton>
            </div>
        </motion.div>
    );
}
