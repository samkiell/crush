'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Trash2, Edit2, Save, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const SUBJECTS = [
    'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
    'Economics', 'Government', 'Literature', 'CRS', 'Geography'
];

const YEARS = Array.from({ length: 50 }, (_, i) => 2024 - i);

export default function ManageQuestionsPage() {
    // State
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [adminKey, setAdminKey] = useState(''); // Simple auth for now

    // Fetch Questions
    const fetchQuestions = async () => {
        if (!filterSubject || !filterYear) return;

        setLoading(true);
        try {
            const params = new URLSearchParams({
                subject: filterSubject,
                year: filterYear,
                page,
                limit: 20
            });

            const res = await fetch(`/api/questions?${params}`);
            const data = await res.json();

            if (res.ok) {
                setQuestions(data.questions);
                // Assuming API returns total count, calculate pages. 
                // Note: The current GET /api/questions returns all questions for subject/year without pagination metadata in the root object (it returns {subject, year, total, questions}).
                // We might need to handle client-side pagination if the API returns everything, or update API.
                // For now, let's assume it returns all and we paginate client side or just show all.
                // The current API implementation returns ALL questions for a subject/year.
                setTotalPages(1);
            } else {
                toast.error(data.message || 'Failed to fetch questions');
            }
        } catch (error) {
            toast.error('Error fetching questions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterSubject && filterYear) {
            fetchQuestions();
        }
    }, [filterSubject, filterYear]);

    // Delete Question
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        if (!adminKey) {
            toast.error('Please enter Admin Key at top of page to perform actions');
            return;
        }

        try {
            const res = await fetch(`/api/admin/questions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminKey}` }
            });

            if (res.ok) {
                toast.success('Question deleted');
                setQuestions(questions.filter(q => q._id !== id));
            } else {
                const data = await res.json();
                toast.error(data.message || 'Delete failed');
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    // Start Editing
    const handleEdit = (question) => {
        setEditingId(question._id);
        setEditForm({ ...question });
    };

    // Cancel Editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    // Save Changes
    const handleSave = async () => {
        if (!adminKey) {
            toast.error('Please enter Admin Key');
            return;
        }

        try {
            const res = await fetch(`/api/admin/questions/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminKey}`
                },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                toast.success('Question updated');
                setQuestions(questions.map(q => q._id === editingId ? editForm : q));
                setEditingId(null);
            } else {
                const data = await res.json();
                toast.error(data.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Update failed');
        }
    };

    // Filtered Questions (Client-side search)
    const filteredQuestions = questions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.qid.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Controls */}
                <div className="bg-base-100 rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Manage Questions</h1>
                            <p className="text-base-content/60">Edit, delete, and organize exam content</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                placeholder="Admin Key"
                                className="input input-bordered input-sm w-32"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            className="select select-bordered w-full"
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                        >
                            <option value="">Select Subject</option>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select
                            className="select select-bordered w-full"
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                        >
                            <option value="">Select Year</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                            <input
                                type="text"
                                placeholder="Search by question text or ID..."
                                className="input input-bordered w-full pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="text-center py-12 bg-base-100 rounded-xl">
                            <p className="text-base-content/60">No questions found. Select a subject and year.</p>
                        </div>
                    ) : (
                        filteredQuestions.map((q) => (
                            <div key={q._id} className="bg-base-100 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                                {editingId === q._id ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        const [questions, setQuestions] = useState([]);
                                        const [loading, setLoading] = useState(false);
                                        const [searchQuery, setSearchQuery] = useState('');
                                        const [filterSubject, setFilterSubject] = useState('');
                                        const [filterYear, setFilterYear] = useState('');
                                        const [page, setPage] = useState(1);
                                        const [totalPages, setTotalPages] = useState(1);
                                        const [editingId, setEditingId] = useState(null);
                                        const [editForm, setEditForm] = useState({ });
                                        const [adminKey, setAdminKey] = useState(''); // Simple auth for now

    // Fetch Questions
    const fetchQuestions = async () => {
        if (!filterSubject || !filterYear) return;

                                        setLoading(true);
                                        try {
            const params = new URLSearchParams({
                                            subject: filterSubject,
                                        year: filterYear,
                                        page,
                                        limit: 20
            });

                                        const res = await fetch(`/api/questions?${params}`);
                                        const data = await res.json();

                                        if (res.ok) {
                                            setQuestions(data.questions);
                // Assuming API returns total count, calculate pages.
                // Note: The current GET /api/questions returns all questions for subject/year without pagination metadata in the root object (it returns {subject, year, total, questions}).
                                        // We might need to handle client-side pagination if the API returns everything, or update API.
                                        // For now, let's assume it returns all and we paginate client side or just show all.
                                        // The current API implementation returns ALL questions for a subject/year.
                                        setTotalPages(1);
            } else {
                                            toast.error(data.message || 'Failed to fetch questions');
            }
        } catch (error) {
                                            toast.error('Error fetching questions');
        } finally {
                                            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterSubject && filterYear) {
                                            fetchQuestions();
        }
    }, [filterSubject, filterYear]);

    // Delete Question
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
                                        if (!adminKey) {
                                            toast.error('Please enter Admin Key at top of page to perform actions');
                                        return;
        }

                                        try {
            const res = await fetch(`/api/admin/questions/${id}`, {
                                            method: 'DELETE',
                                        headers: {'Authorization': `Bearer ${adminKey}` }
            });

                                        if (res.ok) {
                                            toast.success('Question deleted');
                setQuestions(questions.filter(q => q._id !== id));
            } else {
                const data = await res.json();
                                        toast.error(data.message || 'Delete failed');
            }
        } catch (error) {
                                            toast.error('Delete failed');
        }
    };

    // Start Editing
    const handleEdit = (question) => {
                                            setEditingId(question._id);
                                        setEditForm({...question});
    };

    // Cancel Editing
    const handleCancelEdit = () => {
                                            setEditingId(null);
                                        setEditForm({ });
    };

    // Save Changes
    const handleSave = async () => {
        if (!adminKey) {
                                            toast.error('Please enter Admin Key');
                                        return;
        }

                                        try {
            const res = await fetch(`/api/admin/questions/${editingId}`, {
                                            method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${adminKey}`
                },
                                        body: JSON.stringify(editForm)
            });

                                        if (res.ok) {
                                            toast.success('Question updated');
                setQuestions(questions.map(q => q._id === editingId ? editForm : q));
                                        setEditingId(null);
            } else {
                const data = await res.json();
                                        toast.error(data.message || 'Update failed');
            }
        } catch (error) {
                                            toast.error('Update failed');
        }
    };

    // Filtered Questions (Client-side search)
    const filteredQuestions = questions.filter(q =>
                                        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        q.qid.toLowerCase().includes(searchQuery.toLowerCase())
                                        );

                                        return (
                                        <div className="min-h-screen bg-base-200 p-4 md:p-8 pb-24">
                                            <div className="max-w-7xl mx-auto space-y-6">

                                                {/* Header & Controls */}
                                                <div className="bg-base-100 rounded-xl shadow-sm p-6">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                                        <div>
                                                            <h1 className="text-2xl font-bold">Manage Questions</h1>
                                                            <p className="text-base-content/60">Edit, delete, and organize exam content</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="password"
                                                                placeholder="Admin Key"
                                                                className="input input-bordered input-sm w-32"
                                                                value={adminKey}
                                                                onChange={(e) => setAdminKey(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <select
                                                            className="select select-bordered w-full"
                                                            value={filterSubject}
                                                            onChange={(e) => setFilterSubject(e.target.value)}
                                                        >
                                                            <option value="">Select Subject</option>
                                                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>

                                                        <select
                                                            className="select select-bordered w-full"
                                                            value={filterYear}
                                                            onChange={(e) => setFilterYear(e.target.value)}
                                                        >
                                                            <option value="">Select Year</option>
                                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>

                                                        <div className="md:col-span-2 relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                                                            <input
                                                                type="text"
                                                                placeholder="Search by question text or ID..."
                                                                className="input input-bordered w-full pl-10"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Questions List */}
                                                <div className="space-y-4">
                                                    {loading ? (
                                                        <div className="text-center py-12">
                                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                                        </div>
                                                    ) : filteredQuestions.length === 0 ? (
                                                        <div className="text-center py-12 bg-base-100 rounded-xl">
                                                            <p className="text-base-content/60">No questions found. Select a subject and year.</p>
}
