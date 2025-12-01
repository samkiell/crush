'use client';

import { motion } from 'framer-motion';
import { hover, transitions } from '@/lib/motionConfig';

/**
 * AnimatedButton Component
 * 
 * A beautiful, animated button component with multiple variants,
 * loading states, and smooth Framer Motion interactions.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 */
export default function AnimatedButton({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    onClick,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all';

    const variantStyles = {
        primary: 'bg-primary hover:bg-primary-focus text-primary-content shadow-medium hover:shadow-strong',
        secondary: 'bg-secondary hover:bg-secondary-focus text-secondary-content shadow-medium hover:shadow-strong',
        accent: 'bg-accent hover:bg-accent-focus text-accent-content shadow-medium hover:shadow-strong',
        ghost: 'bg-transparent hover:bg-base-200 text-base-content',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-content',
        gradient: 'gradient-primary text-white shadow-glow-primary hover:shadow-glow-primary',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const isDisabled = disabled || loading;

    return (
        <motion.button
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
            {...(!isDisabled && hover.scale)}
            transition={transitions.fast}
            {...props}
        >
            {/* Left Icon */}
            {leftIcon && !loading && (
                <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {leftIcon}
                </motion.span>
            )}

            {/* Loading Spinner */}
            {loading && (
                <motion.div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            )}

            {/* Button Text */}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
            >
                {children}
            </motion.span>

            {/* Right Icon */}
            {rightIcon && !loading && (
                <motion.span
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {rightIcon}
                </motion.span>
            )}
        </motion.button>
    );
}
