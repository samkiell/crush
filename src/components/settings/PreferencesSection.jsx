'use client';

import { useState } from 'react';
import { Moon, Sun, Eye, Bell, Globe, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '@/utils/theme';

export default function PreferencesSection({ user, onUpdate }) {
  const { setTheme } = useTheme();
  const [preferences, setPreferences] = useState(user?.preferences || {
    theme: 'light',
    notifications: { email: true, push: true, marketing: false },
    language: 'en',
  });
  const [examType, setExamType] = useState(user?.examType || 'JAMB');
  const [loading, setLoading] = useState(false);

  const handleThemeChange = (theme) => {
    setPreferences({ ...preferences, theme });
    setTheme(theme); // Apply immediately
    updatePreferences({ theme });
  };

  const handleNotificationChange = (key) => {
    const newNotifs = { ...preferences.notifications, [key]: !preferences.notifications[key] };
    setPreferences({ ...preferences, notifications: newNotifs });
    updatePreferences({ notifications: newNotifs });
  };

  const updatePreferences = async (updates) => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!res.ok) throw new Error('Failed to update preferences');
      
      toast.success('Preferences saved');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Theme Section */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PaletteIcon className="w-5 h-5 text-primary" />
          Appearance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light Mode', icon: Sun, bg: 'bg-white', text: 'text-gray-900' },
            { id: 'dark', label: 'Dark Mode', icon: Moon, bg: 'bg-gray-900', text: 'text-white' },
            { id: 'eye-care', label: 'Eye Care', icon: Eye, bg: 'bg-[#F5F5DC]', text: 'text-[#4A4A4A]' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left
                ${preferences.theme === theme.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-base-200 hover:border-base-300'
                }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.bg} ${theme.text} shadow-sm`}>
                <theme.icon size={20} />
              </div>
              <div>
                <div className="font-semibold">{theme.label}</div>
                <div className="text-xs opacity-60">
                  {theme.id === 'eye-care' ? 'Warm tones' : theme.id === 'dark' ? 'Low light' : 'Classic'}
                </div>
              </div>
              {preferences.theme === theme.id && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Notifications */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm opacity-70">Receive updates about your exams and progress</div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={preferences.notifications.email}
              onChange={() => handleNotificationChange('email')}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl">
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm opacity-70">Get real-time alerts on your device</div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={preferences.notifications.push}
              onChange={() => handleNotificationChange('push')}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl">
            <div>
              <div className="font-medium">Marketing & Tips</div>
              <div className="text-sm opacity-70">Receive study tips and promotional offers</div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={preferences.notifications.marketing}
              onChange={() => handleNotificationChange('marketing')}
            />
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Exam & Language */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Exam Preference
          </h3>
          <select 
            className="select select-bordered w-full"
            value={examType}
            onChange={(e) => {
              setExamType(e.target.value);
              updatePreferences({ examType: e.target.value });
            }}
          >
            <option value="JAMB">JAMB (Joint Admissions and Matriculation Board)</option>
            {/* Disabled for now as per requirement */}
            <option value="WAEC" disabled>WAEC (Coming Soon)</option>
            <option value="NECO" disabled>NECO (Coming Soon)</option>
          </select>
          <p className="text-xs mt-2 opacity-60">Currently only JAMB is supported.</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Language
          </h3>
          <select 
            className="select select-bordered w-full"
            value={preferences.language}
            onChange={(e) => {
              setPreferences({ ...preferences, language: e.target.value });
              updatePreferences({ language: e.target.value });
            }}
          >
            <option value="en">English</option>
            <option value="fr" disabled>French (Coming Soon)</option>
            <option value="ha" disabled>Hausa (Coming Soon)</option>
            <option value="yo" disabled>Yoruba (Coming Soon)</option>
            <option value="ig" disabled>Igbo (Coming Soon)</option>
          </select>
        </div>
      </section>
    </div>
  );
}

function PaletteIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
  );
}
