'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Flag, Users, Settings, LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Reports', href: '/admin/reports', icon: Flag },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-base-200 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-base-100 shadow-xl hidden lg:flex flex-col">
                <div className="p-6 border-b border-base-200">
                    <Link href="/" className="text-2xl font-bold text-primary">CrushEdu Admin</Link>
                </div>
                <ul className="menu p-4 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link href={item.href} className={isActive ? 'active' : ''}>
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="p-4 border-t border-base-200">
                    <Link href="/logout" className="btn btn-ghost w-full justify-start text-error">
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden navbar bg-base-100 shadow-sm">
                    <div className="flex-1">
                        <Link href="/admin/dashboard" className="btn btn-ghost text-xl">Admin</Link>
                    </div>
                    <div className="flex-none">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                {navItems.map((item) => (
                                    <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <main className="p-6 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
