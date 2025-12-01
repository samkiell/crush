# CrushEdu Design System

## Themes

### Light (Default)
- **Primary**: `#2563eb`
- **Secondary**: `#f59e0b`
- **Background**: `#f8fafc`
- **Text**: `#111827`

### Dark
- **Primary**: `#3b82f6`
- **Secondary**: `#d97706`
- **Background**: `#0f172a`
- **Text**: `#f9fafb`

### Eye Care
- **Primary**: `#4a7664`
- **Secondary**: `#8b7355`
- **Background**: `#1a1f1c`
- **Text**: `#f5f1e6`

## Usage

### Theme Toggle
```jsx
import ThemeToggle from '@/components/ThemeToggle';

<ThemeToggle variant="compact" />
```

### Animated Components
```jsx
import { AnimatedCard, AnimatedButton } from '@/components/ui';

<AnimatedCard variant="glass">
  <AnimatedButton>Click Me</AnimatedButton>
</AnimatedCard>
```

## CSS Variables
- `--bg`, `--surface`, `--text`, `--primary`, `--secondary`
- `.glass`, `.gradient-primary`
