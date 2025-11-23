"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Eye } from 'lucide-react';
import { useTheme } from '../utils/theme';

const Header = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    { theme === 'eye-care' && <Eye className="w-5 h-5" /> }
        </button >
      </div >
    </header >
  );
}

export default Header;
