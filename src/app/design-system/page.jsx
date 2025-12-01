'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Heart, Star, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { stagger, variants } from '@/lib/motionConfig';

/**
 * Design System Showcase Page
 * 
 * Demonstrates all design system components, themes, animations,
 * and utilities in a beautiful, interactive showcase.
 */
export default function DesignSystemShowcase() {
    return (
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <motion.header
                className="sticky top-0 z-50 glass border-b border-base-300"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <motion.h1
                            className="text-2xl font-bold text-gradient-primary"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            CrushEdu Design System
                        </motion.h1>

                        <ThemeToggle
                            variant="buttons"
                            availableThemes={['light', 'dark', 'eye-care']}
                            showLabels={false}
                        />
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 gradient-mesh opacity-30" />

                <motion.div
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    variants={stagger.container(0.15)}
                    initial="initial"
                    animate="animate"
                >
                    <motion.div variants={stagger.item}>
                        <h2 className="text-5xl md:text-6xl font-bold text-gradient-primary mb-6">
                            Beautiful by Design
                        </h2>
                    </motion.div>

                    <motion.p
                        className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8"
                        variants={stagger.item}
                    >
                        A comprehensive design system built with TailwindCSS, DaisyUI, and Framer Motion.
                        Three stunning themes, smooth animations, and production-ready components.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-4"
                        variants={stagger.item}
                    >
                        <AnimatedButton variant="gradient" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                            Get Started
                        </AnimatedButton>
                        <AnimatedButton variant="outline" size="lg">
                            View Documentation
                        </AnimatedButton>
                    </motion.div>
                </motion.div>
            </section>

            {/* Theme Showcase */}
            <section className="py-16 bg-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-3xl font-bold text-base-content mb-2">
                            Three Beautiful Themes
                        </h3>
                        <p className="text-base-content/70 mb-8">
                            Switch between Light, Dark, and Eye Care themes with smooth transitions
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        variants={stagger.container(0.1)}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <AnimatedCard
                            title="Light Theme"
                            description="Clean and modern design for daytime use"
                            variant="default"
                            motionVariant={stagger.item}
                        >
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm font-medium">Default Theme</span>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard
                            title="Dark Theme"
                            description="Easy on the eyes for low-light environments"
                            variant="elevated"
                            motionVariant={stagger.item}
                        >
                            <div className="flex items-center gap-2 text-secondary">
                                <Zap className="w-5 h-5" />
                                <span className="text-sm font-medium">Night Mode</span>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard
                            title="Eye Care Theme"
                            description="Reduced eye strain for extended studying"
                            variant="glass"
                            motionVariant={stagger.item}
                        >
                            <div className="flex items-center gap-2 text-accent">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm font-medium">Study & Community</span>
                            </div>
                        </AnimatedCard>
                    </motion.div>
                </div>
            </section>

            {/* Button Variants */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-3xl font-bold text-base-content mb-2">
                            Button Components
                        </h3>
                        <p className="text-base-content/70 mb-8">
                            Beautiful, animated buttons with multiple variants and states
                        </p>
                    </motion.div>

                    <motion.div
                        className="space-y-6"
                        variants={stagger.container(0.1)}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {/* Primary Buttons */}
                        <motion.div variants={stagger.item}>
                            <h4 className="text-sm font-semibold text-base-content/60 mb-3">Primary Variants</h4>
                            <div className="flex flex-wrap gap-3">
                                <AnimatedButton variant="primary">Primary</AnimatedButton>
                                <AnimatedButton variant="secondary">Secondary</AnimatedButton>
                                <AnimatedButton variant="accent">Accent</AnimatedButton>
                                <AnimatedButton variant="gradient" leftIcon={<Star className="w-4 h-4" />}>
                                    Gradient
                                </AnimatedButton>
                            </div>
                        </motion.div>

                        {/* Outline & Ghost */}
                        <motion.div variants={stagger.item}>
                            <h4 className="text-sm font-semibold text-base-content/60 mb-3">Outline & Ghost</h4>
                            <div className="flex flex-wrap gap-3">
                                <AnimatedButton variant="outline">Outline</AnimatedButton>
                                <AnimatedButton variant="ghost">Ghost</AnimatedButton>
                            </div>
                        </motion.div>

                        {/* Sizes */}
                        <motion.div variants={stagger.item}>
                            <h4 className="text-sm font-semibold text-base-content/60 mb-3">Sizes</h4>
                            <div className="flex flex-wrap items-center gap-3">
                                <AnimatedButton variant="primary" size="sm">Small</AnimatedButton>
                                <AnimatedButton variant="primary" size="md">Medium</AnimatedButton>
                                <AnimatedButton variant="primary" size="lg">Large</AnimatedButton>
                            </div>
                        </motion.div>

                        {/* States */}
                        <motion.div variants={stagger.item}>
                            <h4 className="text-sm font-semibold text-base-content/60 mb-3">States</h4>
                            <div className="flex flex-wrap gap-3">
                                <AnimatedButton variant="primary" loading>Loading</AnimatedButton>
                                <AnimatedButton variant="primary" disabled>Disabled</AnimatedButton>
                                <AnimatedButton
                                    variant="primary"
                                    leftIcon={<Sparkles className="w-4 h-4" />}
                                    rightIcon={<ArrowRight className="w-4 h-4" />}
                                >
                                    With Icons
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Card Variants */}
            <section className="py-16 bg-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-3xl font-bold text-base-content mb-2">
                            Card Components
                        </h3>
                        <p className="text-base-content/70 mb-8">
                            Versatile card components with glassmorphism and gradient effects
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={stagger.container(0.1)}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <AnimatedCard
                            title="Default Card"
                            description="Standard card with border"
                            variant="default"
                            motionVariant={stagger.item}
                        >
                            <AnimatedButton variant="primary" size="sm" fullWidth>
                                Action
                            </AnimatedButton>
                        </AnimatedCard>

                        <AnimatedCard
                            title="Glass Card"
                            description="Glassmorphism effect"
                            variant="glass"
                            motionVariant={stagger.item}
                        >
                            <AnimatedButton variant="primary" size="sm" fullWidth>
                                Action
                            </AnimatedButton>
                        </AnimatedCard>

                        <AnimatedCard
                            title="Elevated Card"
                            description="Card with shadow elevation"
                            variant="elevated"
                            motionVariant={stagger.item}
                        >
                            <AnimatedButton variant="primary" size="sm" fullWidth>
                                Action
                            </AnimatedButton>
                        </AnimatedCard>

                        <AnimatedCard
                            title="Gradient Card"
                            description="Beautiful gradient background"
                            variant="gradient"
                            motionVariant={stagger.item}
                        >
                            <AnimatedButton variant="outline" size="sm" fullWidth className="border-white text-white hover:bg-white hover:text-primary">
                                Action
                            </AnimatedButton>
                        </AnimatedCard>
                    </motion.div>
                </div>
            </section>

            {/* Utility Classes */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-3xl font-bold text-base-content mb-2">
                            Utility Classes
                        </h3>
                        <p className="text-base-content/70 mb-8">
                            Powerful utility classes for gradients, effects, and animations
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={stagger.container(0.1)}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {/* Text Gradients */}
                        <motion.div
                            className="surface-elevated rounded-xl p-6"
                            variants={stagger.item}
                        >
                            <h4 className="text-lg font-semibold text-base-content mb-4">
                                Text Gradients
                            </h4>
                            <div className="space-y-3">
                                <h5 className="text-gradient-primary text-2xl font-bold">
                                    Primary Gradient
                                </h5>
                                <h5 className="text-gradient-secondary text-2xl font-bold">
                                    Secondary Gradient
                                </h5>
                            </div>
                        </motion.div>

                        {/* Hover Effects */}
                        <motion.div
                            className="surface-elevated rounded-xl p-6"
                            variants={stagger.item}
                        >
                            <h4 className="text-lg font-semibold text-base-content mb-4">
                                Hover Effects
                            </h4>
                            <div className="space-y-3">
                                <div className="hover-lift surface rounded-lg p-4 text-center cursor-pointer">
                                    Hover to Lift
                                </div>
                                <div className="hover-glow surface rounded-lg p-4 text-center cursor-pointer">
                                    Hover to Glow
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-base-200 border-t border-base-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.p
                        className="text-base-content/60"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        CrushEdu Design System v2.0 • Built with ❤️ using TailwindCSS, DaisyUI & Framer Motion
                    </motion.p>
                </div>
            </footer>
        </div>
    );
}
