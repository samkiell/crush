# CBT Workspace Upgrade Implementation

## Overview
This module implements a robust, offline-capable Computer Based Test (CBT) system with a Node.js/Express backend and Next.js frontend.

## Setup Instructions

### 1. Backend Setup
The backend logic is now integrated into the Next.js application in `src/app/api/cbt` and `src/lib`.

1. **Environment Variables**:
   Ensure your `.env.local` includes `MONGODB_URI` and `JWT_SECRET`.

2. **Database**:
   The application uses the existing MongoDB connection in `src/lib/db.js`.

3. **API Routes**:
   - `/api/cbt/start`
   - `/api/cbt/[sessionId]/answer`
   - `/api/cbt/[sessionId]/integrity`
   - `/api/cbt/[sessionId]/submit`
   - `/api/cbt/[sessionId]/status`
   - `/api/admin/sessions/kill`

### 2. Frontend Integration
The frontend components are integrated into the existing Next.js app in `src/`.

1. **Service Worker**:
   Ensure your `src/app/layout.jsx` or entry point registers the service worker located at `/sw.js` for offline support.
   
   Example registration code to add to a client component (e.g., `src/components/ServiceWorkerRegister.jsx`):
   ```javascript
   'use client';
   import { useEffect } from 'react';
   
   export default function ServiceWorkerRegister() {
     useEffect(() => {
       if ('serviceWorker' in navigator) {
         navigator.serviceWorker.register('/sw.js')
           .then(reg => console.log('SW registered', reg))
           .catch(err => console.log('SW failed', err));
       }
     }, []);
     return null;
   }
   ```

### 3. Running the Full Stack
1. Start the Backend: `cd backend && npm run dev`
2. Start the Frontend: `npm run dev` (in root)

## API Endpoints (Examples)

### Start Session
```bash
curl -X POST http://localhost:5000/api/cbt/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "subject": "math",
    "year": 2024,
    "mode": "cbt",
    "totalQuestions": 40
  }'
```

### Submit Answer
```bash
curl -X POST http://localhost:5000/api/cbt/SESSION_ID/answer \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      { "questionId": "QID", "selectedOption": "A", "timeSpent": 5000 }
    ]
  }'
```

### Report Integrity Issue
```bash
curl -X POST http://localhost:5000/api/cbt/SESSION_ID/integrity \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "tab_switch",
    "severity": "medium"
  }'
```

## Features
- **Offline Support**: Questions are cached in IndexedDB. Answers are queued and synced when online.
- **Integrity**: Detects tab switching and focus loss.
- **Tools**: Built-in Calculator, Audio Reader, and Question Navigator.
- **Mobile-First**: Swipe gestures and responsive design.
