# CrushEdu Place International – README

> The definitive OAU-focused exam-prep ecosystem: past questions, CBT simulations, AI-powered analytics, study resources, admission guidance & peer community.

---

## 1. Executive Summary & Strategic Objective

| Item | Description |
|------|-------------|
| **Objective** | Consolidate JAMB, WAEC, NECO & OAU PUTME prep into one AI-personalised, offline-first platform. |
| **Success Metrics** | ≥ 92 % CBT reliability, ↑ weekly active learners, ↓ time-to-mastery, ↑ freemium→premium conversion. |
| **Tech Stack** | MERN + Tailwind + Vite, JWT auth, optional mobile wrapper. |
| **Constraints** | Verified question banks only; offline mode mandatory for NG connectivity. |

---

## 2. Product Pillars

1. Landing & acquisition  
2. Exam categories (WAEC | NECO | JAMB | PUTME | DE)  
3. CBT engine + analytics  
4. Study-resources & syllabus hub  
5. Admissions / cut-off guidance  
6. AI performance dashboard  
7. Community mentorship / Q&A  
8. Student-to-student marketplace  
9. Offline mode  
10. Payments & subscriptions  
11. Admin CMS  

---

## 3. Design System

| Token | Usage |
|-------|-------|
| **Colours** | semantic exam states, difficulty bands, OAU brand |
| **Typography** | Tailwind scale, mobile-first |
| **Components** | Hero, CTA, cards, timers, question tiles, CBT layout, modals, charts, Q&A threads, syllabus viewer, admin tables |
| **Deliverables** | Figma library, Tailwind tokens, Storybook + visual regression |

---

## 4. Page-by-Page Dev Matrix

| Page | Core Features | Acceptance |
|------|---------------|------------|
| **Landing** | value prop, exam cats, social proof, free-trial CTA | ≤ 1.5 s FCP, CVR optimised |
| **Auth** | email/social, role picker (SSCE | JAMB | DE) | adaptive redirect |
| **Dashboard** | daily plan, performance snap, continue-pipeline | auto-refresh, personalised |
| **Past Questions** | subject/year filter, instant check, explanations | zero-error accuracy |
| **CBT Simulator** | full exam window, timer, calculator, flag, submit | score + analytics ≤ 250 ms |
| **Study Hub** | notes, videos, syllabus | searchable |
| **Admissions** | dept requirements, cut-off, DE paths | updated each session |
| **Community** | topic threads, mentors | moderation tools |
| **Marketplace** | listings, txn mgmt | secure, reportable |
| **Notifications** | push + email digests | timely |
| **Admin Panel** | content mgmt, analytics | audit logs |

---

## 5. Data Models (MongoDB)

```javascript
User | Question | ExamSession | StudyResource | Notification
MarketplaceItem | CommunityPost + Comment | Payment
All collections indexed for text-search & high-volume reads.
6. API Surface
Copy
Auth  | User     | Questions | Exams
Study | Admissions | Community | Marketplace
Payments | Admin
OpenAPI 3.1 spec recommended.
7. Real-Time & Architecture
WebSocket: exam presence, live analytics, community threads
Redis Pub/Sub for ephemeral events
Stateless Node clusters behind ALB
Offline cache: IndexedDB + versioned asset bundles
8. UX & Accessibility
Skeleton loaders on heavy screens
Retry logic for offline CBT sessions
Adaptive font scaling, ≤ 410 px layouts
Time-drift reconciliation server-side
9. Component Checklist
Buttons | Inputs | Forms | Cards | Progress | Timer | Tabs
Tables | Toasts | CBT Layout | Q&A Thread | Syllabus Viewer | Marketplace Card
10. QA & Deployment
Unit: Jest + RTL
Integration: CBT flow
E2E: Playwright
CI: lint → test → build → Storybook
Deploy: Vercel (front) / Render-Docker (back)
Monitor: Sentry + Grafana
11. Collaboration Workflow
Monorepo, feature branches, PR checklist
Design → Dev → QA acceptance docs each sprint
Versioned API & release tags
12. Suggested Timeline
Table
Copy
Sprint	Focus
0	Infra, Auth, Global UI
1	Landing + Dashboard
2	Past-Questions Engine
3	CBT Module
4	Study Hub + Admissions
5	Community Layer
6	Marketplace
7	Offline Mode & Polish
8	Admin Suite + Final QA
13. Security Checklist
RBAC (admin vs user)
Input sanitisation + rate-limit
JWT rotation & short TTL
Encrypted payment webhooks
Secrets in CI vault
GDPR / NDPR audit compliance
14. Optional Deliverables
User-flow maps
Figma prototypes
OpenAPI docs
Storybook foundations
AI-recommendation blueprint
