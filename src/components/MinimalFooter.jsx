'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

const MinimalFooter = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Only show minimal footer for authenticated users
    if (!isAuthenticated) {
        return null;
    }

    return (
        <footer className="mt-auto border-t border-base-300 bg-base-100/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <Link href="/" className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            CrushEdu
                        </Link>
                        <p className="text-xs text-base-content/60 mt-1">
                            © {new Date().getFullYear()} CrushEdu. All rights reserved.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/community"
                            className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
                        >
                            Community
                        </Link>
                        <Link
                            href="/account"
                            className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
                        >
                            Account
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MinimalFooter;
