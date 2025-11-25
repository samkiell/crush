"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Eye, Menu, X, Bell, LogOut, User, LayoutDashboard, BookOpen, FileQuestion, Settings, Users, Phone, HelpCircle, LogIn, UserPlus, ChevronRight } from 'lucide-react';
import { useTheme } from '../utils/theme';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { handleLogout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("eye-care");
    else setTheme("light");
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Exams', href: '/exam', icon: BookOpen },
    { name: 'Questions', href: '/questions', icon: FileQuestion },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const guestLinks = [
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Contact Us', href: '/contact', icon: Phone },
    { name: 'Help Center', href: '/help-center', icon: HelpCircle },
  ];

  const NavItem = ({ link, mobile = false }) => {
    const Icon = link.icon;
    const isActive = pathname.startsWith(link.href);

    if (mobile) {
      return (
        <Link
          href={link.href}
          onClick={() => setIsMenuOpen(false)}
          className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${isActive
            ? 'bg-primary/20 text-white font-semibold'
            : 'hover:bg-white/10 text-white/80 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
              <Icon className="w-5 h-5" />
            </div>
            <span>{link.name}</span>
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-primary' : ''}`} />
        </Link>
      );
    }

    return (
      <Link
        href={link.href}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
          ? 'text-primary'
          : 'text-base-content/70 hover:text-base-content hover:bg-base-200/50'
          }`}
      >
        <Icon className="w-4 h-4" />
        {link.name}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <header className="navbar bg-base-100/95 backdrop-blur-sm shadow-sm px-4 md:px-6 py-3 sticky top-0 z-40 border-b border-base-content/10 transition-colors duration-300">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left Side: Logo & Name */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105 duration-200">
              <Image src={theme === 'dark' ? "/logo-dark.png" : "/logo.png"} fill alt="D2C Logo" className="object-contain" />
            </div>
            <span className="text-xl font-bold text-base-content tracking-tight group-hover:text-primary transition-colors">D2C</span>
          </Link>

          {/* Right Side: Desktop Nav, Theme, User Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              {isAuthenticated ? (
                navLinks.map((link) => <NavItem key={link.name} link={link} />)
              ) : (
                <>
                  {guestLinks.map((link) => <NavItem key={link.name} link={link} />)}
                  <div className="w-px h-6 bg-base-content/10 mx-2"></div>
                  <Link href="/auth/login" className="btn btn-ghost btn-sm font-medium hover:bg-base-content/10">Login</Link>
                  <Link href="/auth/register" className="btn btn-primary btn-sm text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">Get Started</Link>
                </>
              )}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-content/10 transition-transform hover:rotate-12"
              aria-label="Toggle theme"
            >
              {theme === 'light' && <Sun className="w-5 h-5" />}
              {theme === 'dark' && <Moon className="w-5 h-5" />}
              {theme === 'eye-care' && <Eye className="w-5 h-5" />}
            </button>

            {isAuthenticated && (
              <>
                {/* Notification Bell */}
                <button className="btn btn-ghost btn-circle btn-sm hover:bg-base-content/10 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-base-100 animate-pulse"></span>
                </button>

                {/* User Dropdown (Desktop) */}
                <div className="hidden md:flex items-center gap-2 ml-2" ref={profileRef}>
                  <div className="relative">
                    <button
                      onClick={toggleProfile}
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform hover:scale-105 active:scale-95">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-52 gap-1 border border-base-content/5 origin-top-right"
                        >
                          <li className="menu-title px-4 py-2">
                            <span className="text-xs font-semibold uppercase tracking-wider opacity-50">Account</span>
                          </li>
                          <li>
                            <Link
                              href="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-base-content/5 active:bg-base-content/10 text-base-content"
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/settings"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-base-content/5 active:bg-base-content/10 text-base-content"
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>
                          </li>
                          <div className="divider my-1 before:bg-base-content/5 after:bg-base-content/5"></div>
                          <li>
                            <button
                              onClick={() => {
                                setIsProfileOpen(false);
                                handleLogout();
                              }}
                              className="flex items-center gap-3 py-2 px-4 rounded-lg text-error hover:bg-error/10 active:bg-error/20 w-full text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="btn btn-ghost btn-circle md:hidden z-50 relative hover:bg-base-content/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-neutral text-neutral-content shadow-2xl z-50 md:hidden overflow-y-auto border-l border-white/10"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <Image src="/logo-dark.png" fill alt="D2C Logo" className="object-contain" />
                      </div>
                      <span className="text-xl font-bold text-white">D2C</span>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-ghost btn-circle btn-sm hover:bg-white/10 text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {isAuthenticated ? (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-white/60 truncate">{user?.email || 'student@example.com'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="btn btn-outline btn-sm w-full border-white/20 text-white hover:bg-white hover:text-neutral hover:border-white">Login</Link>
                      <Link href="/auth/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary btn-sm w-full text-white">Signup</Link>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-2">Menu</span>
                    {(isAuthenticated ? navLinks : guestLinks).map((link) => (
                      <NavItem key={link.name} link={link} mobile={true} />
                    ))}
                  </div>

                  {isAuthenticated && (
                    <>
                      <div className="divider my-6 before:bg-white/10 after:bg-white/10"></div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-2">Settings</span>
                        <NavItem link={{ name: 'Settings', href: '/settings', icon: Settings }} mobile={true} />
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-error/10 text-error transition-all group mt-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-error/10 group-hover:bg-error/20 transition-colors">
                              <LogOut className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Logout</span>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5">
                  <p className="text-xs text-center text-white/40">
                    &copy; 2025 Crush EduPlace Intl.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
