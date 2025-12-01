'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, FileJson, CheckCircle, AlertCircle } from 'lucide-react';

const SUBJECTS = [
    'Mathematics',
    'English',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Government',
    'Literature',
    'CRS',
    'Geography',
];

const YEARS = Array.from({ length: 50 }, (_, i) => 2024 - i); // 2024 down to 1975

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

            const payload = {
                subject,
                year: parseInt(year),
                questions: questionsArray,
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

    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="max-w-4xl mx-auto bg-base-100 rounded-xl shadow-xl p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-base-300 pb-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <Upload size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Upload Exam Questions</h1>
                        <p className="text-base-content/60">Bulk upload questions for JAMB preparation</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Subject</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            <option value="">Select Subject</option>
                            {SUBJECTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Year</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="">Select Year</option>
                            {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Admin Key</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered w-full"
                            placeholder="Enter Admin Secret"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-control mb-8">
                    <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                            <FileJson size={16} />
                            JSON Payload
                        </span>
                        <span className="label-text-alt text-base-content/60">
                            Paste the questions array or full object here
                        </span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered h-96 font-mono text-sm leading-relaxed"
                        placeholder={`[
  {
    "qid": "mth-1978-001",
    "question": "Solve for x...",
    "options": { "A": "1", "B": "2", "C": "3", "D": "4", "E": "5" },
    "answer": "C",
    "explanation": "..."
  }
]`}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        className="btn btn-primary min-w-[150px]"
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <Upload size={18} />
                                Upload Questions
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
