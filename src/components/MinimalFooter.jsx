'use client';

import Link from 'next/link';
import { Instagram, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

const MinimalFooter = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Only show minimal footer for authenticated users
    if (!isAuthenticated) {
        return null;
    }

    return (
        <footer className="mt-auto border-t border-base-300 bg-base-100/50 backdrop-blur-sm mb-16 md:mb-0">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    {/* Copyright & Brand */}
                    <div className="flex items-center gap-2 text-base-content/60">
                        <span className="font-semibold text-base-content">CrushEdu</span>
                        <span>© {new Date().getFullYear()}</span>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap justify-center gap-6">
                        <Link href="/dashboard" className="text-base-content/60 hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/contact" className="text-base-content/60 hover:text-primary transition-colors">
                            Contact Us
                        </Link>
                        <Link href="/report-issue" className="flex items-center gap-1 text-base-content/60 hover:text-error transition-colors">
                            <AlertTriangle className="w-3 h-3" />
                            Report Issue
                        </Link>
                    </nav>

                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/crush_eduplace/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base-content/60 hover:text-pink-600 transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MinimalFooter;
