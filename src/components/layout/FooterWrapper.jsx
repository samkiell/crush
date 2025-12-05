'use client';

import { usePathname } from 'next/navigation';
import MinimalFooter from '../MinimalFooter';

export default function FooterWrapper() {
    const pathname = usePathname();

    // Hide footer on chat pages to allow full-height layout
    if (pathname?.startsWith('/chat') || pathname === '/') {
        return null;
    }

    return <MinimalFooter />;
}
