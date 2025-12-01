/**
 * CrushEdu Design System Tokens
 * 
 * Centralized design tokens for consistent theming across the application.
 * These tokens are used in conjunction with TailwindCSS and DaisyUI.
 */

// ============================================
// COLOR TOKENS
// ============================================

export const colors = {
  light: {
    primary: {
      DEFAULT: '#2563eb',
      focus: '#1d4ed8',
      content: '#ffffff',
    },
    secondary: {
      DEFAULT: '#f59e0b',
      focus: '#d97706',
      content: '#ffffff',
    },
    accent: {
      DEFAULT: '#10b981',
      focus: '#059669',
      content: '#ffffff',
    },
    neutral: {
      DEFAULT: '#64748b',
      focus: '#475569',
      content: '#ffffff',
    },
    base: {
      100: '#f8fafc',
      200: '#f1f5f9',
      300: '#e2e8f0',
      content: '#111827',
    },
    state: {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  dark: {
    primary: {
      DEFAULT: '#3b82f6',
      focus: '#2563eb',
      content: '#ffffff',
    },
    secondary: {
      DEFAULT: '#d97706',
      focus: '#b45309',
      content: '#ffffff',
    },
    accent: {
      DEFAULT: '#14b8a6',
      focus: '#0d9488',
      content: '#ffffff',
    },
    neutral: {
      DEFAULT: '#374151',
      focus: '#1f2937',
      content: '#f9fafb',
    },
    base: {
      100: '#0f172a',
      200: '#1e293b',
      300: '#334155',
      content: '#f9fafb',
    },
    state: {
      info: '#60a5fa',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
    },
  },
  eyeCare: {
    primary: {
      DEFAULT: '#4a7664',
      focus: '#3d6253',
      content: '#f5f1e6',
    },
    secondary: {
      DEFAULT: '#8b7355',
      focus: '#6d5a43',
      content: '#f5f1e6',
    },
    accent: {
      DEFAULT: '#a67c52',
      focus: '#8b6642',
      content: '#f5f1e6',
    },
    neutral: {
      DEFAULT: '#5d533a',
      focus: '#4a4230',
      content: '#f5f1e6',
    },
    base: {
      100: '#1a1f1c',
      200: '#242a26',
      300: '#2e3530',
      content: '#f5f1e6',
    },
    state: {
      info: '#5a8c7a',
      success: '#6b9b7f',
      warning: '#c9a66b',
      error: '#b85c5c',
    },
  },
};

// ============================================
// TYPOGRAPHY TOKENS
// ============================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
    display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

// ============================================
// SPACING TOKENS
// ============================================

export const spacing = {
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  gap: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
};

// ============================================
// SHADOW TOKENS
// ============================================

export const shadows = {
  subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'subtle-lg': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'medium-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  strong: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  'strong-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'glow-primary': '0 0 20px rgba(37, 99, 235, 0.3)',
  'glow-secondary': '0 0 20px rgba(245, 158, 11, 0.3)',
  'inner-subtle': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// ============================================
// ANIMATION TOKENS
// ============================================

export const animations = {
  duration: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================
// FRAMER MOTION VARIANTS
// ============================================

export const motionVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  
  // Slide animations
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3 },
  },
  
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: { duration: 0.3 },
  },
  
  slideLeft: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { duration: 0.3 },
  },
  
  slideRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: { duration: 0.3 },
  },
  
  // Scale animations
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.2 },
  },
  
  scaleUp: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.05, opacity: 0 },
    transition: { duration: 0.2 },
  },
  
  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  
  // Hover effects
  hoverLift: {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 },
  },
  
  hoverScale: {
    whileHover: { scale: 1.05, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 },
  },
  
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  
  // Modal/Dialog animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  
  modalContent: {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.9, opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ============================================
// THEME CONFIGURATION
// ============================================

export const themeConfig = {
  themes: ['light', 'dark', 'eye-care'],
  defaultTheme: 'light',
  storageKey: 'crushedu-theme',
  
  // Theme availability by page
  availability: {
    global: ['light', 'dark'],
    study: ['light', 'dark', 'eye-care'],
    community: ['light', 'dark', 'eye-care'],
  },
};

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

export default {
  colors,
  typography,
  spacing,
  shadows,
  animations,
  motionVariants,
  themeConfig,
  breakpoints,
  zIndex,
};
