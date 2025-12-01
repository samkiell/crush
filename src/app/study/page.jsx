'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Layers, Lock, Sparkles, ChevronRight, GraduationCap } from 'lucide-react';

// Mock Data for Icons and Display Names
const SUBJECTS = [
    { id: 'math', name: 'Mathematics', icon: '📐' },
    { id: 'eng', name: 'English Language', icon: '📚' },
    { id: 'phy', name: 'Physics', icon: '⚡' },
    { id: 'chem', name: 'Chemistry', icon: '🧪' },
    { id: 'bio', name: 'Biology', icon: '🧬' },
    { id: 'govt', name: 'Government', icon: '🏛️' },
    { id: 'econ', name: 'Economics', icon: '📈' },
    { id: 'lit', name: 'Literature', icon: '📖' },
    { id: 'crs', name: 'CRS', icon: '✝️' },
    { id: 'geo', name: 'Geography', icon: '🌍' },
];

export default function StudySetupPage() {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const [availableMetadata, setAvailableMetadata] = useState({});
    const [availableYears, setAvailableYears] = useState([]);
    const [loadingMetadata, setLoadingMetadata] = useState(true);

    useEffect(() => {
        if (user) {
            setIsPremium(user.isPremium || user.plan === 'premium' || false);
        }
    }, [user]);

    // Fetch Metadata (Subjects & Years)
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem('study_metadata');
                const cachedTime = localStorage.getItem('study_metadata_time');
                const ONE_HOUR = 60 * 60 * 1000;

                if (cached && cachedTime && (Date.now() - parseInt(cachedTime) < ONE_HOUR)) {
                    setAvailableMetadata(JSON.parse(cached));
                    setLoadingMetadata(false);
                }

                // Fetch fresh data
                const res = await fetch('/api/study/metadata');
                if (res.ok) {
                    const data = await res.json();
                    setAvailableMetadata(data.metadata);
                    localStorage.setItem('study_metadata', JSON.stringify(data.metadata));
                    localStorage.setItem('study_metadata_time', Date.now().toString());
                }
            } catch (error) {
                console.error('Failed to fetch metadata', error);
            } finally {
                setLoadingMetadata(false);
            }
        };

        fetchMetadata();
    }, []);

    // Update available years when subject changes
    useEffect(() => {
        if (selectedSubject && availableMetadata[selectedSubject]) {
            setAvailableYears(availableMetadata[selectedSubject]);
            setSelectedYear(''); // Reset year
        } else {
            setAvailableYears([]);
        }
    }, [selectedSubject, availableMetadata]);

    const handleStartStudy = () => {
        if (!selectedSubject || !selectedYear) return;
        setIsStarting(true);
        // Default to 'all-topics' if no topic selected
        const topicSlug = selectedTopic ? selectedTopic.toLowerCase().replace(/\s+/g, '-') : 'all-topics';
        const slug = `${selectedSubject}-${selectedYear}-${topicSlug}`;
        router.push(`/study/${slug}`);
    };

    const isYearLocked = (year) => {
        if (isPremium) return false;
        // Free users only get access to years 1978-1988
        const yearNum = parseInt(year);
        return yearNum < 1978 || yearNum > 1988;
    };

    return (
        <div className="min-h-screen bg-base-100 pb-20 md:pb-8 pt-6 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
                    >
                        <GraduationCap className="w-5 h-5" />
                        <span className="font-semibold text-sm">Study Mode</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Configure Your Session
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base-content/60 max-w-lg mx-auto"
                    >
                        Select your subject and year to start practicing. Content is fetched directly from our database.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Subject Selection */}
                        <div className="bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Select Subject
                            </h3>
                            {loadingMetadata ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="h-24 rounded-xl bg-base-200 animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {SUBJECTS.map((subject) => {
                                        // Find matching key in metadata
                                        const dbKey = Object.keys(availableMetadata).find(k =>
                                            k.toLowerCase().includes(subject.name.toLowerCase()) ||
                                            subject.name.toLowerCase().includes(k.toLowerCase())
                                        );

                                        const hasData = !!dbKey;
                                        const subjectKey = dbKey || subject.name.toLowerCase();

                                        return (
                                            <button
                                                key={subject.id}
                                                disabled={!hasData}
                                                onClick={() => {
                                                    setSelectedSubject(subjectKey);
                                                    setSelectedTopic('');
                                                }}
                                                className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-2 ${selectedSubject === subjectKey
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                    : hasData
                                                        ? 'border-base-200 hover:border-primary/50 hover:bg-base-200/50'
                                                        : 'border-base-200 opacity-50 cursor-not-allowed bg-base-200/30'
                                                    }`}
                                            >
                                                <span className="text-2xl">{subject.icon}</span>
                                                <span className="font-medium text-sm">{subject.name}</span>
                                                {!hasData && <span className="text-[10px] text-error">No Data</span>}
                                            </button>
                                        );
                                    })}

                                    {/* Show other subjects from DB that might not be in our icon list */}
                                    {Object.keys(availableMetadata).map(key => {
                                        const isMapped = SUBJECTS.some(s =>
                                            key.toLowerCase().includes(s.name.toLowerCase()) ||
                                            s.name.toLowerCase().includes(key.toLowerCase())
                                        );

                                        if (isMapped) return null;

                                        return (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    setSelectedSubject(key);
                                                    setSelectedTopic('');
                                                }}
                                                className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-2 ${selectedSubject === key
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                    : 'border-base-200 hover:border-primary/50 hover:bg-base-200/50'
                                                    }`}
                                            >
                                                <span className="text-2xl">📝</span>
                                                <span className="font-medium text-sm capitalize">{key}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Year Selection */}
                        <div className="bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-secondary" />
                                    Select Year
                                </h3>
                                {!isPremium && (
                                    <span className="text-xs font-medium px-2 py-1 bg-base-200 rounded-lg text-base-content/60 flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Limited Access
                                    </span>
                                )}
                            </div>

                            {!selectedSubject ? (
                                <div className="text-center py-8 text-base-content/40 text-sm">
                                    Please select a subject first.
                                </div>
                            ) : availableYears.length === 0 ? (
                                <div className="text-center py-8 text-base-content/40 text-sm">
                                    No years found for this subject.
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {availableYears.map((year) => {
                                        const locked = isYearLocked(year);
                                        return (
                                            <button
                                                key={year}
                                                disabled={locked}
                                                onClick={() => setSelectedYear(year)}
                                                className={`p-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden ${selectedYear === year
                                                    ? 'bg-secondary text-secondary-content shadow-lg shadow-secondary/20 ring-2 ring-secondary ring-offset-2'
                                                    : locked
                                                        ? 'bg-base-200/50 text-base-content/30 cursor-not-allowed'
                                                        : 'bg-base-100 hover:bg-base-200 text-base-content'
                                                    }`}
                                            >
                                                {year}
                                                {locked && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-base-200/80 backdrop-blur-[1px]">
                                                        <Lock className="w-3 h-3 text-base-content/40" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {!isPremium && (
                                <div className="mt-4 p-3 bg-base-200/50 rounded-xl text-xs text-center text-base-content/60">
                                    Upgrade to Premium to unlock all years (2021-2024).
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column: Summary & Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-6">
                            <div className="bg-base-100 border border-base-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

                                <h3 className="text-xl font-bold mb-6 relative z-10">Session Summary</h3>

                                <div className="space-y-4 mb-8 relative z-10">
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-base-200/50">
                                        <span className="text-sm text-base-content/60">Subject</span>
                                        <span className="font-semibold capitalize">
                                            {selectedSubject || '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-base-200/50">
                                        <span className="text-sm text-base-content/60">Year</span>
                                        <span className="font-semibold">{selectedYear || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-base-200/50">
                                        <span className="text-sm text-base-content/60">Topic</span>
                                        <span className="font-semibold text-right max-w-[150px] truncate">
                                            {selectedTopic || 'All Topics'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartStudy}
                                    disabled={!selectedSubject || !selectedYear || isStarting}
                                    className="btn btn-primary w-full rounded-xl h-14 text-lg font-bold shadow-lg shadow-primary/20 disabled:bg-base-300 disabled:text-base-content/40 flex items-center justify-center gap-2"
                                >
                                    {isStarting ? (
                                        <>
                                            <span className="loading loading-spinner loading-md"></span>
                                            Preparing...
                                        </>
                                    ) : (
                                        <>
                                            Start Study
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {!isPremium && (
                                    <div className="mt-6 pt-6 border-t border-base-200 text-center relative z-10">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-3 shadow-lg shadow-orange-500/30">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold text-sm mb-1">Unlock Full Access</h4>
                                        <p className="text-xs text-base-content/60 mb-3">
                                            Get access to all years, advanced analytics, and AI tutoring.
                                        </p>
                                        <button className="btn btn-sm btn-outline w-full rounded-lg">
                                            Upgrade to Premium
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
