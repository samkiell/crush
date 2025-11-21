"use client";

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Link from 'next/link';
import { Sun, Moon, Eye } from 'lucide-react';
import { useTheme } from '../utils/theme';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("eye-care");
    else setTheme("light");
  };

  const handleLogout = () => {
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
            <Link href="/questions" className="text-base-content hover:bg-base-200 rounded-xl px-4 py-2 transition-all duration-300">
