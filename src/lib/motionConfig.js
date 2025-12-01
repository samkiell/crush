/**
 * Framer Motion Configuration & Utilities
 * 
 * Centralized animation configurations, variants, and utility functions
 * for consistent animations across the CrushEdu application.
 */

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitions = {
  // Spring transitions
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  
  springBouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    bounce: 0.5,
  },
  
  springSmooth: {
    type: 'spring',
    stiffness: 200,
    damping: 35,
  },
  
  // Tween transitions
  fast: {
    duration: 0.15,
    ease: 'easeOut',
  },
  
  base: {
    duration: 0.3,
    ease: 'easeInOut',
  },
  
  slow: {
    duration: 0.5,
    ease: 'easeInOut',
  },
  
  // Custom easing
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  
  bounce: {
    duration: 0.5,
    ease: [0.68, -0.55, 0.265, 1.55],
  },
};

// ============================================
// ANIMATION VARIANTS
// ============================================

export const variants = {
  // Fade variants
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  fadeLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  fadeRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  // Scale variants
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  
  scaleUp: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0 },
  },
  
  scaleDown: {
    initial: { scale: 1.1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  
  // Slide variants
  slideUp: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  
  slideDown: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  
  slideLeft: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  
  slideRight: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  
  // Rotate variants
  rotate: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 },
  },
  
  // Flip variants
  flipX: {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 },
  },
  
  flipY: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
};

// ============================================
// STAGGER VARIANTS
// ============================================

export const stagger = {
  container: (staggerChildren = 0.1, delayChildren = 0) => ({
    animate: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }),
  
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  itemFast: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  
  itemScale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

// ============================================
// HOVER & TAP VARIANTS
// ============================================

export const hover = {
  lift: {
    whileHover: { y: -4, transition: transitions.fast },
    whileTap: { scale: 0.98 },
  },
  
  scale: {
    whileHover: { scale: 1.05, transition: transitions.fast },
    whileTap: { scale: 0.95 },
  },
  
  scaleSmall: {
    whileHover: { scale: 1.02, transition: transitions.fast },
    whileTap: { scale: 0.98 },
  },
  
  glow: {
    whileHover: { 
      boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)',
      transition: transitions.fast,
    },
  },
  
  rotate: {
    whileHover: { rotate: 5, transition: transitions.fast },
    whileTap: { rotate: -5 },
  },
  
  shine: {
    whileHover: {
      backgroundPosition: '200% center',
      transition: { duration: 0.8 },
    },
  },
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

export const pageTransitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.base,
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: transitions.smooth,
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: transitions.smooth,
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: transitions.smooth,
  },
};

// ============================================
// MODAL/DIALOG VARIANTS
// ============================================

export const modal = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.fast,
  },
  
  content: {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.9, opacity: 0, y: 20 },
    transition: transitions.smooth,
  },
  
  drawer: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: transitions.smooth,
  },
  
  bottomSheet: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: transitions.smooth,
  },
};

// ============================================
// LOADING VARIANTS
// ============================================

export const loading = {
  spinner: {
    animate: {
      rotate: 360,
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  
  dots: {
    animate: {
      y: [0, -10, 0],
    },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// NOTIFICATION VARIANTS
// ============================================

export const notification = {
  topRight: {
    initial: { x: 400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 },
    transition: transitions.smooth,
  },
  
  topLeft: {
    initial: { x: -400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -400, opacity: 0 },
    transition: transitions.smooth,
  },
  
  bottomRight: {
    initial: { x: 400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 },
    transition: transitions.smooth,
  },
  
  bottomLeft: {
    initial: { x: -400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -400, opacity: 0 },
    transition: transitions.smooth,
  },
  
  top: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
    transition: transitions.smooth,
  },
  
  bottom: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: transitions.smooth,
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a stagger container with custom timing
 */
export const createStaggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Create a custom fade variant with custom distance
 */
export const createFadeVariant = (direction = 'up', distance = 20) => {
  const axis = ['up', 'down'].includes(direction) ? 'y' : 'x';
  const value = ['up', 'left'].includes(direction) ? distance : -distance;
  
  return {
    initial: { opacity: 0, [axis]: value },
    animate: { opacity: 1, [axis]: 0 },
    exit: { opacity: 0, [axis]: -value },
  };
};

/**
 * Create a custom scale variant
 */
export const createScaleVariant = (initialScale = 0.9, exitScale = 0.9) => ({
  initial: { scale: initialScale, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: exitScale, opacity: 0 },
});

/**
 * Combine multiple variants
 */
export const combineVariants = (...variantObjects) => {
  return variantObjects.reduce((acc, variant) => {
    Object.keys(variant).forEach((key) => {
      acc[key] = { ...acc[key], ...variant[key] };
    });
    return acc;
  }, {});
};

/**
 * Create viewport animation (scroll-triggered)
 */
export const createViewportAnimation = (once = true, amount = 0.3) => ({
  viewport: { once, amount },
  initial: 'initial',
  whileInView: 'animate',
});

// ============================================
// EXPORTS
// ============================================

export default {
  transitions,
  variants,
  stagger,
  hover,
  pageTransitions,
  modal,
  loading,
  notification,
  createStaggerContainer,
  createFadeVariant,
  createScaleVariant,
  combineVariants,
  createViewportAnimation,
};
