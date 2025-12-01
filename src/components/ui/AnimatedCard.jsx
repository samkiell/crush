'use client';

import { motion } from 'framer-motion';
import { variants, hover } from '@/lib/motionConfig';

export default function AnimatedCard({
    children,
    className = '',
    variant = 'default',
    hoverable = true,
    ...props
}) {
    const styles = {
        default: 'bg-base-100 border border-base-300',
        glass: 'glass',
        elevated: 'surface-elevated shadow-medium',
        gradient: 'gradient-primary text-primary-content',
    };

    return (
        <motion.div
            className={`rounded-xl p-6 ${styles[variant]} ${className}`}
            variants={variants.fadeUp}
            initial="initial"
            animate="animate"
            {...(hoverable && hover.lift)}
            {...props}
        >
            {children}
        </motion.div>
    );
}
