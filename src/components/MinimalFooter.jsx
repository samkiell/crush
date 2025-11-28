'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

const MinimalFooter = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

        </footer >
    );
};

export default MinimalFooter;
