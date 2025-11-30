'use client';

import { Download, Trash2, Database } from 'lucide-react';

export default function DataSection() {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Your Data
                </h3>
                <div className="bg-base-200/50 p-6 rounded-xl space-y-4">
                    <p className="text-sm opacity-70">
                        Download a copy of your data, including your profile, exam history, and activity logs.
                        This file will be in JSON format.
                    </p>
                    <button className="btn btn-outline gap-2">
                        <Download size={18} />
                        Download My Data
                    </button>
                </div>
            </section>

            <div className="divider" />

            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-error">
                    <Trash2 className="w-5 h-5" />
                    Clear Data
                </h3>
                <div className="bg-base-200/50 p-6 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">Clear Offline Content</div>
                            <div className="text-sm opacity-70">Remove downloaded questions and resources to free up space.</div>
                        </div>
                        <button className="btn btn-ghost text-error btn-sm">Clear</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
