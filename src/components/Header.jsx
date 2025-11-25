"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Eye, Menu, X, Bell, LogOut, User, LayoutDashboard, BookOpen, FileQuestion, Settings } from 'lucide-react';
import { useTheme } from '../utils/theme';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { handleLogout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("eye-care");
    else setTheme("light");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Exams', href: '/exam', icon: BookOpen },
    { name: 'Questions', href: '/questions', icon: FileQuestion },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // If not authenticated, show simplified header or nothing?
  // Requirement: "Global Header Component ... appears on all authenticated pages"
  // Requirement: "Users not logged in should only access Landing page, Login, Signup"
  // So for guest pages, we might want a different header or just the logo.
  // Let's show a minimal header for guests (Logo + Theme Toggle) and full for auth.

  return (
    <header className="navbar bg-base-100/80 backdrop-blur-md shadow-md px-4 md:px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Logo & Name */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" width={40} height={40} alt="D2C Logo" className="w-10 h-10" />
          <span className="text-xl font-bold text-base-content tracking-tight hidden sm:block">D2C</span>
        </Link>

        {/* Right Side: Desktop Nav, Theme, User Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6 mr-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-base-content/70 hover:text-base-content'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' && <Sun className="w-5 h-5" />}
            {theme === 'dark' && <Moon className="w-5 h-5" />}
            {theme === 'eye-care' && <Eye className="w-5 h-5" />}
          </button>

          {isAuthenticated && (
            <>
              {/* Notification Bell */}
              <button className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full ring-2 ring-base-100"></span>
              </button>

              {/* User Dropdown (Desktop) / Logout */}
              <div className="hidden md:flex items-center gap-2">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                      <Link href="/profile" className="justify-between">
                        Profile
                        <span className="badge">New</span>
                      </Link>
                    </li>
                    <li><Link href="/settings">Settings</Link></li>
                    <li><button onClick={handleLogout} className="text-error">Logout</button></li>
                  </ul>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="btn btn-ghost btn-circle md:hidden"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isAuthenticated && isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 shadow-lg md:hidden border-t border-base-200 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-base-200 text-base-content'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
            <div className="divider my-2"></div>
            <Link
              href="/settings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 text-base-content"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-error/10 text-error transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
