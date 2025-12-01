'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, FileJson, CheckCircle, AlertCircle, Settings, Code, Trash2, Copy, Info } from 'lucide-react';

const SUBJECTS = [
    'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
    'Economics', 'Government', 'Literature', 'CRS', 'Geography',
];

const YEARS = Array.from({ length: 50 }, (_, i) => 2024 - i);

export default function AdminUploadPage() {
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        if (!subject || !year || !jsonInput || !adminKey) {
            toast.error('Please fill in all fields including Admin Key');
            return;
        }

        setIsLoading(true);

        try {
            let parsedQuestions;
            try {
                parsedQuestions = JSON.parse(jsonInput);
            } catch (e) {
                throw new Error('Invalid JSON format');
            }

            // Allow pasting just the array or the full object
            const questionsArray = Array.isArray(parsedQuestions)
                ? parsedQuestions
                : parsedQuestions.questions || parsedQuestions;

            if (!Array.isArray(questionsArray)) {
                throw new Error('JSON must contain an array of questions');
            }

            // Normalize questions before upload
            const normalizedQuestions = questionsArray.map(q => ({
                ...q,
                options: {
                    ...q.options,
                    E: q.options.E || ''
                },
                answer: q.answer ? q.answer : 'NO CORRECT OPTION'
            }));

            const payload = {
                subject,
                year: parseInt(year),
                questions: normalizedQuestions,
            };

            const response = await fetch('/api/admin/questions/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminKey}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            toast.success('Questions uploaded successfully!');
            setJsonInput(''); // Clear JSON on success
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyExample = () => {
        const example = `[
  {
    "qid": "mth-1978-001",
    "question": "Solve for x...",
    "options": { "A": "1", "B": "2", "C": "3", "D": "4", "E": "5" },
    "answer": "C",
    "explanation": "..."
  },
  {
    "qid": "mth-1978-002",
    "question": "Question with no correct option...",
    "options": { "A": "1", "B": "2", "C": "3", "D": "4" },
    "answer": "", 
    "explanation": "This will default to NO CORRECT OPTION"
  }
]`;
        setJsonInput(example);
        toast.success('Example copied to editor');
    };

    const clearEditor = () => {
        if (jsonInput && confirm('Are you sure you want to clear the editor?')) {
            setJsonInput('');
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-base-content">Question Upload</h1>
                        <p className="text-base-content/60 mt-1">Bulk import questions into the database</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm gap-2" onClick={copyExample}>
                            <Copy size={16} /> Load Example
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Configuration Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card bg-base-100 shadow-xl border border-base-300">
                            <div className="card-body p-6">
                                <h2 className="card-title text-lg flex items-center gap-2 mb-4 text-base-content">
                                    <Settings size={18} className="text-primary" />
                                    Configuration
                                </h2>

                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Subject</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        >
                                            <option value="">Select Subject</option>
                                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Year</span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                        >
                                            <option value="">Select Year</option>
                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>

                                    <div className="divider my-2"></div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium text-error flex items-center gap-2">
                                                Admin Key
                                                <span className="tooltip tooltip-right" data-tip="Required for write access">
                                                    <Info size={14} className="text-base-content/40" />
                                                </span>
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            className="input input-bordered w-full focus:border-error focus:ring-1 focus:ring-error"
                                            placeholder="Enter secret key"
                                            value={adminKey}
                                            onChange={(e) => setAdminKey(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        className="btn btn-primary w-full mt-4 shadow-lg shadow-primary/20"
                                        onClick={handleUpload}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <span className="loading loading-spinner"></span> : <><Upload size={18} /> Upload Data</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-warning shadow-sm text-sm bg-warning/10 border-warning/20 text-warning-content">
                            <AlertCircle size={18} />
                            <span>Warning: Existing questions for the selected Subject & Year will be replaced.</span>
                        </div>
                    </div>

                    {/* JSON Editor Panel */}
                    <div className="lg:col-span-2">
                        <div className="card bg-base-100 shadow-xl border border-base-300 h-full overflow-hidden">
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-200/50">
                                    <div className="flex items-center gap-2 font-medium text-base-content">
                                        <Code size={18} className="text-secondary" />
                                        JSON Payload
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="badge badge-ghost text-xs font-mono">JSON</div>
                                        <button
                                            className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                            onClick={clearEditor}
                                            disabled={!jsonInput}
                                        >
                                            <Trash2 size={14} /> Clear
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 relative group bg-[#1e1e1e]">
                                    <textarea
                                        className="w-full h-full min-h-[600px] p-6 bg-transparent text-[#e0e0e0] font-mono text-sm resize-none focus:outline-none leading-relaxed selection:bg-primary/30"
                                        placeholder="// Paste your JSON array here..."
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        spellCheck="false"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
