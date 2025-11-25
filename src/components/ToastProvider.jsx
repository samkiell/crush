'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                className: 'font-semibold shadow-xl',
                style: {
                    background: 'var(--fallback-b1,oklch(var(--b1)/1))',
                    color: 'var(--fallback-bc,oklch(var(--bc)/1))',
                    border: '1px solid var(--fallback-b3,oklch(var(--b3)/0.2))',
                    padding: '16px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                },
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: 'var(--fallback-su,oklch(var(--su)/1))',
                        secondary: 'white',
                    },
                    style: {
                        border: '1px solid var(--fallback-su,oklch(var(--su)/0.2))',
                    }
                },
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: 'var(--fallback-er,oklch(var(--er)/1))',
                        secondary: 'white',
                    },
                    style: {
                        border: '1px solid var(--fallback-er,oklch(var(--er)/0.2))',
                    }
                },
            }}
        />
    );
}
