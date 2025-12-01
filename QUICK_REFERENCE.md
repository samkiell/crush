# CrushEdu Design System - Quick Reference

## 🎨 Theme Colors

### Light Theme
```jsx
Primary: #2563eb (Blue)
Secondary: #f59e0b (Amber)
Background: #f8fafc
Text: #111827
```

### Dark Theme
```jsx
Primary: #3b82f6 (Blue-500)
Secondary: #d97706 (Amber-600)
Background: #0f172a
Text: #f9fafb
```

### Eye Care Theme
```jsx
Primary: #4a7664 (Green-teal)
Secondary: #8b7355 (Brown)
Background: #1a1f1c
Text: #f5f1e6
```

---

## 🔧 Quick Imports

```javascript
// Design Tokens
import { colors, typography, shadows, spacing } from '@/lib/designTokens';

// Motion Config
import { variants, transitions, hover, stagger } from '@/lib/motionConfig';

// Components
import ThemeToggle from '@/components/ThemeToggle';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
```

---

## 🎯 Common Patterns

### Theme Toggle
```jsx
// Compact (cycles through themes)
<ThemeToggle variant="compact" availableThemes={['light', 'dark']} />

// Buttons (horizontal row)
<ThemeToggle variant="buttons" availableThemes={['light', 'dark', 'eye-care']} />

// Dropdown (menu)
<ThemeToggle variant="dropdown" availableThemes={['light', 'dark']} showLabels />
```

### Animated Card
```jsx
<AnimatedCard
  title="Card Title"
  description="Card description"
  variant="glass" // default | glass | elevated | gradient
  hoverable={true}
>
  Card content
</AnimatedCard>
```

### Animated Button
```jsx
<AnimatedButton
  variant="primary" // primary | secondary | accent | ghost | outline | gradient
  size="md" // sm | md | lg
  loading={false}
  disabled={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
>
  Button Text
</AnimatedButton>
```

### Framer Motion Animations
```jsx
import { motion } from 'framer-motion';
import { variants } from '@/lib/motionConfig';

// Basic fade up
<motion.div variants={variants.fadeUp}>
  Content
</motion.div>

// Stagger children
<motion.div variants={stagger.container(0.1)}>
  {items.map(item => (
    <motion.div key={item.id} variants={stagger.item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>

// Hover effects
<motion.button {...hover.lift}>
  Hover me
</motion.button>
```

---

## 🎨 Utility Classes

### Glass Effect
```jsx
<div className="glass rounded-xl p-6">Glassmorphism</div>
<div className="glass-strong rounded-xl p-6">Strong glass</div>
```

### Gradients
```jsx
// Background gradients
<div className="gradient-primary">Primary gradient</div>
<div className="gradient-secondary">Secondary gradient</div>
<div className="gradient-abstract">Abstract gradient</div>

// Text gradients
<h1 className="text-gradient-primary">Gradient text</h1>
```

### Surfaces
```jsx
<div className="surface rounded-lg p-4">Standard surface</div>
<div className="surface-elevated rounded-lg p-6">Elevated surface</div>
```

### Hover Effects
```jsx
<div className="hover-lift">Lifts on hover</div>
<div className="hover-glow">Glows on hover</div>
```

### Shadows
```jsx
shadow-subtle
shadow-medium
shadow-strong
shadow-glow-primary
shadow-glow-secondary
```

---

## 📐 Typography

```jsx
// Font families
font-sans // Inter, Poppins
font-display // Poppins, Inter

// Sizes
text-xs text-sm text-base text-lg text-xl
text-2xl text-3xl text-4xl text-5xl text-6xl

// Weights
font-light font-normal font-medium
font-semibold font-bold font-extrabold
```

---

## 🎭 Animation Variants

```javascript
// Fade
variants.fade
variants.fadeUp
variants.fadeDown
variants.fadeLeft
variants.fadeRight

// Scale
variants.scale
variants.scaleUp
variants.scaleDown

// Slide
variants.slideUp
variants.slideDown
variants.slideLeft
variants.slideRight

// Rotate
variants.rotate
variants.flipX
variants.flipY
```

---

## ⚡ Transitions

```javascript
transitions.fast // 150ms
transitions.base // 300ms
transitions.slow // 500ms
transitions.spring // Spring animation
transitions.smooth // Smooth easing
```

---

## 🎯 DaisyUI Classes

```jsx
// Buttons
btn btn-primary btn-secondary btn-accent btn-ghost

// Cards
card card-compact card-normal card-bordered

// Inputs
input input-bordered input-primary

// Badges
badge badge-primary badge-secondary

// Alerts
alert alert-info alert-success alert-warning alert-error
```

---

## 🌈 Color Classes

```jsx
// Text colors
text-primary text-secondary text-accent
text-base-content text-base-content/70

// Background colors
bg-base-100 bg-base-200 bg-base-300
bg-primary bg-secondary bg-accent

// Border colors
border-base-300 border-primary border-secondary
```

---

## 📱 Responsive Design

```jsx
// Mobile first
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Grid items
</div>

// Flex
<div className="flex flex-col md:flex-row gap-4">
  Flex items
</div>
```

---

## 🔥 Pro Tips

1. **Always use design tokens** instead of hardcoded values
2. **Use predefined motion variants** for consistency
3. **Ensure theme compatibility** - test in all themes
4. **Implement accessibility** - ARIA labels, keyboard nav
5. **Mobile-first approach** - start with mobile, scale up
6. **Use AnimatePresence** for exit animations
7. **Leverage stagger animations** for lists
8. **Test reduced motion** preferences

---

## 📦 File Locations

```
src/
├── lib/
│   ├── designTokens.js      # Design tokens
│   └── motionConfig.js      # Motion variants
├── components/
│   ├── ThemeToggle.jsx      # Theme switcher
│   └── ui/
│       ├── AnimatedCard.jsx
│       └── AnimatedButton.jsx
├── app/
│   ├── globals.css          # Global styles
│   └── design-system/       # Showcase page
└── tailwind.config.js       # Tailwind config
```

---

## 🚀 Getting Started

1. Import what you need
2. Use theme-aware classes
3. Add animations with Framer Motion
4. Test across all themes
5. Ensure accessibility
6. Ship it! 🎉

---

**Need help?** Check `DESIGN_SYSTEM.md` for full documentation.
