/**
 * CrushEdu Design System Tokens
 */

export const colors = {
  light: {
    primary: '#2563eb',
    secondary: '#f59e0b',
    accent: '#10b981',
    bg: '#f8fafc',
    text: '#111827',
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#d97706',
    accent: '#14b8a6',
    bg: '#0f172a',
    text: '#f9fafb',
  },
  eyeCare: {
    primary: '#4a7664',
    secondary: '#8b7355',
    accent: '#a67c52',
    bg: '#1a1f1c',
    text: '#f5f1e6',
  },
};

export const themeConfig = {
  themes: ['light', 'dark', 'eye-care'],
  defaultTheme: 'light',
  storageKey: 'crushedu-theme',
};

export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.2 },
  },
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
};
