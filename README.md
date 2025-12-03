CrushEdu Place International – README

A unified JAMB preparation ecosystem built for scale. Verified past questions, CBT precision, analytics, structured study content, and a learner driven community.

[Current Plan](/D2C%20Doc.md)


1. Executive Summary and Strategic Objective
Item	Description
Objective	Deliver a JAMB-exclusive, AI-enhanced, offline-ready examination preparation platform for nationwide adoption.
Success Metrics	CBT reliability above ninety two percent, increased weekly active users, reduced time-to-mastery, higher conversion to premium tiers.
Tech Stack	MERN architecture with Tailwind and Vite, JWT authentication, optional mobile wrapper.
Constraints	Verified JAMB question banks only. Offline capability required for low connectivity zones.
2. Product Pillars

Landing and acquisition

JAMB subject categories

CBT engine with analytics

Study notes and syllabus hub

AI performance dashboard

Community and mentorship

Offline mode

Payments and subscriptions

Admin console

3. Design System
Token	Usage
Colours	Semantic correctness states, difficulty levels and neutral UI tones
Typography	Tailwind responsive scale
Components	Hero sections, CTAs, cards, timers, question tiles, CBT workspace, modals, charts, community threads, syllabus viewer, admin interface
Deliverables	Figma design library, Tailwind tokens, Storybook with visual regression tests
4. Page-by-Page Delivery Matrix
Page	Core Features	Acceptance Criteria
Landing	value proposition, subject pathways, testimonials, trial prompt	first content paint under one point five seconds
Auth	email or social authentication	adaptive redirect
Dashboard	daily targets, analytics summary, continuation pipeline	automatic refresh and personalization
Past Questions	filter by subject and year, instant marking, detailed explanations	full accuracy
CBT Simulator	exam window, timer, calculator, flagging, submission	scoring and analytics under two hundred fifty milliseconds
Study Hub	syllabus, notes, multimedia references	search optimized
Community	posts, replies, mentors	moderation workflow
Notifications	push and email notifications	timely execution
Admin Panel	content management, analytics	audit visibility
5. Data Models (MongoDB)
User
Question
ExamSession
StudyResource
Notification
CommunityPost
CommunityComment
Payment

// All collections indexed for fast read operations and text search.

6. API Surface

Auth

User

Questions

Exams

Study

Community

Payments

Admin

OpenAPI three point one specification recommended.

7. Real Time Architecture

WebSocket for CBT presence and community activity

Redis Pub Sub for transient events

Stateless Node clusters under an application load balancer

IndexedDB powered offline caching with versioned assets

8. UX and Accessibility

Skeleton loaders for heavy screens

Retry logic for offline CBT sessions

Adaptive font scaling for small devices

Server side time reconciliation for exam integrity

9. Component Checklist

Buttons
Inputs
Forms
Cards
Progress indicators
Timer
Tabs
Tables
Toasts
CBT workspace
Community thread
Syllabus viewer

10. QA and Deployment

Jest and React Testing Library for unit tests

Playwright for end to end tests

CI pipeline for lint, test, build and Storybook generation

Frontend deployment on Vercel

Backend deployment on Render with Docker

Monitoring with Sentry and Grafana

11. Collaboration Workflow

Monorepo architecture

Feature branches for every module

Design to Development to QA acceptance cycle

Versioned API and tagged releases

12. Suggested Delivery Timeline

Sprint 0 — Infrastructure, Auth, Global UI
Sprint 1 — Landing and Dashboard
Sprint 2 — Past Questions Engine
Sprint 3 — CBT Module
Sprint 4 — Study Hub
Sprint 5 — Community Layer
Sprint 6 — Offline Mode
Sprint 7 — Admin Suite and QA

13. Security Checklist

Role based access control

Input validation with strict rate limiting

Short lived JWTs with rotation strategy

Encrypted payment webhooks

Secrets stored in secure vault

NDPR and GDPR aligned compliance

14. Optional Deliverables

User flow diagrams

Figma prototypes

OpenAPI documentation

Storybook foundations

AI recommendation blueprint

## CBT Implementation Details

### How Submit Works
1. User clicks "Submit" in the CBT interface.
2. `useCbtSession` hook calls `POST /api/cbt/[sessionId]/submit`.
3. Backend:
   - Validates session status is "active".
   - Calculates score based on stored `CbtAnswer`s vs `CbtSession` questions.
   - Updates `CbtSession` status to "submitted" and saves summary stats.
   - Returns summary data.
4. Frontend redirects to `/cbt/[sessionId]/summary`.

### Summary Flow
- Route: `/cbt/[sessionId]/summary`
- Page fetches session data server-side from MongoDB.
- Passes summary stats (score, percentage, time, etc.) to `CbtSummary.client.jsx`.
- Displays a visual score card and performance breakdown.

### Review Flow
- Route: `/cbt/[sessionId]/review`
- Component `CbtReview.client.jsx` fetches detailed review data from `/api/cbt/[sessionId]/review`.
- Backend joins `CbtSession` questions with `CbtAnswer`s and `Question` details.
- Returns questions with user's answer, correct answer, and tutor explanation.
- UI renders questions in a read-only mode with correct/wrong highlighting.
- "Ask AI" button triggers `/api/ai/explain` if no AI explanation exists.

### AI Explanations
- Endpoint: `/api/ai/explain`
- Uses Google Gemini Pro (via `@google/generative-ai`).
- Generates personalized explanations based on question, options, correct answer, and user's answer.
- Saves generated explanation to `CbtAnswer` in MongoDB for future retrieval.

### API Endpoints
- `POST /api/cbt/[sessionId]/submit`: Finalize session and calculate score.
- `GET /api/cbt/[sessionId]/review`: Fetch questions and answers for review.
- `POST /api/ai/explain`: Generate AI explanation for a question.

### Required Env Variables
- `MONGODB_URI`: Connection string for MongoDB.
- `GEMINI_API_KEY`: API key for Google Gemini AI.

### Mongoose Connection
- Located in `src/lib/db.js`.
- Uses a global cached connection (`global.mongoose`) to prevent connection exhaustion in Next.js hot-reload development environment.