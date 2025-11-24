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
                style: {
                    background: 'var(--fallback-b1,oklch(var(--b1)/1))',
                    color: 'var(--fallback-bc,oklch(var(--bc)/1))',
                    border: '1px solid var(--fallback-b3,oklch(var(--b3)/1))',
                },
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: 'var(--fallback-su,oklch(var(--su)/1))',
                        secondary: 'white',
                    },
                },
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: 'var(--fallback-er,oklch(var(--er)/1))',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
}
