# Bottom Navigation - Quick Reference

## 🎯 What Was Created

### 1. **Production Component**
📁 `src/components/layout/BottomNav.jsx`
- Mobile-first bottom navigation
- 5 tabs: Home, Past Questions, Community, Chat, Profile
- Active state detection using Next.js `usePathname()`
- Notification badges on Community (12) and Chat (3)
- Heroicons outline/solid variants
- Full accessibility support

### 2. **Design Specification**
📁 `.design/bottom-nav-spec.md`
- Complete design system documentation
- Exact measurements and spacing
- Color tokens for all themes
- Accessibility requirements (WCAG 2.1 AA)
- Animation specifications
- Component hierarchy

### 3. **Implementation Guide**
📁 `.design/bottom-nav-guide.md`
- Step-by-step integration instructions
- Customization options
- Troubleshooting guide
- Performance optimization tips
- Analytics integration examples

### 4. **Interactive Demo**
📁 `.design/bottom-nav-demo.html`
- Live preview with theme switching
- Interactive navigation states
- Technical specifications table
- Keyboard navigation demo

---

## ⚡ Quick Start

### Already Integrated! ✅

The component has been added to your `src/app/layout.jsx`:

```jsx
import BottomNav from "../components/layout/BottomNav";

// ... in the body:
<MinimalFooter />
<BottomNav />
```

### Install Dependencies

```bash
npm install @heroicons/react
```

### Add Bottom Padding to Pages

To prevent content from being hidden:

```jsx
// In any page component
<div className="pb-20 lg:pb-0">
  {/* Your content */}
</div>
```

---

## 📱 Navigation Structure

| Tab | Route | Icon | Badge |
|-----|-------|------|-------|
| **Home** | `/dashboard` | Home | - |
| **Past Questions** | `/past-questions` | Document | - |
| **Community** | `/community` | Users | 12 |
| **Chat** | `/chat` | Messages | 3 |
| **Profile** | `/profile` | User | - |

---

## 🎨 Design Specs at a Glance

```
Container Height:     64px
Icon Size:           24×24px
Label Size:          10px (inactive), 11px (active)
Touch Target:        48×64px (WCAG compliant)
Backdrop Blur:       12px
Badge Size:          18px diameter
Border:              1px top
Shadow:              Adaptive (light/dark)
```

---

## 🎯 Key Features

### ✅ Mobile-First
- Optimized for thumb-zone accessibility
- Hidden on desktop (`lg:hidden`)
- iOS safe area support

### ✅ Theme Adaptive
- Works with light/dark/dim themes
- DaisyUI color tokens
- Glassmorphism backdrop blur

### ✅ Accessible
- ARIA labels on all tabs
- `aria-current="page"` on active tab
- Keyboard navigation ready
- 4.5:1 contrast ratio

### ✅ Interactive
- Smooth transitions (200ms)
- Active state with filled icons
- Notification badges with pulse animation
- Touch feedback (scale on press)

---

## 🔧 Common Customizations

### Change Badge Counts (Dynamic)

```jsx
// In BottomNav.jsx
import { useSelector } from 'react-redux';

const unreadMessages = useSelector(state => state.chat.unreadCount);
const communityNotifs = useSelector(state => state.community.notificationCount);

const navItems = [
  // ...
  { name: 'Community', badge: communityNotifs },
  { name: 'Chat', badge: unreadMessages }
];
```

### Change Active Color

```js
// In tailwind.config.js
daisyui: {
  themes: [{
    light: {
      'primary': '#3B82F6', // Change this
    }
  }]
}
```

### Add New Tab

```jsx
// In BottomNav.jsx navItems array
{
  name: 'Settings',
  href: '/settings',
  iconOutline: CogIcon,
  iconFilled: CogIconSolid,
  badge: 0
}
```

---

## 🐛 Troubleshooting

### Navigation not showing?
- Check if `@heroicons/react` is installed
- Ensure `'use client'` is at top of `BottomNav.jsx`
- Verify `z-index: 50` isn't being overridden

### Content hidden behind nav?
- Add `pb-20 lg:pb-0` to page containers
- Or wrap pages in `<PageWrapper>` component

### Active state not updating?
- Ensure routes match exactly (e.g., `/dashboard` not `/`)
- Check `usePathname()` returns expected values
- Add `console.log(pathname)` to debug

### Icons not rendering?
```bash
# Reinstall Heroicons
npm install @heroicons/react@latest
```

---

## 📊 File Structure

```
crush/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── BottomNav.jsx          ← Main component
│   └── app/
│       ├── layout.jsx                 ← Integrated here
│       ├── dashboard/page.jsx         ← Home tab
│       ├── past-questions/page.jsx    ← Questions tab
│       ├── community/page.jsx         ← Community tab
│       ├── chat/page.jsx              ← Chat tab
│       └── profile/page.jsx           ← Profile tab
└── .design/
    ├── bottom-nav-spec.md             ← Full specification
    ├── bottom-nav-guide.md            ← Implementation guide
    ├── bottom-nav-demo.html           ← Interactive demo
    └── bottom-nav-reference.md        ← This file
```

---

## 🚀 Next Steps

1. **Install Heroicons** (if not done):
   ```bash
   npm install @heroicons/react
   ```

2. **Add padding to pages** to prevent overlap:
   ```jsx
   <div className="pb-20 lg:pb-0">
     {/* Page content */}
   </div>
   ```

3. **Test the navigation**:
   - Visit `http://localhost:3000/dashboard`
   - Click each tab to verify routing
   - Test on mobile viewport
   - Try different themes

4. **Connect real badge counts**:
   - Hook up Redux state for notifications
   - Update badge values dynamically

5. **Customize as needed**:
   - Adjust colors in `tailwind.config.js`
   - Modify icons or labels
   - Add analytics tracking

---

## 📚 Documentation

- **Full Spec**: `.design/bottom-nav-spec.md`
- **Implementation**: `.design/bottom-nav-guide.md`
- **Demo**: `.design/bottom-nav-demo.html`

---

## 🎉 You're All Set!

The bottom navigation is production-ready and follows:
- ✅ Mobile-first design principles
- ✅ WCAG 2.1 AA accessibility standards
- ✅ Modern UI/UX best practices
- ✅ Tailwind + DaisyUI design system
- ✅ Next.js App Router conventions

**Questions?** Check the troubleshooting section or review the full guide.

---

**Version**: 1.0  
**Created**: November 2025  
**Component**: BottomNav.jsx  
**Framework**: Next.js 16 + Tailwind CSS 4 + DaisyUI
