'use client';

import ThemeToggle from '@/components/ThemeToggle';
import { AnimatedCard, AnimatedButton } from '@/components/ui';

export default function DesignSystem() {
    return (
        <div className="min-h-screen p-8 bg-base-100 text-base-content transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold font-display text-gradient-primary">
                        Design System
                    </h1>
                    <ThemeToggle variant="buttons" availableThemes={['light', 'dark', 'eye-care']} />
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Buttons</h2>
                    <div className="flex flex-wrap gap-4">
                        <AnimatedButton variant="primary">Primary</AnimatedButton>
                        <AnimatedButton variant="secondary">Secondary</AnimatedButton>
                        <AnimatedButton variant="accent">Accent</AnimatedButton>
                        <AnimatedButton variant="ghost">Ghost</AnimatedButton>
                        <AnimatedButton variant="outline">Outline</AnimatedButton>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Cards</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <AnimatedCard title="Default Card">
                            <p className="text-base-content/70">Standard card with border.</p>
                        </AnimatedCard>
                        <AnimatedCard variant="glass">
                            <h3 className="text-lg font-bold mb-2">Glass Card</h3>
                            <p>Glassmorphism effect.</p>
                        </AnimatedCard>
                        <AnimatedCard variant="elevated">
                            <h3 className="text-lg font-bold mb-2">Elevated Card</h3>
                            <p>With shadow elevation.</p>
                        </AnimatedCard>
                        <AnimatedCard variant="gradient">
                            <h3 className="text-lg font-bold mb-2">Gradient Card</h3>
                            <p className="text-white/90">Beautiful gradient background.</p>
                        </AnimatedCard>
                    </div>
                </section>
            </div>
        </div>
    );
}
