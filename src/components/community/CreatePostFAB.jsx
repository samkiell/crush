'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CreatePostFAB() {
    return (
        <Link href="/community/create">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 group"
            >
                {/* Pulse Effect */}
                <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping opacity-75"></span>

                {/* Button */}
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/40 text-primary-content transition-all duration-300 group-hover:shadow-primary/60">
                    <Plus className="w-8 h-8" />
                </div>
            </motion.button>
        </Link>
    );
}
