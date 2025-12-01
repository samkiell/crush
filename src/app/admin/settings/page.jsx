'use client';

import { Settings, Save, Bell, Lock, Globe, Database } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="w-6 h-6 text-warning" />
                    System Settings
                </h1>
                <p className="text-base-content/60">Configure global application settings</p>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-primary" />
                            General Configuration
                        </h3>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Site Name</span>
                            </label>
                            <input type="text" placeholder="Type here" className="input input-bordered w-full" defaultValue="CrushEdu" />
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Maintenance Mode</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <input type="checkbox" className="toggle toggle-warning" />
                                <span className="text-sm text-base-content/60">Enable to prevent user access during updates</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                            <Lock className="w-5 h-5 text-error" />
                            Security & Access
                        </h3>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                                <span className="label-text">Allow new user registrations</span>
                            </label>
                        </div>

                        <div className="form-control mt-2">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                                <span className="label-text">Require email verification</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Database Settings */}
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                            <Database className="w-5 h-5 text-secondary" />
                            Data Management
                        </h3>

                        <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl">
                            <div>
                                <h4 className="font-bold">Clear Cache</h4>
                                <p className="text-xs text-base-content/60">Remove temporary system files</p>
                            </div>
                            <button className="btn btn-sm btn-outline">Clear Now</button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button className="btn btn-ghost">Discard Changes</button>
                    <button className="btn btn-primary gap-2">
                        <Save className="w-4 h-4" />
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
