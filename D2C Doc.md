CrushEdu Place International – README

A unified JAMB preparation ecosystem engineered for mobile-first performance, high reliability, and long-term scale. The platform delivers verified past questions, CBT precision, AI-driven learning tools, analytics, offline capability, and a structured community environment.

1. Executive Summary

Objective:
Deliver a JAMB-exclusive, AI-enhanced, offline-capable exam preparation platform with a native mobile experience and enterprise-grade reliability.

Key Differentiators:

Offline CBT engine

AI explanation pipeline

Strict exam-integrity controls

Mobile-first PWA interaction

Community + mentorship ecosystem

Real-time analytics

Premium subscription system with referral rewards

Success Metrics:

CBT reliability above 92%

High completion rate for CBT sessions

Reduced time-to-mastery

Strong premium conversion

Minimal question leakage (anti-screenshot layer)

2. Core Product Pillars

Past Questions Engine with MongoDB-hosted structured datasets

CBT Workspace with strict exam-mode integrity

Study Mode with explanations, bookmarks, and audio reading

Offline Mode with IndexedDB question storage

Subscription System (Paystack/Flutterwave)

AI Tools: explanations, study plans, moderation

Community Layer: discussions, mentorship, role-based controls

Admin Suite: question management, analytics, A/B testing

Mobile-First Experience: swipe navigation, FAB buttons, PWA features

3. CBT & Study Experience
Study Mode

Free navigation

Swipe left/right for previous/next

Audio reading mode

Bookmarks

Tutor + AI explanations

Calculator modal (Crush Cal!)

No screenshots allowed (prevention layer active)

Bug reporting feature via shake gesture or button

Question JSON served from MongoDB

CBT Mode

Strict exam integrity

No leaving tab/app

No screenshots allowed

Offline support via IndexedDB

Auto-sync timer based on server timestamps

Calculator toggle

Swipe navigation

Number navigator with answered-state tracking

Bookmarking (study-only)

Flags used strictly for bug reporting, not revisits

Revisit queue not available in exam mode

4. Offline Architecture

Offline CBT is supported through:

IndexedDB storage of session questions, options, and metadata

Service Worker interception for resilience

LocalSessionState object for answers, flags, and timer

Reconciliation queue to sync results once online

Read-through fallback to ensure no disruption during connectivity loss

5. Authentication & Security

Passwordless login with device biometrics (PIN, face unlock, fingerprint)

OTP only for registration and forgotten password (SMS, Email, WhatsApp)

Rate limits + JWT rotation

Device sync limited to two devices per user (phone + PC)

Session tracking + kill-switch from user settings

Referral code = user’s username

Local + cloud progress sync

6. Admin Ecosystem
Features

Question Upload (JSON ingestion)

Bulk edit/replace questions

Filters by subject, category, year

Delete individual or batch questions

Edit question text/options/answers

User role management (admin, tutor, student)

Tutor upgrading via Roles API

Revenue dashboard

Traffic + performance analytics

A/B testing module

AI community moderation

Live Q&A administration

7. Monetization (Paystack / Flutterwave)
Features

Premium gating

Trial mode for first-time users

Subscription purchase

Webhook-based activation

Subscription expiry automation

Benefit unlock screen after successful payment

Referral reward = wallet credit, usable for subscription payment

Free tier usage limits (questions per day, locked explanations, no full CBT)

Paystack Flow Overview

Backend initializes transaction with Paystack API

User completes payment

Paystack triggers webhook to backend

Backend verifies signature + updates subscription

Frontend refreshes user session to reflect premium access

8. AI Capabilities

AI explanation engine (Gemini / DeepSeek / Kimi)

AI study-planner generator

AI question difficulty tagging

AI user weakness analysis

AI community content moderation

AI-assisted mentor interactions

9. Mobile-First UX Architecture

Swipe navigation across questions

Floating action buttons

Full-screen PWA layout

Hidden browser chrome

Adaptive touch zones

Smooth transitions (Framer Motion)

Dynamic tabs

Predictive search

Accessibility improvements

10. Technical Stack

Frontend: Next.js, TailwindCSS, Framer Motion, IndexedDB, Service Workers
Backend: Express.js, Node.js, Mongoose
Database: MongoDB (Questions stored as structured JSON documents)
Auth: JWT rotation, device fingerprinting, OTP (SMS/Email/WhatsApp)
Payments: Paystack / Flutterwave
AI: Gemini 3 Pro, Kimi, DeepSeek (configurable)
Realtime: WebSockets
Deployment: Vercel (Frontend), Render or VPS (Backend)
Monitoring: Sentry + Grafana

11. Component Checklist

CBT workspace

Question viewer

Swipe handler

Calculator modal

Audio reader

Bookmark system

Bug report module

Number navigator

Offline sync engine

Auth + OTP

Paystack integration

Admin question table

Community system

AI explanation card

Error boundaries

Skeleton loaders

Role management

12. Roadmap

Sprint 1: CBT Workspace Upgrade
Sprint 2: Admin Question Management
Sprint 3: Offline CBT Layer
Sprint 4: Subscription + Referral System
Sprint 5: Authentication Overhaul
Sprint 6: AI Tools Integration
Sprint 7: Complete Mobile-First UX polish
Sprint 8: Community + Mentorship + Moderation
Sprint 9: Analytics + A/B Testing