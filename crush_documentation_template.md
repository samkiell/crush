# CrushEdu Place International – Technical Documentation Template

## 1. Project Overview

CrushEdu Place International is a unified digital platform delivering past questions, exam practice, study resources, and admission guidance for WAEC, NECO, JAMB, and OAU-specific PUTME and DE applicants. The product is built on the MERN stack with a full‑stack monorepo structure containing distinct frontend and backend services inside a single root directory.

This documentation outlines the architectural blueprint, development standards, feature requirements, API expectations, deployment workflow, and operational governance for the platform.

## 2. Project Structure

The platform follows a monorepo architecture. All services operate inside a unified codebase for streamlined collaboration and CI pipelines.

```
crushedu/
  frontend/
    src/
    public/
    package.json

  backend/
    src/
    package.json

  shared/
    utils/
    types/

  package.json
  README.md
```

## 3. Technology Stack

The solution leverages industry‑standard technologies optimised for scalability and performance.

**Frontend:** React, Redux Toolkit, React Router, Axios, TailwindCSS, Vite

**Backend:** Node.js, Express.js

**Database:** MongoDB with Mongoose ORM

**Authentication:** JWT access and refresh tokens

**Cloud Services:** render storage

**Notifications:** FCM or OneSignal for push messaging

**Payments:** Paystack or Flutterwave

**CI Pipeline:** GitHub Actions

**Testing:** Jest for backend, React Testing Library for frontend

## 4. Core Features and Functional Scope

### Past Question Engine

A structured repository of WAEC, NECO, JAMB, and OAU PUTME questions with metadata for subjects, topics, difficulty, and year. Includes answer explanations, statistics, and time‑based drill modes.

### Exam Simulation Module

A CBT simulator replicating real exam environments. Includes countdown timers and instant scoring with analytics.

### Study Resource Hub

Access to study notes, syllabi, video content links, and curated materials mapped to major examination boards.

### Admission Guidance Suite

Centralised access to cut‑off marks, departmental requirements, screening timelines, OAU updates, and DE pathways.

### User Dashboard

Users can track performance, manage study plans, store bookmarks, and monitor review cycles.

### Community Interaction Layer

A moderated Q and A system for academic discussions, peer mentoring, and topic‑based clusters.

### Offline Support

Local caching for questions and notes using IndexedDB on the frontend and on‑device storage for the mobile wrapper.

### Monetisation

Freemium model with premium content unlocked through in‑app purchases or subscription tiers.

## 5. System Architecture

### Frontend Architecture

The frontend is structured around modular feature-driven organisation. Each feature includes pages, components, services, and state slices.

```
frontend/src/
  features/
    auth/
    questions/
    exams/
    dashboard/
    admin/
  components/
  services/
  hooks/
  store/
```

The frontend communicates with the backend through REST APIs secured with JWT. All reusable utilities reside in the shared folder.

### Backend Architecture

The backend is a modular Express application following clean‑architecture principles.

```
backend/src/
  modules/
    auth/
    users/
    questions/
    exams/
    payments/
    community/
  middleware/
  utils/
  config/
  app.js
```

Each module contains controllers, services, models, and route definitions.

## 6. Database Schema Blueprint

### User Schema

Includes name, email, password hash, role, study preferences, subscription status, and progress analytics data.

### Question Schema

Stores exam type, subject, year, question text, options, correct answer, explanation, and difficulty metrics.

### Exam Session Schema

Tracks user attempts, timing data, scores, and performance insights.

### Community Schema

Captures posts, comments, reports, and moderation logs.

### Payment Schema

Records transactions, subscription tier, validity periods, and webhook status.

## 7. API Design Guidelines

### Authentication

All endpoints require JWT access tokens except login and registration. Refresh tokens operate through a rotating token mechanism.

### Endpoint Structure

```
GET /api/questions
POST /api/questions
GET /api/exams/start
POST /api/exams/submit
GET /api/user/profile
POST /api/payments/initialize
```

Request and response objects must follow strict schema definitions maintained in shared types.

### Error Handling

All errors follow a unified error object with status code, message, and trace ID for logging.

## 8. Security and Compliance Standards

Password hashing uses bcrypt with industry‑grade rounds. JWT tokens use short‑lived access tokens and long‑lived refresh tokens. All sensitive environment variables remain encrypted in the CI pipeline. Rate limiting and input validation apply globally.

## 9. Deployment Workflow

### Development Pipeline

Developers push into feature branches. CI executes linting, tests, and build operations. Approved pull requests merge into the main branch.

### Production Releases

The main branch triggers automated deployments to the hosting provider. Docker containers execute both frontend and backend services. Nginx acts as a reverse proxy.

## 10. Logging and Monitoring

The system integrates a log aggregator such as Winston on the backend. Application metrics sync with a dashboard on Grafana or AWS CloudWatch for uptime and performance monitoring.

## 11. Scalability Strategy

The application supports horizontal scaling with multiple Node clusters and stateless frontend builds. MongoDB Atlas ensures distributed storage. Caching uses Redis for high‑demand endpoints.

## 12. Governance and Coding Standards

Code must follow ESLint and Prettier rulesets. Every module requires test coverage and API documentation via Swagger or Redoc. All changes undergo code review before merging.

## 13. Future Expansion Roadmap

The roadmap includes introducing AI‑driven tutoring, expanding coverage to other universities, integrating live classes, and deploying a mobile wrapper for Android and iOS.

This template serves as the operational backbone for building CrushEdu Place International through a resilient, enterprise‑grade MERN implementation.

