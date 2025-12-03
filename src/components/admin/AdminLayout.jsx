'use client';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-base-100 pb-20">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link href="/dashboard" className="btn btn-ghost gap-2 pl-0 hover:bg-transparent">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
