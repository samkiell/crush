import { clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL,
} from "workbox-precaching";
import {
  registerRoute,
  NavigationRoute,
  setCatchHandler,
} from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

clientsClaim();

// 1. Precache & Cleanup
// This will be replaced by the list of files to precache during the build
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// 2. Background Sync Queues
const cbtSyncPlugin = new BackgroundSyncPlugin("cbt-answers-queue", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

const integritySyncPlugin = new BackgroundSyncPlugin("integrity-queue", {
  maxRetentionTime: 24 * 60,
});

const studyProgressSyncPlugin = new BackgroundSyncPlugin(
  "study-progress-queue",
  {
    maxRetentionTime: 24 * 60,
  }
);

const notesSyncPlugin = new BackgroundSyncPlugin("notes-sync-queue", {
  maxRetentionTime: 24 * 60,
});

// 3. Runtime Caching

// API GET Requests (StaleWhileRevalidate)
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 Day
      }),
    ],
  })
);

// Questions JSON from MongoDB (simulated path or specific API)
// Assuming questions are fetched via /api/questions or similar
registerRoute(
  ({ url }) => url.pathname.includes("/questions"),
  new CacheFirst({
    cacheName: "questions-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      }),
    ],
  })
);

// Images (CacheFirst)
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Fonts (CacheFirst)
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
      }),
    ],
  })
);

// Scripts and Styles (StaleWhileRevalidate)
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// 4. Background Sync Routes (POST/PUT/DELETE)

registerRoute(
  ({ url, request }) =>
    url.pathname.includes("/api/cbt/submit") && request.method === "POST",
  new NetworkOnly({
    plugins: [cbtSyncPlugin],
  }),
  "POST"
);

registerRoute(
  ({ url, request }) =>
    url.pathname.includes("/api/study/progress") && request.method === "POST",
  new NetworkOnly({
    plugins: [studyProgressSyncPlugin],
  }),
  "POST"
);

registerRoute(
  ({ url, request }) =>
    url.pathname.includes("/api/notes") &&
    (request.method === "POST" || request.method === "PUT"),
  new NetworkOnly({
    plugins: [notesSyncPlugin],
  }),
  "POST"
);

// 5. Navigation Fallback (Offline Page)
// Use a NavigationRoute to handle all navigation requests
const handler = createHandlerBoundToURL("/offline");
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/_next\//, /^\/api\//, /^\/static\//],
});
registerRoute(navigationRoute);

// Fallback for other routes if they fail
setCatchHandler(({ event }) => {
  if (event.request.destination === "document") {
    return caches.match("/offline");
  }
  return Response.error();
});

// 6. Lifecycle Events
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(clientsClaim());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
