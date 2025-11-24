"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Eye } from 'lucide-react';
import { useTheme } from '../utils/theme';

const Header = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("eye-care");
    else setTheme("light");
  };

  return (
    <header className="navbar bg-base-100 shadow-md px-6 py-4">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" width={40} height={40} alt="D2C Logo" className="w-10 h-10" />
          <span className="text-xl font-bold text-base-content tracking-tight">D2C</span>
        </Link>

        <button
          onClick={cycleTheme}
          className="btn btn-ghost btn-circle hover:bg-base-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' && <Sun className="w-5 h-5" />}
          {theme === 'dark' && <Moon className="w-5 h-5" />}
          {theme === 'eye-care' && <Eye className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}

export default Header;
