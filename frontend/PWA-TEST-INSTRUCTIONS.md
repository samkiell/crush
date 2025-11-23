# How to Test PWA

## Current Issue
PWA features **do not work in development mode** (`npm run dev`) because they are disabled to prevent caching issues during development.

## Steps to Test PWA

### 1. Build for Production
```bash
npm run build
```
✅ **Already completed!**

### 2. Start Production Server
```bash
npm start
```

### 3. Open in Chrome
- Navigate to `http://localhost:3000`
- Look for the **install icon** (⊕) in the address bar
- Or check Chrome menu > "Install DEVOUR TO CRUSH..."

### 4. Verify PWA Features

**Check Manifest:**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Manifest** in sidebar
4. Verify all details are correct

**Check Service Worker:**
1. In **Application** tab
2. Click **Service Workers**
3. Should see service worker "activated and running"

**Test Installation:**
1. Click install icon or button
2. App should install and open in standalone window

**Test Offline:**
1. Visit a few pages while online
2. Open DevTools > Network tab
3. Check **Offline** checkbox
4. Navigate to previously visited pages
5. They should load from cache

## Current Status

- ✅ Build: **Completed**
- ⏳ Server: **Need to run `npm start`**
- ⏳ Testing: **Pending**

## Next Command

Run this to start the production server:
```bash
npm start
```

Then open **http://localhost:3000** in Chrome to test!
