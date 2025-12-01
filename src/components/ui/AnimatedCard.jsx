'use client';

import { motion } from 'framer-motion';
import { variants, hover, transitions } from '@/lib/motionConfig';

/**
 * AnimatedCard Component
 * 
 * A beautiful, reusable card component with Framer Motion animations,
 * glassmorphism effects, and hover interactions.
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card style variant: 'default' | 'glass' | 'elevated' | 'gradient'
 * @param {boolean} props.hoverable - Enable hover lift effect
 * @param {Object} props.motionVariant - Custom Framer Motion variant
 */
export default function AnimatedCard({
    title,
    description,
    children,
    variant = 'default',
    hoverable = true,
    motionVariant = variants.fadeUp,
    className = '',
    ...props
}) {
    const variantStyles = {
        default: 'bg-base-100 border border-base-300',
        glass: 'glass',
        elevated: 'surface-elevated',
        gradient: 'gradient-primary text-white',
    };

    return (
        <motion.div
            className={`rounded-xl p-6 ${variantStyles[variant]} ${className}`}
            variants={motionVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.smooth}
            {...(hoverable && hover.lift)}
            {...props}
        >
            {title && (
                <motion.h3
                    className={`text-xl font-semibold mb-2 ${variant === 'gradient' ? 'text-white' : 'text-base-content'
                        }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {title}
                </motion.h3>
            )}

            {description && (
                <motion.p
                    className={`text-sm mb-4 ${variant === 'gradient' ? 'text-white/90' : 'text-base-content/70'
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {description}
                </motion.p>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
