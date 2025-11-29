# 🎯 Dashboard Quick Reference Card

## Components Map

```javascript
Dashboard Page
├── DashboardHeader         // Sticky top bar
│   ├── Search (expandable)
│   ├── Streak counter (🔥 12 days)
│   ├── Notifications (dropdown)
│   └── User avatar
│
├── HeroBanner              // Welcome section
│   ├── Greeting ("Welcome back, SAMKIEL!")
│   ├── Exam countdown (3 days to JAMB)
│   ├── Daily goal (5/8 topics)
│   └── Streak display
│
├── Main Content (8 cols)
│   ├── DailyPlanSection    // Time blocks
│   │   ├── 9:00 AM - Chemistry (completed)
│   │   ├── 11:00 AM - Math (in-progress)
│   │   ├── 2:00 PM - English (pending)
│   │   └── Next Up card
│   │
│   └── PerformanceDashboard
│       ├── Weekly activity heatmap
│       ├── Subject performance bars
│       └── Topic mastery progress
│
├── Sidebar (4 cols)
│   ├── AIInsightsPanel     // ML predictions
│   │   ├── Mastery prediction (~4 days)
│   │   ├── Focus recommendation
│   │   ├── Peak performance time
│   │   └── Difficulty adapter
│   │
│   └── GamificationHub
│       ├── Streak card (12 days 🔥)
│       ├── Badge showcase (4 badges)
│       ├── Leaderboard (top 5)
│       └── Daily challenge (3 tasks)
│
├── QuickActionsDock        // Floating/Bottom
│   ├── Resume (pulsing)
│   ├── Bookmarks (badge: 5)
│   ├── Community (badge: 2)
│   └── Practice
│
└── NotificationPanel       // Dropdown
    ├── Streak risk
    ├── Exam countdown
    ├── Achievements
    ├── Community replies
    └── AI recommendations
```

## Color Coding

| Subject      | Badge Color    | Hex       |
|--------------|----------------|-----------|
| Mathematics  | `badge-primary`| `#7C3AED` |
| English      | `badge-secondary`| `#06B6D4` |
| Physics      | `badge-accent` | `#F59E0B` |
| Chemistry    | `badge-info`   | `#3B82F6` |
| Biology      | `badge-success`| `#10B981` |

## Status Indicators

| Status       | Icon           | Color      |
|--------------|----------------|------------|
| Completed    | ✓ CheckCircle  | Green      |
| In Progress  | ▶ PlayCircle   | Purple (pulse) |
| Pending      | ○ Circle       | Gray       |
| Weak Topic   | ! AlertCircle  | Red/Warning|

## Files Reference

```
src/
├── app/dashboard/page.jsx
└── components/dashboard/
    ├── DashboardHeader.jsx
    ├── HeroBanner.jsx
    ├── DailyPlanSection.jsx
    ├── AIInsightsPanel.jsx
    ├── PerformanceDashboard.jsx
    ├── GamificationHub.jsx
    ├── QuickActionsDock.jsx
    └── NotificationPanel.jsx
```

## Props Interface

### DashboardHeader
```typescript
{ user: { username: string, avatar?: string } }
```

### HeroBanner
```typescript
{
  user: { username: string },
  stats: { dailyGoal: number, streak: number }
}
```

### DailyPlanSection
```typescript
{
  stats: {
    dailyPlan: Array<{
      time: string,
      subject: string,
      topic: string,
      status: 'completed' | 'in-progress' | 'pending',
      progress: number
    }>
  }
}
```

### AIInsightsPanel
```typescript
{
  stats: {
    predictions: Array<AIInsight>,
    recommendations: Array<Recommendation>
  }
}
```

### PerformanceDashboard
```typescript
{
  stats: { subjects: Array, topics: Array },
  progress: Array<{ date: string, score: number }>
}
```

### GamificationHub
```typescript
{
  stats: { badges: Array, leaderboard: Array },
  user: { username: string, points: number }
}
```

## Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  - Single column
  - Bottom quick actions
  - Stacked sections
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  - 2 column grid
  - Some quick actions visible
}

/* Desktop */
@media (min-width: 1024px) {
  - 12 column grid (8 + 4)
  - Floating quick actions (right)
  - Full layout
}
```

## Animation Classes

```css
/* Pulse (for Resume button, Streak) */
.animate-pulse

/* Scale on hover */
.hover:scale-105
.hover:scale-[1.02]

/* Backdrop blur */
.backdrop-blur-xl

/* Transitions */
.transition-all (250ms)
.duration-500 (progress bars)
```

## Quick Customization

### Change Primary Color
```javascript
// tailwind.config.js
daisyui: {
  themes: [{
    light: {
      "primary": "#7C3AED", // Change this
    }
  }]
}
```

### Adjust Exam Date
```javascript
// HeroBanner.jsx line 7
const examDate = new Date('2025-05-15'); // Change this
```

### Modify Daily Goal
```javascript
// HeroBanner.jsx line 10-11
const dailyGoalProgress = 5; // Current
const dailyGoalTotal = 8;    // Target
```

### Update Streak Value
```javascript
// HeroBanner.jsx line 12
const currentStreak = 12; // Days
```

## Common Tasks

### Add a new notification type
```javascript
// NotificationPanel.jsx
const getIconColor = (type) => {
  colors.your_new_type = 'text-custom-color';
};
```

### Add a new badge
```javascript
// GamificationHub.jsx badges array
{
  id: 5,
  name: 'Your Badge',
  description: 'Description',
  icon: '🎯',
  unlocked: false,
}
```

### Change leaderboard filter
```javascript
// GamificationHub.jsx
<button className="btn btn-xs btn-primary">
  Your Filter
</button>
```

## Testing URLs

```
Development: http://localhost:3000/dashboard
Production:  https://your-domain.com/dashboard
```

## Dependencies Used

- `lucide-react` - Icons
- `date-fns` - Date formatting
- `next/navigation` - Routing
- `react-redux` - State
- DaisyUI - UI components

## Performance Tips

1. **Lazy load charts**: Use React.lazy() for AnalyticsChart
2. **Memoize components**: Use React.memo for static sections
3. **Virtualize lists**: If leaderboard grows >20 items
4. **Debounce search**: Add 300ms delay on search input
5. **Cache API calls**: Use SWR or React Query

---

**Quick Start**: Navigate to `/dashboard` after authentication
**Status**: ✅ Production Ready
**Last Updated**: 2025-11-29
