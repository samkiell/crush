# Bottom Navigation Design Specification
## Exam-Prep Platform - Mobile-First Navigation System

---

## 1. Design Philosophy

**Core Principles:**
- **Thumb-Zone Optimization**: All targets within natural thumb reach (bottom 25% of screen)
- **Clarity Over Cleverness**: Instant recognition, zero cognitive load
- **Adaptive Aesthetics**: Seamless transitions across light/dark/dim themes
- **Accessibility First**: WCAG 2.1 AA compliant, 44×44px minimum touch targets

---

## 2. Navigation Structure

### Tab Configuration (5 Items)

| Position | Tab Name       | Primary Function              | Icon Type    |
|----------|----------------|-------------------------------|--------------|
| 1        | Home           | Dashboard overview            | Outline/Filled |
| 2        | Past Questions | Question bank & practice      | Outline/Filled |
| 3        | Community      | Discussion & peer support     | Outline/Filled |
| 4        | Chat           | Direct messaging              | Outline/Filled |
| 5        | Profile        | User account & settings       | Outline/Filled |

---

## 3. Visual Specifications

### Layout & Spacing

```
Container Height: 64px (mobile), 68px (tablet+)
Safe Area Padding: 20px bottom (iOS notch compatibility)
Item Width: Equal distribution (20% each for 5 items)
Icon Size: 24×24px
Label Font Size: 11px (active), 10px (inactive)
Spacing Between Icon & Label: 4px
```

### Touch Targets

```
Minimum Tap Area: 48×48px (exceeds 44px WCAG minimum)
Active Hit Area: Full vertical height (64px)
Horizontal Spacing: Auto-distributed with min 8px gap
```

### Border & Shadow

```
Top Border: 1px solid (theme-dependent)
Backdrop Blur: 12px (glassmorphism effect)
Shadow (Light Mode): 0 -2px 8px rgba(0, 0, 0, 0.04)
Shadow (Dark Mode): 0 -2px 12px rgba(0, 0, 0, 0.3)
Border Radius: 0 (full-width) or 24px 24px 0 0 (floating variant)
```

---

## 4. State System

### Active State
```
Icon: Filled variant + Primary color
Label: Primary color, font-weight: 600
Transform: translateY(-2px) with 200ms ease
Background: Subtle glow/highlight (optional)
```

### Inactive State
```
Icon: Outline variant + Muted color
Label: Muted color (text-base-content/60), font-weight: 500
Transform: none
Opacity: 0.7
```

### Hover State (Desktop/Tablet)
```
Opacity: 1
Transform: scale(1.05)
Transition: 150ms ease-out
```

### Pressed State
```
Transform: scale(0.95)
Transition: 100ms ease-in
```

### Notification Badge (Chat/Community)
```
Size: 18px diameter
Position: Top-right of icon (offset: -6px, -4px)
Background: Red (#EF4444 light, #DC2626 dark)
Text: 9px, white, bold
Max Value: 99+ (overflow handling)
```

---

## 5. Color Tokens (Tailwind DaisyUI)

### Light Theme
```css
Background: bg-base-100/95 backdrop-blur-xl
Border: border-base-300
Active Icon/Text: text-primary (hsl(var(--p)))
Inactive Icon/Text: text-base-content/60
Shadow: shadow-[0_-2px_8px_rgba(0,0,0,0.04)]
```

### Dark Theme
```css
Background: bg-base-100/90 backdrop-blur-xl
Border: border-base-300/20
Active Icon/Text: text-primary (hsl(var(--p)))
Inactive Icon/Text: text-base-content/50
Shadow: shadow-[0_-2px_12px_rgba(0,0,0,0.3)]
```

### Dim/Eye-Care Theme
```css
Background: bg-base-100/92 backdrop-blur-xl
Border: border-base-300/30
Active Icon/Text: text-primary
Inactive Icon/Text: text-base-content/55
```

---

## 6. Icon Set Recommendations

**Primary Choice: Heroicons v2** (outline + solid variants)
- `HomeIcon` → Home/Dashboard
- `DocumentTextIcon` → Past Questions
- `UserGroupIcon` → Community
- `ChatBubbleLeftRightIcon` → Chat
- `UserCircleIcon` → Profile

**Alternative: Lucide React** (consistent stroke width)
- `Home` → Home
- `FileText` → Past Questions
- `Users` → Community
- `MessageCircle` → Chat
- `User` → Profile

**Fallback: Tabler Icons** (clean, minimal)

---

## 7. Responsive Behavior

### Mobile (< 640px)
```
- Full-width sticky bottom bar
- Icon + label both visible
- 5 equal-width items
- Safe area padding enabled
```

### Tablet (640px - 1024px)
```
- Same as mobile
- Optional: Slightly larger icons (26px)
- Enhanced hover states
```

### Desktop (> 1024px)
```
- Hidden by default (use sidebar navigation)
- OR: Transform to compact floating dock (optional)
- Show on scroll down, hide on scroll up (optional UX enhancement)
```

---

## 8. Animation Specifications

### Page Transition
```javascript
Active Tab Change:
- Icon swap: 200ms ease-in-out (outline → filled)
- Color transition: 200ms ease
- Label weight: 150ms ease
- Vertical lift: transform translateY(-2px), 200ms ease-out
```

### Micro-interactions
```javascript
Tap/Click:
- Scale down: 0.95, 100ms ease-in
- Scale up: 1.0, 150ms ease-out
- Ripple effect: Optional (300ms fade-out)
```

### Badge Animation (New Message/Notification)
```javascript
Entry: Scale from 0 to 1, 300ms spring (bounce)
Pulse: Subtle scale 1.0 → 1.1 → 1.0 every 2s (if unread)
Exit: Fade + scale to 0, 200ms ease-in
```

---

## 9. Accessibility Requirements

### Keyboard Navigation
```
- Tab order: Left to right (Home → Profile)
- Enter/Space: Activate tab
- Arrow keys: Navigate between tabs
- Focus indicator: 2px solid ring-primary with offset
```

### Screen Reader Support
```html
<nav aria-label="Main Navigation">
  <button 
    role="tab" 
    aria-selected="true/false"
    aria-label="Home - Dashboard overview"
    aria-current="page" (if active)
  >
    <!-- Icon + Label -->
  </button>
</nav>
```

### Color Contrast
- Active text: Minimum 4.5:1 contrast ratio
- Inactive text: Minimum 3:1 contrast ratio
- Icons: Use stroke-width of 2px for clarity

---

## 10. Implementation Hierarchy

### Component Structure
```
<BottomNav> (Container)
├── <nav> (Semantic wrapper)
│   ├── <NavItem active={true}> (Home)
│   │   ├── <Icon variant="filled" />
│   │   ├── <Badge count={0} />
│   │   └── <Label>Home</Label>
│   │
│   ├── <NavItem active={false}> (Past Questions)
│   │   └── ...
│   │
│   ├── <NavItem active={false}> (Community)
│   │   └── <Badge count={12} />
│   │
│   ├── <NavItem active={false}> (Chat)
│   │   └── <Badge count={3} />
│   │
│   └── <NavItem active={false}> (Profile)
│       └── ...
```

### CSS Class Hierarchy (Tailwind)
```
Container: fixed bottom-0 w-full bg-base-100/95 backdrop-blur-xl border-t z-50
Item: flex flex-col items-center justify-center flex-1 h-16 transition-all
Icon Wrapper: relative (for badge positioning)
Label: text-[10px] font-medium transition-colors
Badge: absolute -top-1 -right-1 badge badge-error badge-xs
```

---

## 11. Production Checklist

- [ ] Sticky positioning with `z-index: 50` (above content, below modals)
- [ ] Backdrop blur for glassmorphism effect
- [ ] Safe area insets for iOS notch/home indicator
- [ ] Active state persists across page navigations
- [ ] Notification badges update in real-time
- [ ] Smooth transitions (no janky animations)
- [ ] Works with `next/link` prefetching
- [ ] Dark mode auto-detection via system preference
- [ ] Touch ripple effect (optional, via Framer Motion)
- [ ] Analytics tracking on tab switches

---

## 12. Code Integration Pattern (Next.js)

### File Structure
```
src/
├── components/
│   └── layout/
│       ├── BottomNav.jsx
│       └── NavItem.jsx
├── app/
│   ├── layout.jsx (wrap with BottomNav)
│   ├── dashboard/page.jsx
│   ├── past-questions/page.jsx
│   ├── community/page.jsx
│   ├── chat/page.jsx
│   └── profile/page.jsx
```

### Usage Example
```jsx
// In app/layout.jsx
import BottomNav from '@/components/layout/BottomNav';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
```

---

## 13. Performance Considerations

- **Icon Loading**: Use SVG sprites or tree-shakeable icon libraries
- **Animation**: Use CSS transforms (GPU-accelerated) over position changes
- **Re-renders**: Memoize NavItem components to prevent unnecessary renders
- **Bundle Size**: Lazy-load badge notification logic if not always needed

---

## 14. Future Enhancements (Phase 2)

- [ ] Haptic feedback on tap (iOS/Android PWA)
- [ ] Custom tab highlighting animations
- [ ] Mid-action FAB (Floating Action Button) for quick actions
- [ ] Swipe gestures to switch between tabs
- [ ] Long-press context menus on tabs
- [ ] Personalized tab order (drag-to-reorder)

---

**Designed for**: Crush Exam Prep Platform  
**Design System**: Tailwind CSS + DaisyUI  
**Framework**: Next.js 14/15  
**Version**: 1.0  
**Last Updated**: November 2025
