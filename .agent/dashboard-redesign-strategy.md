# Dashboard Redesign Strategy
## JAMB/OAU PUTME Exam Prep Platform

**Project**: DEVOUR TO CRUSH  
**Date**: November 29, 2025  
**Designer**: SAMKIEL

---

## 1. High-Level UI Wireframe Description

### 1.1 Dashboard Layout Architecture

The dashboard follows a **modular grid system** with responsive breakpoints optimized for mobile-first experiences.

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Sticky)                                            │
│  [Logo] [Search] [Notifications] [Streak] [Profile]        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  HERO BANNER (Personalized Welcome)                         │
│  "Welcome back, SAMKIEL! You're 3 days away from JAMB"      │
│  [Daily Goal: 5/8 topics] [Current Streak: 🔥 12 days]     │
└─────────────────────────────────────────────────────────────┘
┌──────────────────────┬──────────────────────────────────────┐
│  SIDEBAR (Desktop)   │  MAIN CONTENT AREA                   │
│  - Dashboard         │  ┌────────────────────────────────┐  │
│  - Study Plan        │  │ TODAY'S PLAN                   │  │
│  - Practice          │  │ [Time Block Cards]             │  │
│  - Progress          │  │ • 9:00 AM - Chemistry (Redox) │  │
│  - Community         │  │ • 11:00 AM - Math (Calculus)  │  │
│  - Resources         │  └────────────────────────────────┘  │
│                      │                                      │
│                      │  ┌────────────────────────────────┐  │
│                      │  │ AI INSIGHTS                    │  │
│                      │  │ [Prediction Cards]             │  │
│                      │  └────────────────────────────────┘  │
│                      │                                      │
│                      │  ┌────────────────────────────────┐  │
│                      │  │ PERFORMANCE METRICS            │  │
│                      │  │ [Charts & Heatmaps]            │  │
│                      │  └────────────────────────────────┘  │
└──────────────────────┴──────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  QUICK ACTIONS BAR (Floating/Sticky Bottom - Mobile)       │
│  [Resume] [Bookmark] [Community] [Help]                    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Key Dashboard Zones

#### Zone 1: Personalized Daily Plan (Top Priority)
- **Location**: Upper main content area
- **Purpose**: Show daily study schedule with real-time progress
- **Elements**:
  - Time-block cards for each study session
  - Progress rings showing completion percentage
  - AI-recommended "Next Up" card with estimated time
  - "Behind Schedule" alerts with catch-up suggestions

#### Zone 2: AI Insights Panel
- **Location**: Right sidebar on desktop, below daily plan on mobile
- **Purpose**: Display AI-powered predictions and recommendations
- **Elements**:
  - Predicted mastery timeline for weak topics
  - Suggested focus areas based on exam proximity
  - Adaptive difficulty recommendations
  - "You vs. Top Performers" comparison

#### Zone 3: Performance Dashboard
- **Location**: Center-bottom main content area
- **Purpose**: Visual analytics of study performance
- **Elements**:
  - Weekly activity heatmap (GitHub-style)
  - Subject-wise performance radar chart
  - Trend graphs (accuracy over time)
  - Topic mastery progress bars

#### Zone 4: Gamification Hub
- **Location**: Top-right corner & dedicated tab
- **Purpose**: Display achievements and competitive elements
- **Elements**:
  - Current streak counter with flame animation
  - Recent badges earned (carousel)
  - Leaderboard widget (top 5 visible, expandable)
  - Daily challenge card

#### Zone 5: Quick Actions Dock
- **Location**: Floating bottom bar (mobile) / Sidebar (desktop)
- **Purpose**: One-tap access to frequent actions
- **Buttons**:
  - Resume Last Exam (green, pulsing if active)
  - Bookmarks (yellow star icon)
  - Community Feed (blue chat icon)
  - Ask AI Tutor (purple sparkle icon)

#### Zone 6: Notification Center
- **Location**: Dropdown from header bell icon
- **Purpose**: Time-sensitive alerts and reminders
- **Content**:
  - Exam countdown reminders
  - Study streak at-risk warnings
  - New community responses
  - Recommended study time alerts

---

## 2. Component Hierarchy

### 2.1 Atomic Design Structure

```
📦 Dashboard
├── 🧩 Organisms
│   ├── DashboardHeader
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── NotificationBell
│   │   ├── StreakCounter
│   │   └── UserAvatar
│   │
│   ├── HeroBanner
│   │   ├── PersonalizedGreeting
│   │   ├── ExamCountdown
│   │   └── DailyGoalProgress
│   │
│   ├── DailyPlanSection
│   │   ├── TimeBlockCard (multiple)
│   │   ├── NextUpCard
│   │   └── ProgressSummary
│   │
│   ├── AIInsightsPanel
│   │   ├── MasteryPredictionCard
│   │   ├── FocusRecommendationCard
│   │   ├── DifficultyAdapterCard
│   │   └── PerformanceComparisonCard
│   │
│   ├── PerformanceDashboard
│   │   ├── ActivityHeatmap
│   │   ├── SubjectRadarChart
│   │   ├── TrendLineGraph
│   │   └── TopicProgressBars
│   │
│   ├── GamificationHub
│   │   ├── StreakDisplay
│   │   ├── BadgeCarousel
│   │   ├── LeaderboardWidget
│   │   └── DailyChallengeCard
│   │
│   ├── QuickActionsDock
│   │   └── ActionButton (multiple)
│   │
│   └── NotificationPanel
│       └── NotificationItem (multiple)
│
├── 🔷 Molecules
│   ├── TimeBlockCard
│   │   ├── TimeLabel
│   │   ├── SubjectIcon
│   │   ├── TopicTitle
│   │   ├── ProgressRing
│   │   └── QuickStartButton
│   │
│   ├── MetricCard
│   │   ├── IconBadge
│   │   ├── StatValue
│   │   ├── StatLabel
│   │   └── TrendIndicator
│   │
│   ├── BadgeItem
│   │   ├── BadgeIcon
│   │   ├── BadgeTitle
│   │   └── UnlockDate
│   │
│   ├── LeaderboardRow
│   │   ├── Rank
│   │   ├── UserAvatar
│   │   ├── Username
│   │   └── Score
│   │
│   └── NotificationItem
│       ├── Icon
│       ├── Message
│       ├── Timestamp
│       └── ActionButton
│
└── ⚛️ Atoms
    ├── Button (Primary, Secondary, Ghost)
    ├── Icon (System icons)
    ├── Badge (Status, Achievement)
    ├── ProgressRing
    ├── ProgressBar
    ├── Avatar
    ├── Chip (Topic tags)
    ├── Tooltip
    └── Skeleton (Loading states)
```

### 2.2 Component File Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── DailyPlanSection.jsx
│   │   ├── AIInsightsPanel.jsx
│   │   ├── PerformanceDashboard.jsx
│   │   ├── GamificationHub.jsx
│   │   ├── QuickActionsDock.jsx
│   │   └── NotificationPanel.jsx
│   │
│   ├── cards/
│   │   ├── TimeBlockCard.jsx
│   │   ├── MetricCard.jsx
│   │   ├── BadgeCard.jsx
│   │   ├── MasteryPredictionCard.jsx
│   │   └── DailyChallengeCard.jsx
│   │
│   ├── charts/
│   │   ├── ActivityHeatmap.jsx
│   │   ├── RadarChart.jsx
│   │   ├── TrendGraph.jsx
│   │   └── ProgressVisualizer.jsx
│   │
│   └── ui/
│       ├── Button.jsx
│       ├── Icon.jsx
│       ├── Badge.jsx
│       ├── ProgressRing.jsx
│       ├── Avatar.jsx
│       └── Skeleton.jsx
│
└── app/
    └── dashboard/
        └── page.jsx (Main composition)
```

---

## 3. Design System

### 3.1 Color Palette

#### Primary Brand Colors
```css
/* Using existing DaisyUI tokens for consistency */

/* Light Theme (Default) */
--primary: #7C3AED;        /* Purple - Primary actions, CTA */
--primary-focus: #6D28D9;  /* Darker purple - Hover states */
--secondary: #06B6D4;      /* Cyan - Secondary actions, info */
--accent: #F59E0B;         /* Amber - Highlights, achievements */
--success: #10B981;        /* Green - Progress, correct answers */
--warning: #F59E0B;        /* Orange - Alerts, streak at-risk */
--error: #EF4444;          /* Red - Errors, failed attempts */
--info: #3B82F6;           /* Blue - Information, tips */

/* Base Colors */
--base-100: #FFFFFF;       /* Main background */
--base-200: #F3F4F6;       /* Card backgrounds */
--base-300: #E5E7EB;       /* Borders, dividers */
--base-content: #1F2937;   /* Primary text */

/* Dark Theme */
--primary-dark: #A78BFA;
--base-100-dark: #0F172A;  /* Slate 900 */
--base-200-dark: #1E293B;  /* Slate 800 */
--base-300-dark: #334155;  /* Slate 700 */
--base-content-dark: #F1F5F9; /* Slate 100 */

/* Eye-Care Theme (Warm, reduced blue light) */
--base-100-eyecare: #FEF7E6;   /* Warm white */
--base-200-eyecare: #F5E6CC;   /* Warm gray */
--base-content-eyecare: #4A3F2E; /* Warm dark */
```

#### Semantic Color Usage
- **Success States**: Green (`#10B981`) - Completed tasks, correct answers
- **Warning States**: Amber (`#F59E0B`) - Approaching deadlines, streak risks
- **Error States**: Red (`#EF4444`) - Wrong answers, failed validations
- **Neutral States**: Gray (`#6B7280`) - Disabled, inactive elements
- **AI/Smart Features**: Purple gradient (`#7C3AED` → `#A78BFA`)
- **Community/Social**: Blue (`#3B82F6`)
- **Achievements/Rewards**: Gold gradient (`#F59E0B` → `#FBBF24`)

### 3.2 Typography System

#### Font Families
```css
/* Primary Font: Inter (Google Fonts) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Accent/Display Font: Outfit */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

/* Monospace (for stats, timers): JetBrains Mono */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

#### Type Scale (Mobile-First)
```css
/* Headings */
.text-display {
  font-family: 'Outfit', sans-serif;
  font-size: 2.5rem;      /* 40px - Mobile */
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .text-display { font-size: 3.5rem; } /* 56px - Desktop */
}

.text-h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;        /* 32px - Mobile */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .text-h1 { font-size: 2.5rem; } /* 40px */
}

.text-h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.3;
}

.text-h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;
  line-height: 1.4;
}

/* Body Text */
.text-body-lg {
  font-size: 1.125rem;    /* 18px */
  font-weight: 400;
  line-height: 1.6;
}

.text-body {
  font-size: 1rem;        /* 16px - Default */
  font-weight: 400;
  line-height: 1.5;
}

.text-body-sm {
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  line-height: 1.5;
}

/* Specialized */
.text-stat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
}

.text-label {
  font-size: 0.75rem;     /* 12px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-caption {
  font-size: 0.75rem;     /* 12px */
  font-weight: 400;
  line-height: 1.4;
  color: var(--base-content-secondary);
}
```

#### Font Weight System
- **Light (300)**: Subtle secondary text
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Emphasized body text
- **Semibold (600)**: Subheadings, labels, button text
- **Bold (700)**: Headings, important metrics
- **Extrabold (800)**: Display text, hero numbers

### 3.3 Spacing & Layout

#### Spacing Scale (Tailwind-compatible)
```
xs:  0.25rem (4px)   - Icon gaps, tight spacing
sm:  0.5rem  (8px)   - Element padding
md:  1rem    (16px)  - Card padding, button spacing
lg:  1.5rem  (24px)  - Section gaps
xl:  2rem    (32px)  - Component margins
2xl: 3rem    (48px)  - Section padding
3xl: 4rem    (64px)  - Page margins
```

#### Container Widths
```css
.container {
  max-width: 1440px;     /* Desktop max */
  margin: 0 auto;
  padding: 0 1rem;       /* Mobile */
}

@media (min-width: 768px) {
  .container { padding: 0 2rem; }  /* Tablet */
}

@media (min-width: 1024px) {
  .container { padding: 0 3rem; }  /* Desktop */
}
```

#### Grid System
```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;  /* Mobile: Single column */
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 280px 1fr 320px;  /* Desktop: Sidebar + Main + Right Panel */
    gap: 2rem;
  }
}
```

### 3.4 Visual Design Tokens

#### Border Radius
```css
--radius-sm: 0.375rem;   /* 6px - Small elements, chips */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Modals, large cards */
--radius-2xl: 1.5rem;    /* 24px - Hero sections */
--radius-full: 9999px;   /* Pills, avatars */
```

#### Shadows (Elevation)
```css
/* Light Theme */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Dark Theme - Softer, colored shadows */
--shadow-md-dark: 0 4px 6px -1px rgb(139 92 246 / 0.3);
--shadow-lg-dark: 0 10px 15px -3px rgb(139 92 246 / 0.4);

/* Card Glow Effect (Premium) */
--shadow-glow: 0 0 20px rgb(124 58 237 / 0.15);
```

#### Glassmorphism Effect
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-lg);
}

.glass-card-dark {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Animations & Transitions
```css
/* Micro-interactions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);

/* Hover Effects */
.interactive {
  transition: all var(--transition-base);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Pulsing Animation (for active study session) */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(124, 58, 237, 0); }
}

.pulse-active {
  animation: pulse-glow 2s infinite;
}

/* Streak Flame Animation */
@keyframes flame-flicker {
  0%, 100% { transform: scale(1) rotate(-2deg); }
  25% { transform: scale(1.05) rotate(2deg); }
  50% { transform: scale(0.98) rotate(-1deg); }
  75% { transform: scale(1.02) rotate(1deg); }
}

.streak-flame {
  animation: flame-flicker 1.5s ease-in-out infinite;
}
```

---

## 4. Interactive Elements & AI-Driven Features

### 4.1 AI-Powered Personalization

#### Feature 1: Adaptive Study Plan
**Description**: AI dynamically adjusts daily study plan based on:
- Exam proximity
- Historical performance data
- Time of day analytics (when user is most productive)
- Weak topic identification

**UI Implementation**:
```jsx
<AdaptiveStudyCard>
  <AIBadge>AI Recommended</AIBadge>
  <TopicTitle>Chemistry: Redox Reactions</TopicTitle>
  <Insight>
    You tend to score 15% higher on Chemistry between 9-11 AM.
    Scheduled for 9:30 AM today.
  </Insight>
  <MasteryProgress current={45} target={80} />
  <EstimatedTime>Estimated 2.5 hours to mastery</EstimatedTime>
</AdaptiveStudyCard>
```

#### Feature 2: Difficulty Adaptation
**Description**: Real-time question difficulty adjustment based on:
- Current accuracy rate
- Response time
- Confidence indicators
- Learning curve trajectory

**UI Implementation**:
```jsx
<DifficultyIndicator>
  <Level current={7} max={10} />
  <Tooltip>
    You're currently at Level 7 (Advanced).
    Based on your 85% accuracy, we'll mix in some Level 8 questions.
  </Tooltip>
  <AdaptButton>
    Return to Level 6
  </AdaptButton>
</DifficultyIndicator>
```

#### Feature 3: Predictive Mastery Timeline
**Description**: ML-based prediction of when user will master a topic

**UI Implementation**:
```jsx
<MasteryPredictionCard>
  <ChartWrapper>
    <ProgressCurve data={userProgress} prediction={mlPrediction} />
  </ChartWrapper>
  <Prediction>
    <Icon>🎯</Icon>
    <Text>
      At your current pace, you'll master <strong>Calculus</strong> in:
      <Timeline>
        <Strong>~4 days</Strong> (Dec 3, 2025)
      </Timeline>
    </Text>
  </Prediction>
  <Accelerator>
    <Button>Study 30 min extra daily → Master in 2 days</Button>
  </Accelerator>
</MasteryPredictionCard>
```

#### Feature 4: Smart Topic Recommendations
**Description**: Contextual suggestions based on:
- Exam syllabus coverage
- Weak areas from practice tests
- Trending difficult topics in community
- JAMB past question frequency analysis

**UI Implementation**:
```jsx
<RecommendationPanel>
  <Header>
    <Icon>✨</Icon>
    Focus Areas This Week
  </Header>
  <RecommendationList>
    {recommendations.map(rec => (
      <RecommendationCard priority={rec.priority}>
        <Badge>{rec.urgency}</Badge>
        <Title>{rec.topic}</Title>
        <Reason>{rec.aiReason}</Reason>
        <Stats>
          <Stat>
            <Label>Your Score</Label>
            <Value color="error">42%</Value>
          </Stat>
          <Stat>
            <Label>Class Avg</Label>
            <Value>68%</Value>
          </Stat>
          <Stat>
            <Label>JAMB Frequency</Label>
            <Value color="warning">High</Value>
          </Stat>
        </Stats>
        <ActionButton>Start Practice</ActionButton>
      </RecommendationCard>
    ))}
  </RecommendationList>
</RecommendationPanel>
```

### 4.2 Gamification Elements

#### Streak System
```jsx
<StreakCounter>
  <FlameIcon animated={isActive}>🔥</FlameIcon>
  <Count>{currentStreak} Day Streak</Count>
  <ProgressToNext>
    <Bar progress={80} />
    <Label>2 more hours to maintain streak</Label>
  </ProgressToNext>
  <Milestones>
    <Next>Next milestone: 15 days → Unlock "Consistent Scholar" badge</Next>
  </Milestones>
</StreakCounter>
```

#### Badge System
```jsx
<BadgeShowcase>
  <RecentBadge animated>
    <Icon>🏆</Icon>
    <Title>Speed Demon</Title>
    <Description>Completed 50 questions in under 30 minutes</Description>
    <Timestamp>Unlocked 2 hours ago</Timestamp>
  </RecentBadge>
  
  <BadgeGrid>
    {badges.map(badge => (
      <BadgeCard locked={!badge.unlocked}>
        <Icon grayscale={!badge.unlocked}>{badge.icon}</Icon>
        <Title>{badge.title}</Title>
        {badge.unlocked ? (
          <Date>{badge.unlockDate}</Date>
        ) : (
          <Progress>
            <Bar progress={badge.progress} />
            <Label>{badge.requirement}</Label>
          </Progress>
        )}
      </BadgeCard>
    ))}
  </BadgeGrid>
</BadgeShowcase>
```

#### Leaderboard Widget
```jsx
<LeaderboardWidget>
  <Header>
    <Title>Weekly Champions</Title>
    <Filter>
      <Option active>Friends</Option>
      <Option>School</Option>
      <Option>Nigeria</Option>
    </Filter>
  </Header>
  
  <RankingList>
    {topUsers.map((user, index) => (
      <RankRow highlight={user.isCurrentUser}>
        <Rank position={index + 1}>
          {index < 3 ? getMedal(index) : index + 1}
        </Rank>
        <Avatar src={user.avatar} />
        <Info>
          <Username>{user.username}</Username>
          <School>{user.school}</School>
        </Info>
        <Score>
          {user.points} pts
        </Score>
      </RankRow>
    ))}
  </RankingList>
  
  <CurrentUserPosition>
    <Label>Your Position</Label>
    <Rank>#47</Rank>
    <Gap>32 points behind #46</Gap>
  </CurrentUserPosition>
  
  <CTAButton>View Full Leaderboard</CTAButton>
</LeaderboardWidget>
```

### 4.3 Performance Visualizations

#### Activity Heatmap (GitHub-style)
```jsx
<ActivityHeatmap>
  <Header>
    <Title>Study Activity</Title>
    <Legend>
      <Item>Less</Item>
      <ColorBox intensity={1} />
      <ColorBox intensity={2} />
      <ColorBox intensity={3} />
      <ColorBox intensity={4} />
      <Item>More</Item>
    </Legend>
  </Header>
  
  <Grid>
    {weeks.map(week => (
      <Week>
        {week.days.map(day => (
          <DayCell
            intensity={getIntensity(day.minutes)}
            tooltip={`${day.date}: ${day.minutes} minutes studied`}
          />
        ))}
      </Week>
    ))}
  </Grid>
  
  <Summary>
    <Stat>
      <Value>156</Value>
      <Label>Total hours this month</Label>
    </Stat>
    <Stat>
      <Value>23</Value>
      <Label>Active days</Label>
    </Stat>
  </Summary>
</ActivityHeatmap>
```

#### Subject Radar Chart
```jsx
<SubjectPerformance>
  <RadarChart>
    <Axes subjects={['Math', 'English', 'Physics', 'Chemistry', 'Biology']} />
    <UserPolygon data={userScores} color="primary" />
    <TargetPolygon data={targetScores} color="success" dashed />
    <Legend>
      <Item color="primary">Your Performance</Item>
      <Item color="success">JAMB Pass Mark</Item>
    </Legend>
  </RadarChart>
  
  <InsightPanel>
    <AIInsight>
      Your weakest subject is <Strong>Chemistry (58%)</Strong>.
      Focus on <Topic>Organic Chemistry</Topic> to boost your score by ~12%.
    </AIInsight>
  </InsightPanel>
</SubjectPerformance>
```

#### Trend Graph (Accuracy Over Time)
```jsx
<TrendAnalysis>
  <LineChart>
    <XAxis label="Past 30 Days" />
    <YAxis label="Accuracy %" />
    <Line data={accuracyData} color="primary" smooth />
    <TrendLine data={mlTrend} color="success" dashed />
    <Annotations>
      <Peak date="Nov 15" value="92%" note="Personal best!" />
      <Dip date="Nov 22" value="68%" note="Midterm week" />
    </Annotations>
  </LineChart>
  
  <Stats>
    <Stat trend="up">
      <Label>Average Accuracy</Label>
      <Value>78.5%</Value>
      <Change>+5.2% from last month</Change>
    </Stat>
    <Stat trend="up">
      <Label>Improvement Rate</Label>
      <Value>0.8%</Value>
      <Change>per day</Change>
    </Stat>
  </Stats>
</TrendAnalysis>
```

### 4.4 Notification System

#### Notification Types & Prioritization
```javascript
const notificationTypes = {
  EXAM_COUNTDOWN: {
    priority: 'critical',
    icon: '⏰',
    color: 'error',
    persistence: true,
    example: 'JAMB exam in 3 days! Complete your final review.'
  },
  
  STREAK_RISK: {
    priority: 'high',
    icon: '🔥',
    color: 'warning',
    persistence: true,
    example: 'Your 12-day streak expires in 2 hours! Study now to keep it alive.'
  },
  
  STUDY_REMINDER: {
    priority: 'medium',
    icon: '📚',
    color: 'info',
    persistence: false,
    example: 'Time for Chemistry! You scheduled this session for 9:00 AM.'
  },
  
  ACHIEVEMENT_UNLOCKED: {
    priority: 'medium',
    icon: '🎉',
    color: 'success',
    persistence: false,
    animation: 'confetti',
    example: 'Achievement Unlocked: "Week Warrior" - 7 day streak!'
  },
  
  COMMUNITY_REPLY: {
    priority: 'low',
    icon: '💬',
    color: 'secondary',
    persistence: false,
    example: 'AdewaleJAMB replied to your question about Organic Chemistry'
  },
  
  AI_RECOMMENDATION: {
    priority: 'medium',
    icon: '✨',
    color: 'primary',
    persistence: false,
    example: 'AI suggests focusing on Calculus today based on your upcoming exam'
  }
};
```

#### Notification Panel UI
```jsx
<NotificationPanel>
  <Header>
    <Title>Notifications</Title>
    <Badge count={unreadCount} />
    <Actions>
      <Button ghost>Mark all read</Button>
      <IconButton>⚙️</IconButton>
    </Actions>
  </Header>
  
  <FilterTabs>
    <Tab active={filter === 'all'}>All</Tab>
    <Tab active={filter === 'unread'}>Unread</Tab>
    <Tab active={filter === 'important'}>Important</Tab>
  </FilterTabs>
  
  <NotificationList>
    {notifications.map(notif => (
      <NotificationItem
        priority={notif.priority}
        unread={!notif.read}
        onClick={() => handleNotificationClick(notif)}
      >
        <IconBadge color={notif.color}>
          {notif.icon}
        </IconBadge>
        
        <Content>
          <Message>{notif.message}</Message>
          <Timestamp>{formatTimeAgo(notif.timestamp)}</Timestamp>
        </Content>
        
        {notif.actionable && (
          <ActionButton size="sm">
            {notif.actionLabel}
          </ActionButton>
        )}
        
        <DismissButton>✕</DismissButton>
      </NotificationItem>
    ))}
  </NotificationList>
  
  <Footer>
    <Button variant="link">View all notifications</Button>
  </Footer>
</NotificationPanel>
```

### 4.5 Quick Actions Implementation

```jsx
<QuickActionsDock>
  {/* Resume Last Activity */}
  <ActionButton
    primary
    pulsing={hasActiveSession}
    icon="▶️"
    label="Resume"
    sublabel="Math Practice"
    onClick={resumeLastSession}
  />
  
  {/* Bookmarks */}
  <ActionButton
    icon="⭐"
    label="Bookmarks"
    badge={bookmarkCount}
    onClick={openBookmarks}
  />
  
  {/* Community */}
  <ActionButton
    icon="💬"
    label="Community"
    badge={unreadThreads}
    onClick={navigateToCommunity}
  />
  
  {/* AI Tutor */}
  <ActionButton
    icon="✨"
    label="Ask AI"
    onClick={openAITutor}
    gradient
  />
  
  {/* Quick Start New Practice */}
  <ActionButton
    icon="🎯"
    label="Practice"
    onClick={showSubjectSelector}
  />
</QuickActionsDock>
```

---

## 5. Responsive Breakpoints

```css
/* Mobile First Approach */

/* Extra Small Devices (Portrait Phones) */
@media (min-width: 320px) {
  /* Base styles - Single column layout */
}

/* Small Devices (Landscape Phones) */
@media (min-width: 640px) {
  /* Slightly larger cards, 2-column grids for metrics */
}

/* Medium Devices (Tablets) */
@media (min-width: 768px) {
  /* 2-column main layout */
  /* Sidebar becomes visible but collapsible */
  /* Larger charts and visualizations */
}

/* Large Devices (Desktops) */
@media (min-width: 1024px) {
  /* Full 3-column layout (Sidebar + Main + Right Panel) */
  /* All features visible */
  /* Hover states activated */
}

/* Extra Large Devices (Large Desktops) */
@media (min-width: 1280px) {
  /* Wider content area */
  /* More whitespace */
  /* Enhanced visualizations */
}

/* 2K/4K Displays */
@media (min-width: 1536px) {
  /* Maximum container width (1440px) */
  /* Centered layout */
}
```

---

## 6. Dark Mode Implementation

### Theme Toggle Strategy
```jsx
<ThemeSelector>
  <Option value="light" icon="☀️">Light</Option>
  <Option value="dark" icon="🌙">Dark</Option>
  <Option value="eyecare" icon="👁️">Eye Care</Option>
  <Option value="auto" icon="🔄">Auto (System)</Option>
</ThemeSelector>
```

### Dark Mode Specific Adjustments
```css
/* Dark theme overrides */
[data-theme="dark"] {
  /* Reduce shadow intensity */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  
  /* Add subtle colored glows to cards */
  .card {
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.2),
                0 4px 6px -1px rgb(0 0 0 / 0.3);
  }
  
  /* Increase contrast for readability */
  .text-secondary {
    color: rgba(241, 245, 249, 0.8);  /* Slate 100 @ 80% */
  }
  
  /* Glassmorphism adjustments */
  .glass-card {
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  /* Chart color adjustments */
  .chart-line {
    filter: brightness(1.2);  /* Brighten chart elements */
  }
}
```

---

## 7. Performance Optimization

### Loading States
```jsx
<DashboardSkeleton>
  <SkeletonHeader />
  <SkeletonGrid>
    <SkeletonCard height="200px" />
    <SkeletonCard height="200px" />
    <SkeletonCard height="300px" />
  </SkeletonGrid>
</DashboardSkeleton>
```

### Lazy Loading Strategy
```javascript
// Code splitting for dashboard sections
const DailyPlanSection = lazy(() => import('./DailyPlanSection'));
const PerformanceDashboard = lazy(() => import('./PerformanceDashboard'));
const GamificationHub = lazy(() => import('./GamificationHub'));

// Prioritize above-the-fold content
{/* Load immediately */}
<DashboardHeader />
<HeroBanner />

{/* Load with suspense */}
<Suspense fallback={<SkeletonCard />}>
  <DailyPlanSection />
</Suspense>

{/* Lazy load below-the-fold */}
<Suspense fallback={<SkeletonCard />}>
  <PerformanceDashboard />
</Suspense>
```

### Data Fetching Optimization
```javascript
// Use SWR or React Query for efficient caching
import useSWR from 'swr';

function DashboardData() {
  // Fetch with stale-while-revalidate
  const { data: studyPlan } = useSWR('/api/study-plan', fetcher, {
    refreshInterval: 60000,  // Refresh every minute
    revalidateOnFocus: true
  });
  
  // Prefetch performance data
  const { data: performance } = useSWR('/api/performance', fetcher, {
    refreshInterval: 300000,  // Refresh every 5 minutes
  });
  
  // Real-time streak data
  const { data: streak } = useSWR('/api/streak', fetcher, {
    refreshInterval: 30000,  // Refresh every 30 seconds
  });
}
```

---

## 8. Accessibility (A11Y) Considerations

### WCAG 2.1 AA Compliance
```jsx
// Semantic HTML
<nav aria-label="Dashboard navigation">
  <ul role="list">
    <li><a href="/dashboard" aria-current="page">Dashboard</a></li>
  </ul>
</nav>

// Proper focus management
<Button
  aria-label="Resume Chemistry practice session"
  aria-describedby="session-details"
>
  Resume
</Button>

// Screen reader announcements for dynamic content
<LiveRegion aria-live="polite" aria-atomic="true">
  {notification.message}
</LiveRegion>

// Keyboard navigation
<Card tabIndex={0} onKeyPress={handleKeyPress}>
  {/* Card content */}
</Card>
```

### Color Contrast Requirements
- **Normal Text (16px)**: Minimum 4.5:1 contrast ratio
- **Large Text (24px+)**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 against background
- **Focus Indicators**: 3px outline with 3:1 contrast

---

## 9. Implementation Priority Phases

### Phase 1: MVP (Week 1-2)
**Goal**: Core dashboard with essential features

- [ ] Dashboard layout structure
- [ ] DashboardHeader component
- [ ] HeroBanner with personalized greeting
- [ ] DailyPlanSection with time blocks
- [ ] Basic PerformanceDashboard (simple charts)
- [ ] QuickActionsDock
- [ ] Responsive grid system
- [ ] Light/Dark theme toggle
- [ ] Loading states

### Phase 2: Enhanced Visualizations (Week 3)
**Goal**: Add rich data visualizations

- [ ] ActivityHeatmap component
- [ ] SubjectRadarChart
- [ ] TrendLineGraph
- [ ] Topic progress bars
- [ ] Chart interactions (tooltips, zoom)
- [ ] Export/share functionality

### Phase 3: AI Features (Week 4)
**Goal**: Integrate AI-powered insights

- [ ] MasteryPredictionCard
- [ ] Adaptive difficulty system
- [ ] Smart topic recommendations
- [ ] Performance comparison
- [ ] AI-powered study plan adjustments
- [ ] Predictive analytics

### Phase 4: Gamification (Week 5)
**Goal**: Add engagement features

- [ ] Streak system with animations
- [ ] Badge system (unlock logic)
- [ ] LeaderboardWidget
- [ ] Daily challenges
- [ ] Achievement notifications
- [ ] Social sharing

### Phase 5: Polish & Optimize (Week 6)
**Goal**: Production-ready refinements

- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Accessibility audit & fixes
- [ ] Cross-browser testing
- [ ] Mobile gesture interactions
- [ ] Micro-animations
- [ ] Error boundaries
- [ ] Analytics integration

---

## 10. Technical Stack Recommendations

### Frontend
```json
{
  "framework": "Next.js 16",
  "styling": "TailwindCSS + DaisyUI",
  "state_management": "Redux Toolkit",
  "charts": "Recharts or Chart.js",
  "animations": "Framer Motion",
  "forms": "React Hook Form + Zod",
  "notifications": "react-hot-toast",
  "icons": "Lucide React",
  "date_utils": "date-fns"
}
```

### Backend/API
```json
{
  "api_routes": "Next.js API routes",
  "database": "MongoDB",
  "authentication": "JWT (existing)",
  "ai_integration": "OpenAI API / Custom ML model",
  "caching": "Redis (optional)",
  "real_time": "Socket.io (for live leaderboard)"
}
```

### Development Tools
```json
{
  "code_quality": "ESLint + Prettier",
  "testing": "Jest + React Testing Library",
  "e2e_testing": "Playwright",
  "performance": "Lighthouse CI",
  "monitoring": "Sentry (error tracking)"
}
```

---

## 11. Key Metrics to Track

### User Engagement
- Daily Active Users (DAU)
- Session duration
- Feature adoption rates
- Streak retention rate
- Community interaction rate

### Learning Outcomes
- Average accuracy improvement over time
- Topic mastery completion rate
- Practice test scores
- Time to mastery per topic
- Exam readiness score

### Product Performance
- Page load time (target: <2s)
- Time to Interactive (target: <3s)
- Core Web Vitals (LCP, FID, CLS)
- API response times
- Error rates

---

## Conclusion

This dashboard redesign strategy prioritizes:

1. **User-Centricity**: Personalized daily plans and AI recommendations
2. **Clarity**: Clean visual hierarchy with minimal cognitive load
3. **Engagement**: Gamification elements that motivate consistent study
4. **Performance**: Fast, responsive experience on all devices
5. **Accessibility**: WCAG compliant for all users

**Next Steps**:
1. Review and approve this strategy document
2. Create detailed Figma mockups based on wireframes
3. Set up component library in Storybook
4. Begin Phase 1 implementation
5. Conduct user testing after MVP

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-29  
**Prepared by**: SAMKIEL (UI/UX & Full-Stack Strategy)
