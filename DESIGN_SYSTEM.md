# CrushEdu Design System Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Theme Configuration](#theme-configuration)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Shadows](#shadows)
7. [Animations](#animations)
8. [Components](#components)
9. [Usage Examples](#usage-examples)
10. [Best Practices](#best-practices)

---

## 🎨 Overview

The CrushEdu Design System is a comprehensive, production-ready design foundation built on **TailwindCSS**, **DaisyUI**, and **Framer Motion**. It provides three distinct themes with smooth transitions, consistent design tokens, and beautiful animations.

### Key Features
- ✅ Three carefully crafted themes: **Light**, **Dark**, and **Eye Care**
- ✅ Smooth theme transitions with CSS variables and Framer Motion
- ✅ Comprehensive design tokens for consistency
- ✅ Custom shadow system (subtle, medium, strong)
- ✅ Gradient utilities and glassmorphism effects
- ✅ Responsive typography scale
- ✅ Reusable animation variants
- ✅ Accessible and WCAG compliant

---

## 🌈 Theme Configuration

### Available Themes

#### 1. **Light Theme** (Global)
- **Primary**: `#2563eb` (Blue)
- **Secondary**: `#f59e0b` (Amber)
- **Background**: `#f8fafc` (Slate)
- **Text**: `#111827` (Gray-900)
- **Use Case**: Default theme for all pages

#### 2. **Dark Theme** (Global)
- **Primary**: `#3b82f6` (Blue-500)
- **Secondary**: `#d97706` (Amber-600)
- **Background**: `#0f172a` (Slate-900)
- **Text**: `#f9fafb` (Gray-50)
- **Use Case**: Low-light environments

#### 3. **Eye Care Theme** (Study & Community Only)
- **Primary**: `#4a7664` (Green-teal)
- **Secondary**: `#8b7355` (Brown)
- **Background**: `#1a1f1c` (Dark green-gray)
- **Text**: `#f5f1e6` (Warm beige)
- **Use Case**: Reduced eye strain for extended reading/studying

### Theme Availability

```javascript
{
  global: ['light', 'dark'],
  study: ['light', 'dark', 'eye-care'],
  community: ['light', 'dark', 'eye-care'],
}
```

### Implementing Themes

```jsx
import ThemeToggle from '@/components/ThemeToggle';

// Compact variant (cycles through themes)
<ThemeToggle variant="compact" availableThemes={['light', 'dark']} />

// Buttons variant (horizontal row)
<ThemeToggle 
  variant="buttons" 
  availableThemes={['light', 'dark', 'eye-care']}
  showLabels={true}
/>

// Dropdown variant
<ThemeToggle 
  variant="dropdown" 
  availableThemes={['light', 'dark', 'eye-care']}
  showLabels={true}
/>
```

---

## 🎨 Color System

### DaisyUI Color Tokens

All themes include the following color tokens:

```css
/* Primary Colors */
--primary
--primary-focus
--primary-content

/* Secondary Colors */
--secondary
--secondary-focus
--secondary-content

/* Accent Colors */
--accent
--accent-focus
--accent-content

/* Neutral Colors */
--neutral
--neutral-focus
--neutral-content

/* Base Colors */
--base-100 (background)
--base-200 (surface)
--base-300 (elevated surface)
--base-content (text)

/* State Colors */
--info
--success
--warning
--error
```

### Custom CSS Variables

```css
/* Additional Variables */
--bg (background)
--surface
--surface-elevated
--text
--text-muted
--border
```

### Usage in Components

```jsx
// Using DaisyUI classes
<div className="bg-base-100 text-base-content">
  <button className="btn btn-primary">Primary Button</button>
  <button className="btn btn-secondary">Secondary Button</button>
</div>

// Using custom CSS variables
<div style={{ background: 'var(--surface)', color: 'var(--text)' }}>
  Content
</div>
```

---

## ✍️ Typography

### Font Families

```css
font-sans: Inter, Poppins, system-ui, sans-serif
font-display: Poppins, Inter, system-ui, sans-serif
```

### Font Sizes

| Class | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `text-xs` | 0.75rem | 1rem | Small labels, captions |
| `text-sm` | 0.875rem | 1.25rem | Secondary text |
| `text-base` | 1rem | 1.5rem | Body text |
| `text-lg` | 1.125rem | 1.75rem | Emphasized text |
| `text-xl` | 1.25rem | 1.75rem | Subheadings |
| `text-2xl` | 1.5rem | 2rem | Section headings |
| `text-3xl` | 1.875rem | 2.25rem | Page headings |
| `text-4xl` | 2.25rem | 2.5rem | Hero headings |
| `text-5xl` | 3rem | 1 | Large displays |
| `text-6xl` | 3.75rem | 1 | Extra large displays |

### Font Weights

```css
font-light: 300
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
font-extrabold: 800
```

### Typography Examples

```jsx
<h1 className="text-4xl font-bold font-display text-gradient-primary">
  Hero Heading
</h1>

<h2 className="text-2xl font-semibold text-base-content">
  Section Heading
</h2>

<p className="text-base text-base-content/80">
  Body text with reduced opacity
</p>

<span className="text-sm text-base-content/60">
  Secondary text
</span>
```

---

## 📏 Spacing & Layout

### Border Radius

```css
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-2xl: 1.5rem (24px)
```

### Usage

```jsx
<div className="rounded-lg">Standard rounded</div>
<div className="rounded-xl">Extra rounded</div>
<div className="rounded-2xl">Very rounded</div>
```

---

## 🌑 Shadows

### Shadow System

| Class | Use Case |
|-------|----------|
| `shadow-subtle` | Minimal elevation |
| `shadow-subtle-lg` | Slight elevation |
| `shadow-medium` | Standard cards |
| `shadow-medium-lg` | Elevated cards |
| `shadow-strong` | Modals, dropdowns |
| `shadow-strong-lg` | High elevation |
| `shadow-glow-primary` | Primary glow effect |
| `shadow-glow-secondary` | Secondary glow effect |
| `shadow-inner-subtle` | Inset shadow |

### Examples

```jsx
<div className="shadow-medium rounded-lg p-4">
  Standard card
</div>

<div className="shadow-strong rounded-xl p-6">
  Elevated modal
</div>

<button className="shadow-glow-primary hover:shadow-glow-primary">
  Glowing button
</button>
```

---

## ✨ Animations

### Tailwind Animation Classes

```css
animate-fade-in
animate-fade-out
animate-slide-up
animate-slide-down
animate-scale-in
animate-shimmer
animate-pulse-slow
```

### Framer Motion Variants

Import from `@/lib/motionConfig`:

```javascript
import { variants, transitions, hover, stagger } from '@/lib/motionConfig';
```

#### Basic Animations

```jsx
import { motion } from 'framer-motion';
import { variants } from '@/lib/motionConfig';

<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={variants.fadeUp}
>
  Animated content
</motion.div>
```

#### Stagger Animations

```jsx
import { stagger } from '@/lib/motionConfig';

<motion.div variants={stagger.container(0.1)}>
  {items.map((item) => (
    <motion.div key={item.id} variants={stagger.item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Hover Effects

```jsx
import { hover } from '@/lib/motionConfig';

<motion.button {...hover.lift}>
  Lift on hover
</motion.button>

<motion.div {...hover.scale}>
  Scale on hover
</motion.div>
```

#### Page Transitions

```jsx
import { pageTransitions } from '@/lib/motionConfig';

<motion.div {...pageTransitions.slideUp}>
  Page content
</motion.div>
```

---

## 🧩 Components

### Utility Classes

#### Glass Effect

```jsx
<div className="glass rounded-lg p-6">
  Glassmorphism effect
</div>

<div className="glass-strong rounded-xl p-8">
  Strong glass effect
</div>
```

#### Gradients

```jsx
// Background gradients
<div className="gradient-primary rounded-lg p-6">
  Primary gradient background
</div>

<div className="gradient-secondary rounded-lg p-6">
  Secondary gradient background
</div>

<div className="gradient-abstract rounded-lg p-6">
  Abstract gradient background
</div>

// Text gradients
<h1 className="text-gradient-primary text-4xl font-bold">
  Gradient Text
</h1>
```

#### Surface Styles

```jsx
<div className="surface rounded-lg p-4">
  Standard surface
</div>

<div className="surface-elevated rounded-lg p-6">
  Elevated surface
</div>
```

#### Hover Effects

```jsx
<div className="hover-lift rounded-lg p-4">
  Lifts on hover
</div>

<div className="hover-glow rounded-lg p-4">
  Glows on hover
</div>
```

---

## 💡 Usage Examples

### Card Component

```jsx
import { motion } from 'framer-motion';
import { variants, hover } from '@/lib/motionConfig';

export default function Card({ title, description, children }) {
  return (
    <motion.div
      className="surface-elevated rounded-xl p-6"
      variants={variants.fadeUp}
      {...hover.lift}
    >
      <h3 className="text-xl font-semibold text-base-content mb-2">
        {title}
      </h3>
      <p className="text-sm text-base-content/70 mb-4">
        {description}
      </p>
      {children}
    </motion.div>
  );
}
```

### Button Component

```jsx
import { motion } from 'framer-motion';
import { hover } from '@/lib/motionConfig';

export default function Button({ children, variant = 'primary', ...props }) {
  const variants = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    ghost: 'btn btn-ghost',
  };

  return (
    <motion.button
      className={variants[variant]}
      {...hover.scale}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

### Modal Component

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { modal } from '@/lib/motionConfig';

export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            {...modal.backdrop}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            {...modal.content}
          >
            <div className="surface-elevated rounded-2xl p-8 max-w-md w-full mx-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## ✅ Best Practices

### 1. **Use Design Tokens**
Always use design tokens instead of hardcoded values:
```jsx
// ❌ Bad
<div style={{ color: '#111827' }}>

// ✅ Good
<div className="text-base-content">
```

### 2. **Consistent Animations**
Use predefined motion variants for consistency:
```jsx
// ❌ Bad
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
>

// ✅ Good
<motion.div variants={variants.fadeUp}>
```

### 3. **Theme-Aware Styling**
Ensure components work across all themes:
```jsx
// ✅ Good - Uses theme variables
<div className="bg-base-100 text-base-content border border-base-300">
```

### 4. **Accessibility**
- Use semantic HTML
- Ensure sufficient color contrast
- Add proper ARIA labels
- Support keyboard navigation

### 5. **Performance**
- Use `AnimatePresence` for exit animations
- Prefer CSS animations for simple effects
- Use `layoutId` for shared element transitions
- Implement `whileInView` for scroll animations

### 6. **Responsive Design**
Always consider mobile-first design:
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

---

## 📦 File Structure

```
src/
├── lib/
│   ├── designTokens.js      # Design system tokens
│   └── motionConfig.js      # Framer Motion configurations
├── components/
│   └── ThemeToggle.jsx      # Theme switcher component
├── app/
│   └── globals.css          # Global styles & CSS variables
└── tailwind.config.js       # Tailwind & DaisyUI configuration
```

---

## 🚀 Getting Started

1. **Import design tokens**:
```javascript
import { colors, typography, shadows } from '@/lib/designTokens';
```

2. **Import motion configs**:
```javascript
import { variants, transitions, hover } from '@/lib/motionConfig';
```

3. **Add theme toggle**:
```jsx
import ThemeToggle from '@/components/ThemeToggle';

<ThemeToggle variant="compact" availableThemes={['light', 'dark']} />
```

4. **Use utility classes**:
```jsx
<div className="glass rounded-xl p-6 shadow-medium">
  <h2 className="text-gradient-primary text-2xl font-bold">
    Beautiful Design
  </h2>
</div>
```

---

## 📚 Additional Resources

- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Poppins Font](https://fonts.google.com/specimen/Poppins)

---

**Version**: 2.0  
**Last Updated**: December 2025  
**Maintained by**: CrushEdu Team
