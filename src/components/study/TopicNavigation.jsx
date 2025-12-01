'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Book, Lock, CheckCircle, Menu, X } from 'lucide-react';

export default function TopicNavigation({ topics, currentTopicId, onSelectTopic }) {
    const [isOpen, setIsOpen] = useState(false);

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-base-200">
                <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary" />
                    Course Content
                </h3>
                <p className="text-xs text-base-content/60 mt-1">
                    {topics.filter(t => t.completed).length} / {topics.length} completed
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {topics.map((topic, index) => {
                    const isActive = topic.id === currentTopicId;
                    const isLocked = topic.locked;

                    return (
                        <button
                            key={topic.id}
                            onClick={() => {
                                if (!isLocked) {
                                    onSelectTopic(topic.id);
                                    setIsOpen(false);
                                }
                            }}
                            disabled={isLocked}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group
                                ${isActive
                                    ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
                                    : isLocked
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-base-200 text-base-content'
                                }
                            `}
                        >
                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold
                                ${isActive
                                    ? 'bg-white/20 text-white'
                                    : topic.completed
                                        ? 'bg-success/10 text-success'
                                        : 'bg-base-300 text-base-content/60'
                                }
                            `}>
                                {topic.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                                    {topic.title}
                                </p>
                                <p className={`text-[10px] truncate ${isActive ? 'text-white/70' : 'text-base-content/50'}`}>
                                    {topic.duration}
                                </p>
                            </div>

                            {isLocked && <Lock className="w-4 h-4 text-base-content/40" />}
                            {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 h-[calc(100vh-5rem)] sticky top-20 bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
                <NavContent />
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden fixed bottom-20 right-4 z-30">
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary btn-circle shadow-lg shadow-primary/30"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Bottom Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 h-[70vh] bg-base-100 rounded-t-3xl z-50 lg:hidden overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="flex justify-center p-2">
                                <div className="w-12 h-1.5 bg-base-300 rounded-full" />
                            </div>
                            <NavContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
