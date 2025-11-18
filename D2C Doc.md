# DEVOUR TO CRUSH (D2C)  
**Product & Technical Specification Document**  
*OAU-only Exam-Prep Super-App*  
**Version 1.0** – 18 Nov 2025

---

## 1. Executive Summary & Vision
**Mission** – *“DEVOUR every past question, CRUSH every OAU exam.”*  
D2C is an OAU-exclusive, dark-mode-first, AI-powered, gamified ecosystem that lets students study offline, earn Gems, trade in a community marketplace, and climb leaderboards—while parents/guardians track progress in real time.

---

## 2. Product Requirements

### 2.1 Epic Catalogue
| ID | Epic | Description | Acceptance Criteria |
|---|---|---|---|
| E1 | Onboarding & Auth | 30-sec sign-up; phone + e-mail; social (Google) | OTP via Termii; NDPR consent checkbox; referral code field |
| E2 | Question Bank | 100 % OAU PUTME + JAMB + WAEC + NECO (2003-2025) | PDF + JSON; verified by in-house subject leads; searchable by topic |
| E3 | CBT Engine | Timed mocks, real OAU UI, pause/resume, offline | Auto-submit on timeout; instant review; sync when online |
| E4 | AI Companion | Summary, explanation, voice-note, chat | <5 s first response; hallucination confidence score ≥ 0.8 |
| E5 | Gems & Gamification | Earn → spend in-app; leaderboard; badges; levels | Gems ledger immutable; daily cap 500 Gems; anti-cheat |
| E6 | Marketplace | P2P listing; escrow; 5 % platform fee | Stripe-Connect-like wallet; dispute window 24 h |
| E7 | Community | Spaces + 1:1 chat; share Q/A; annotate | Real-time (Socket.io); report & block; profanity filter |
| E8 | Guardian Portal | Read-only analytics; push summary weekly | Separate login; no access to chat |
| E9 | Offline Pack | Full-bank download; <200 MB compressed | Background sync; delta updates |
| E10 | Admin CMS | CRUD content, user, gem, ad, report | Role-based; audit trail; 2FA |

### 2.2 User Stories (sample)
- **S1** As a Student I can bookmark any question so that I revise only weak areas.  
- **S2** As a Student I can shake phone → open bug reporter with screenshot & logs.  
- **S3** As Admin I can freeze a user account and reverse illegitimate Gems.

---

## 3. System Architecture

### 3.1 High-level
```
┌---------------------------┐
|  React-Native (Android/iOS) ├--┐
└---------------------------┘  |
┌---------------------------┐  |   offline
|  PWA (React + Workbox)     |  |   cache
└------------┬--------------┘  |
             | HTTPS/WSS
┌------------┴--------------┐
|  API Gateway (nginx)       |
|  rate-limit, WAF, SSL      |
└----┬------------------┬----┘
     |                  |
┌----┴----┐         ┌---┴----┐
| Node.js |         | Python |  (micro-services)
| Express |         | FastAPI|  ← AI service
└--┬--┬---┘         └---┬----┘
   |  |                 |
   |  └-- MongoDB (4.4)--┘  Replica-set in AWS Lagos
   |      Mongoose ODM
   |
Redis (6) cache + pub/sub
|
AWS S3 (Lagos) – PDF, voice-notes, images
|
AWS CloudFront CDN (NG edge)
```

### 3.2 Real-time
- Socket.io rooms per community-space  
- Presence: online / studying / away

---

## 4. Data Model (Mongoose)

```javascript
User {
  _id, email, phone, passwordHash, role:['student','admin'],
  referralCode, referredBy, gems:Number, level:Number,
  createdAt, lastSeen, isFrozen, prefs:{dark:true,eyeCare:false}
}
Question {
  _id, exam:Enum, year:Number, subject, topic, tags[],
  body:{text,img,audio}, options[], correctIndex,
  explanation:{text,audio,aiSummary}, verified:Boolean
}
Mock {
  _id, userId, questions[], answers[], startedAt, finishedAt,
  score, percentile, synced:Boolean
}
GemLedger {
  _id, userId, amount, type:Enum, refId, meta{}, createdAt
}
Listing {
  _id, sellerId, title, price, images[], status:Enum,
  escrow:{held:Number, released:Boolean}, createdAt
}
ChatRoom {
  _id, type:['space','direct'], members[], lastMessage,
  createdAt
}
Message {
  _id, roomId, senderId, body, type:['text','questionShare'],
  createdAt
}
```

---

## 5. API Surface

### REST (v1)
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
GET    /questions?exam=&year=&topic=&limit=
GET    /questions/:id
POST   /mocks/start
PATCH  /mocks/:id/answer
POST   /mocks/:id/submit
GET    /mocks/:id/result
GET    /user/gems
POST   /user/referral/claim
POST   /listings
GET    /listings?search=&category=
POST   /listings/:id/purchase
GET    /leaderboard?type=weekly
POST   /report/bug (includes screenshot & logs)
```

### WebSocket events
```
joinRoom    {roomId}
leaveRoom   {roomId}
sendMsg     {roomId,body,type}
questionShare {roomId,questionId}
typing      {roomId,status}
```

---

## 6. Security & Compliance Matrix
| Control | Implementation |
|---|---|
| Data residency | AWS Lagos (af-south-1) |
| Encryption | TLS 1.3 in transit; AES-256 at rest (MongoDB) |
| End-to-end | Optional E2EE for chat (Signal-protocol) |
| Passwords | bcrypt 12 rounds, min 8 chars, uppercase, numeric |
| 2FA | TOTP (Google Authenticator) for admin & guardian |
| NDPR | Privacy notice, consent log, data-portability export |
| Payments | PCI-DSS via Paystack/Flutterwave (tokens only) |
| Audit | Winston logs → AWS CloudWatch → Glacier 1 yr |
| Rate limit | 120 req/IP/min; burst 20 |
| WAF | AWS WAF – SQL-i, XSS, geo-block non-Africa optional |

---

## 7. Offline-first Strategy
- React-Native: Watermelon DB + SQLite  
- PWA: Workbox background-sync  
- On first install: download <200 MB compressed bank (split by subject)  
- Delta sync: only new / updated questions (etag checksum)  
- Mock results queued and upload when online

---

## 8. Gems Economy & Gamification
| Action | Gems | Limit |
|---|---|---|
| Complete mock | +20 | 5/day |
| 80 % mock score | +50 | 2/day |
| Daily login streak | +5×streak | max 50 |
| Referral sign-up | +100 | none |
| Sell item | credit NGN (minus 5 % fee) | — |
| Redeem 1 000 Gems | ₦50 airtime or subscription discount | — |

Leaderboards reset weekly; badges: “First Mock”, “10-Day Streak”, “Top 1 %”.

---

## 9. AI Integration Spec
- **Stack**: Python FastAPI + LangChain + OpenAI GPT-4 Turbo  
- **Features**:
  - One-sentence summary per question
  - Step-by-step explanation (LaTeX support)
  - Voice-note generation (AWS Polly – Nigerian voice)
  - Chat companion (context = last 20 mocks)
- **Hallucination guard**: cosine similarity against verified explanation < 0.85 → flag for review  
- **Latency SLA**: <5 s 95th percentile (Nigeria edge lambda)

---

## 10. Brand & UI Kit
- **Logo**: existing supplied (SVG)  
- **Palette**:
  - Dark bg #0D1117
  - Primary #3B82F6
  - Accent #F59E0B
  - Success #10B981
  - Error #EF4444
- **Typography**: Inter (body), Crimson Text (headings)  
- **Eye-care mode**: warm sepia overlay, system toggle  
- **Component lib**: custom React + Tailwind; Figma link in repo  
- **Icons**: Font Awesome Pro (education pack)

---

## 11. Mobile & PWA Build Plan
| Layer | Tech |
|---|---|
| Shared business | React-Native webview bridge + mono-repo (Yarn workspaces) |
| State | Redux-Toolkit + RTK Query |
| Offline | Watermelon DB (mobile) / IndexedDB (PWA) |
| Code-push | Microsoft AppCenter (bypass store review) |
| PWA install prompt | after 30 s engagement |
| Stores | Google Play, Apple App Store (managed by Fastlane CI) |

---

## 12. DevOps & Deployment
- **Repo**: GitHub – trunk-based, protected main branch  
- **CI/CD**: GitHub Actions → Docker build → AWS ECR → ECS Fargate (Lagos)  
- **Env**: staging (blue), production (green)  
- **Infra as Code**: Terraform Cloud  
- **Secrets**: AWS Secrets Manager  
- **Monitoring**: CloudWatch alarms, Grafana dashboards, PagerDuty on-call  
- **Backup**: MongoDB 6-hr snapshots, 30-day retention

---

## 13. 90-Day Delivery Road-map

| Sprint | Week | Milestone |
|---|---|---|
| 0 | 1 | Env setup, repo scaffold, CI/CD pipeline |
| 1 | 2 | Auth + OTP (Termii), User & Guardian registration |
| 2 | 3 | Question ingestion CLI + verified bank seed |
| 3 | 4 | CBT engine MVP (web) |
| 4 | 5 | Offline pack download (PWA) |
| 5 | 6 | React-Native shell + bank viewer |
| 6 | 7 | AI service + explanation API |
| 7 | 8 | Gems ledger + leaderboard |
| 8 | 9 | Marketplace (list, buy, escrow wallet) |
| 9 | 10 | Community spaces + chat |
| 10 | 11 | Voice-note playback + eye-care mode |
| 11 | 12 | Paystack/Flutterwave integration |
| 12 | 13 | Admin CMS + content moderation |
| 13 | 14 | Security hardening + pen-test |
| 14 | 15 | Closed beta (500 OAU aspirants) |
| 15 | 16 | Bug-bash + performance tuning |
| 16 | 17 | ASO, marketing site, referral flow |
| 17 | 18 | Public launch (hard date: 15 Jan 2026) |

---

## 14. Budget & Resource Snapshot (₦)
| Item | Cost |
|---|---|
| Cloud (AWS Lagos) 6 mo | ₦3.2 M |
| AI (OpenAI + Polly) | ₦800 k |
| SMS (Termii 500 k msgs) | ₦400 k |
| Dev team (4 engineers × 4 mo) | ₦9.6 M |
| QA + DevOps (2 × 4 mo) | ₦3.2 M |
| Design + UX | ₦1 M |
| Pen-test & audit | ₦600 k |
| Contingency 10 % | ₦1.8 M |
| **Total** | **₦20.6 M** |

---

## 15. Risk Register & Mitigations
| Risk | Likely? | Impact | Mitigation |
|---|---|---|---|
| GPT-4 hallucination | M | H | Confidence filter + human review queue |
| Store rejection (Google) | L | H | Follow policy, use in-app update, maintain 64-bit |
| Data-cost complaints | M | M | Compress audio, optional video, Wi-Fi-only default |
| Fraudulent gem farming | H | M | Rate-limit, device fingerprint, manual audit |
| Regulatory takedown (NITDA) | L | H | Maintain NDPR compliance, local data, legal retainer |

---

**End of Document** – ready for engineering kick-off.