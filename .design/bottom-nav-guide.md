# Bottom Navigation - Implementation Guide

## 📦 Installation & Setup

### 1. Install Required Dependencies

```bash
npm install @heroicons/react
# Already installed in your project
```

### 2. Component Location

The component is located at:
```
src/components/layout/BottomNav.jsx
```

---

## 🚀 Integration Steps

### Step 1: Import into Root Layout

Add the BottomNav component to your root layout:

```jsx
// src/app/layout.jsx

import BottomNav from '@/components/layout/BottomNav';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
```

### Step 2: Add Bottom Padding to Pages

To prevent content from being hidden behind the bottom nav, add padding to your page containers:

```jsx
// Example: src/app/dashboard/page.jsx

export default function Dashboard() {
  return (
    <div className="pb-20 lg:pb-0"> {/* 80px padding on mobile, none on desktop */}
      {/* Your page content */}
    </div>
  );
}
```

**OR** use a wrapper component:

```jsx
// src/components/layout/PageWrapper.jsx

export default function PageWrapper({ children }) {
  return (
    <div className="pb-20 lg:pb-0 min-h-screen">
      {children}
    </div>
  );
}
```

### Step 3: Configure Routes (If Needed)

Ensure your route structure matches the navigation:

```
src/app/
├── dashboard/page.jsx       → "Home" tab
├── past-questions/page.jsx  → "Past Questions" tab
├── community/page.jsx       → "Community" tab
├── chat/page.jsx            → "Chat" tab
└── profile/page.jsx         → "Profile" tab
```

---

## ⚙️ Customization Options

### Changing Navigation Items

Edit the `navItems` array in `BottomNav.jsx`:

```jsx
const navItems = [
  {
    name: 'Home',
    href: '/dashboard',
    iconOutline: HomeOutline,
    iconFilled: HomeFilled,
    badge: 0
  },
  // Add or modify items here
];
```

### Dynamic Badge Counts

Replace hardcoded badge values with state/props:

```jsx
'use client';

import { useSelector } from 'react-redux';

const BottomNav = () => {
  const unreadMessages = useSelector(state => state.chat.unreadCount);
  const communityNotifications = useSelector(state => state.community.notificationCount);

  const navItems = [
    // ...
    {
      name: 'Community',
      href: '/community',
      badge: communityNotifications
    },
    {
      name: 'Chat',
      href: '/chat',
      badge: unreadMessages
    }
  ];
  
  // Rest of component
};
```

### Changing Active Detection Logic

Modify the `isActive` function for custom route matching:

```jsx
const isActive = (href) => {
  // Example: Exact match only
  return pathname === href;
  
  // Example: Include sub-routes
  return pathname?.startsWith(href);
  
  // Example: Multiple paths for one tab
  if (href === '/dashboard') {
    return ['/dashboard', '/', '/home'].includes(pathname);
  }
  return pathname?.startsWith(href);
};
```

---

## 🎨 Styling Customization

### Changing Colors

The component uses DaisyUI theme tokens. Customize in `tailwind.config.js`:

```js
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#3B82F6',      // Active tab color
          'base-100': '#FFFFFF',     // Nav background
          'base-300': '#E5E7EB',     // Border color
          'base-content': '#1F2937', // Text color
        },
        dark: {
          'primary': '#60A5FA',
          'base-100': '#1F2937',
          'base-300': '#374151',
          'base-content': '#F9FAFB',
        }
      }
    ]
  }
};
```

### Adjusting Sizes

Edit Tailwind classes in the component:

```jsx
// Icon size
<Icon className="w-6 h-6" /> // Change w-6 h-6 to w-7 h-7 for larger icons

// Label size
<span className="text-[10px]" /> // Change to text-[11px] or text-xs

// Container height
<div className="h-16" /> // Change to h-20 for taller nav
```

---

## 📱 Responsive Behavior

### Hide on Desktop

The navigation already hides on large screens (`lg:hidden`). To show it on all devices:

```jsx
// Remove lg:hidden from the nav element
<nav className="fixed bottom-0 left-0 right-0 z-50">
  {/* ... */}
</nav>
```

### Tablet-Specific Behavior

```jsx
<nav className="fixed bottom-0 left-0 right-0 z-50 xl:hidden">
  {/* Hidden on extra-large screens (1280px+) */}
</nav>
```

---

## ♿ Accessibility Features

### Built-in Accessibility

- ✅ ARIA labels on all tabs
- ✅ `aria-current="page"` on active tab
- ✅ Semantic `<nav>` element
- ✅ Min 48×48px touch targets
- ✅ Keyboard navigation support (arrow keys)
- ✅ Screen reader friendly badge counts

### Testing Accessibility

```bash
# Run Lighthouse audit
npm run build
npx serve@latest out

# Check with screen reader:
# - VoiceOver (Mac): Cmd + F5
# - NVDA (Windows): Download from nvaccess.org
```

---

## 🧪 Testing the Navigation

### Manual Testing Checklist

- [ ] All 5 tabs navigate correctly
- [ ] Active state persists on page refresh
- [ ] Badges display correct counts
- [ ] Smooth transitions between tabs
- [ ] Works in light/dark/dim themes
- [ ] No layout shift when loading
- [ ] Doesn't overlap with page content
- [ ] iOS safe area padding works (test on iPhone)

### Visual Regression Testing

Open the demo page:

```bash
# Open in your browser
start .design/bottom-nav-demo.html  # Windows
open .design/bottom-nav-demo.html   # Mac
```

Test these states:
1. Click each tab to verify active states
2. Switch between light/dark/dim themes
3. Resize browser to test mobile → desktop
4. Use keyboard navigation (arrow keys)

---

## 🔧 Troubleshooting

### Issue: Navigation not showing

**Check:**
- Is `BottomNav` imported in `layout.jsx`?
- Is `position: fixed` being overridden by another style?
- Is `z-index: 50` high enough?

**Fix:**
```jsx
// Ensure it's outside any position: relative containers
<body>
  <main>{children}</main>
  <BottomNav /> {/* Should be sibling to main, not child */}
</body>
```

### Issue: Active state not updating

**Check:**
- Is `'use client'` at the top of `BottomNav.jsx`?
- Does `usePathname()` return expected values?

**Debug:**
```jsx
const pathname = usePathname();
console.log('Current path:', pathname); // Add this
```

### Issue: Icons not rendering

**Check:**
- Is `@heroicons/react` installed?
- Are imports using correct version (v2)?

**Fix:**
```bash
npm install @heroicons/react@latest
```

### Issue: Content hidden behind nav

**Add padding to pages:**
```jsx
<div className="pb-20 lg:pb-0">
  {/* Your content */}
</div>
```

---

## 🎯 Performance Optimization

### Code Splitting

The component is already optimized with:
- Client-only rendering (`'use client'`)
- Tree-shakeable icon imports
- No unnecessary re-renders

### Reduce Bundle Size

Use only needed icons:

```jsx
// Instead of importing all icons, import only what you use
import { HomeIcon } from '@heroicons/react/24/solid';
// Don't import the entire library
```

### Memoization (Optional)

For apps with frequent re-renders:

```jsx
import { memo } from 'react';

const NavItem = memo(({ item, isActive }) => {
  // Component code
});

export default memo(BottomNav);
```

---

## 📊 Analytics Integration

Track navigation events:

```jsx
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const BottomNav = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href
      });
    }
  }, [pathname]);

  // Rest of component
};
```

Or track individual tab clicks:

```jsx
<Link
  href={item.href}
  onClick={() => {
    // Track with your analytics service
    window.gtag?.('event', 'nav_click', {
      tab_name: item.name,
      destination: item.href
    });
  }}
>
  {/* ... */}
</Link>
```

---

## 🚢 Production Deployment

### Pre-deployment Checklist

- [ ] Test on real mobile devices (iOS & Android)
- [ ] Verify safe area insets on iPhone with notch
- [ ] Check performance (should be < 10ms render time)
- [ ] Ensure no console errors
- [ ] Test with slow network (throttle to 3G)
- [ ] Validate accessibility with automated tools

### Build Optimization

```bash
# Build for production
npm run build

# Analyze bundle size
npx @next/bundle-analyzer
```

---

## 📚 Additional Resources

- [Heroicons Documentation](https://heroicons.com/)
- [DaisyUI Themes](https://daisyui.com/docs/themes/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open the demo file (`.design/bottom-nav-demo.html`) to see expected behavior
3. Review the spec document (`.design/bottom-nav-spec.md`)

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Component**: BottomNav.jsx  
**Design System**: Tailwind CSS + DaisyUI
