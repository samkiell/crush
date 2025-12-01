'use client';

import { motion } from 'framer-motion';
import { hover } from '@/lib/motionConfig';

export default function AnimatedButton({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    ...props
}) {
    const variants = {
        primary: 'btn btn-primary',
        secondary: 'btn btn-secondary',
        accent: 'btn btn-accent',
        ghost: 'btn btn-ghost',
        outline: 'btn btn-outline',
    };

    const sizes = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    };

    return (
        <motion.button
            className={`${variants[variant]} ${sizes[size]} ${className}`}
            {...(!loading && hover.scale)}
            disabled={loading}
            {...props}
        >
            {loading && <span className="loading loading-spinner loading-sm" />}
            {children}
        </motion.button>
    );
}
