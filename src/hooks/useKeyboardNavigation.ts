// Keyboard navigation hook
import { useEffect } from 'react';

interface KeyboardNavigationOptions {
    onNext?: () => void;
    onPrevious?: () => void;
    onSubmit?: () => void;
    onEscape?: () => void;
    enabled?: boolean;
}

export function useKeyboardNavigation({
    onNext,
    onPrevious,
    onSubmit,
    onEscape,
    enabled = true,
}: KeyboardNavigationOptions) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            switch (event.key) {
                case 'ArrowRight':
                case 'n':
                case 'N':
                    event.preventDefault();
                    onNext?.();
                    break;
                case 'ArrowLeft':
                case 'p':
                case 'P':
                    event.preventDefault();
                    onPrevious?.();
                    break;
                case 'Enter':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        onSubmit?.();
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    onEscape?.();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onNext, onPrevious, onSubmit, onEscape, enabled]);
}

// Hook to show keyboard shortcuts help
export function useKeyboardShortcuts() {
    const shortcuts = [
        { keys: ['→', 'N'], description: 'Next question' },
        { keys: ['←', 'P'], description: 'Previous question' },
        { keys: ['Ctrl/Cmd', 'Enter'], description: 'Submit' },
        { keys: ['Esc'], description: 'Cancel/Close' },
    ];

    return shortcuts;
}
