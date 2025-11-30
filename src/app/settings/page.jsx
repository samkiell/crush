'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import SettingsLayout from '@/components/settings/SettingsLayout';
import ProfileSection from '@/components/settings/ProfileSection';
import SecuritySection from '@/components/settings/SecuritySection';
import PreferencesSection from '@/components/settings/PreferencesSection';
import DataSection from '@/components/settings/DataSection';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (!res.ok) throw new Error('Failed to load settings');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error(error);
            toast.error('Could not load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            );
        }

        if (!settings) return null;

        switch (activeTab) {
            case 'profile':
                return <ProfileSection user={settings} onUpdate={fetchSettings} />;
            case 'security':
                return <SecuritySection user={settings} />;
            case 'preferences':
                return <PreferencesSection user={settings} onUpdate={fetchSettings} />;
            case 'data':
                return <DataSection />;
            default:
                return <ProfileSection user={settings} onUpdate={fetchSettings} />;
        }
    };

    return (
        <AuthGuard>
            <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
                {renderContent()}
            </SettingsLayout>
        </AuthGuard>
    );
}
