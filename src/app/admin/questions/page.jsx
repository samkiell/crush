'use client';

import { useState } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function QuestionsPage() {
    const [activeTab, setActiveTab] = useState('upload');
    const [jsonFile, setJsonFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/json') {
                toast.error('Please upload a JSON file');
                return;
            }
            setJsonFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target.result);
                    setPreview(content);
                } catch (err) {
                    toast.error('Invalid JSON format');
                    setJsonFile(null);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleUpload = async () => {
        if (!jsonFile || !preview) return;

        setUploading(true);
        try {
            const res = await fetch('/api/admin/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preview),
            });

            if (res.ok) {
                toast.success('Questions uploaded successfully!');
                setJsonFile(null);
                setPreview(null);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error', error);
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto pb-24 md:pb-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Database className="w-6 h-6 text-primary" />
                    Question Management
                </h1>
                <p className="text-base-content/60">Upload and manage exam questions</p>
            </div>

            <div className="tabs tabs-boxed bg-base-100 p-1 mb-6 inline-flex">
                <button
                    className={`tab ${activeTab === 'upload' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('upload')}
                >
                    Upload JSON
                </button>
                <button
                    className={`tab ${activeTab === 'manage' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('manage')}
                >
                    Manage Questions
                </button>
            </div>

            {activeTab === 'upload' && (
                <div className="bg-base-100 border border-base-200 rounded-2xl p-8 shadow-sm">
                    <div className="border-2 border-dashed border-base-300 rounded-xl p-10 text-center hover:border-primary transition-colors bg-base-200/30">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="hidden"
                            id="json-upload"
                        />
                        <label htmlFor="json-upload" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <FileJson className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    {jsonFile ? jsonFile.name : 'Click to upload JSON'}
                                </h3>
                                <p className="text-sm text-base-content/60 mt-1">
                                    {jsonFile ? `${(jsonFile.size / 1024).toFixed(2)} KB` : 'Supports standard question format'}
                                </p>
                            </div>
                        </label>
                    </div>

                    {preview && (
                        <div className="mt-6">
                            <div className="alert alert-info shadow-sm mb-4">
                                <CheckCircle className="w-5 h-5" />
                                <span>Ready to upload {Array.isArray(preview) ? preview.length : 'multiple'} questions.</span>
                            </div>

                            <div className="bg-base-900 text-base-content p-4 rounded-xl max-h-60 overflow-y-auto font-mono text-xs border border-base-300">
                                <pre>{JSON.stringify(preview, null, 2).substring(0, 500)}...</pre>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn btn-primary w-full mt-6"
                            >
                                {uploading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Upload Questions
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'manage' && (
                <div className="text-center py-20 bg-base-100 border border-base-200 rounded-2xl">
                    <AlertCircle className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                    <h3 className="text-lg font-bold">Coming Soon</h3>
                    <p className="text-base-content/60">Question editing interface is under development.</p>
                </div>
            )}
        </div>
    );
}
