"use client";

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Link from 'next/link';
import { useTheme } from '../utils/theme';
import { Sun, Moon, Eye } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname?.() || '';

  const showEyeCare = Boolean(
    isAuthenticated ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/questions') ||
      pathname.startsWith('/exam')
  );

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return (
    <header className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            DEVOUR TO CRUSH
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/questions" className="text-base-content hover:text-primary">
              Questions
            </Link>
            <Link href="/exam" className="text-base-content hover:text-primary">
              Exam Simulator
            </Link>
            <Link href="/dashboard" className="text-base-content hover:text-primary">
              Dashboard
            </Link>
            <Link href="/community" className="text-base-content hover:text-primary">
              Community
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="btn-group" role="tablist" aria-label="Theme selector">
              <button
                type="button"
                aria-pressed={theme === 'light'}
                onClick={() => setTheme('light')}
                className={"btn btn-ghost btn-sm " + (theme === 'light' ? 'btn-primary' : '')}
                title="Light"
              >
                <Sun className="w-4 h-4" />
              </button>

              <button
                type="button"
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme('dark')}
                className={"btn btn-ghost btn-sm " + (theme === 'dark' ? 'btn-primary' : '')}
                title="Dark"
              >
                <Moon className="w-4 h-4" />
              </button>

              {showEyeCare && (
                <button
                  type="button"
                  aria-pressed={theme === 'eye-care'}
                  onClick={() => setTheme('eye-care')}
                  className={"btn btn-ghost btn-sm " + (theme === 'eye-care' ? 'btn-primary' : '')}
                  title="Eye Care"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <span className="text-base-content">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/auth/login"
                  className="btn btn-primary btn-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="btn btn-secondary btn-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
