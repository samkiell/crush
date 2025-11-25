"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Eye, Menu, X, Bell, LogOut, User, LayoutDashboard, BookOpen, FileQuestion, Settings, Users, Phone, HelpCircle, LogIn, UserPlus, ChevronRight } from 'lucide-react';
import { useTheme } from '../utils/theme';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { handleLogout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    {
      isAuthenticated?(
                    <div className = "flex items-center gap-4 p-4 bg-base-content/5 rounded-2xl" >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base-content truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-base-content/60 truncate">{user?.email || 'student@example.com'}</p>
                      </div>
                    </div >
                  ) : (
  <div className="grid grid-cols-2 gap-3">
    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="btn btn-outline btn-sm w-full border-base-content/20 hover:bg-base-content hover:text-base-100 hover:border-base-content">Login</Link>
    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary btn-sm w-full text-white">Signup</Link>
  </div>
)}
                </div >

                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-base-content/40 uppercase tracking-wider px-4 mb-2">Menu</span>
                    {(isAuthenticated ? navLinks : guestLinks).map((link) => (
                      <NavItem key={link.name} link={link} mobile={true} />
                    ))}
                  </div>

                  {isAuthenticated && (
                    <>
                      <div className="divider my-6 before:bg-base-content/10 after:bg-base-content/10"></div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-base-content/40 uppercase tracking-wider px-4 mb-2">Settings</span>
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

                <div className="p-6 border-t border-base-content/10 bg-base-content/5">
                  <p className="text-xs text-center text-base-content/40">
                    &copy; 2025 Crush EduPlace Intl.
                  </p>
                </div>
              </div >
            </motion.div >
          </>
        )}
      </AnimatePresence >
    </>
  );
};

export default Header;
