# Quick Start: Adding Chat to Navigation

## Add to Your Navbar

Update your main navigation component to include a chat link:

```jsx
import { MessageCircle } from 'lucide-react';

// In your navigation items array:
const navItems = [
  // ... existing items
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageCircle,
    description: 'Study chat rooms',
  },
];
```

## Example: Add to Dashboard Layout

If you have a sidebar navigation, add:

```jsx
<Link 
  href="/chat" 
  className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 rounded-lg transition-all"
>
  <MessageCircle className="w-5 h-5" />
  <span>Chat Rooms</span>
  {/* Optional: Show unread count badge */}
  <span className="badge badge-primary badge-sm">3</span>
</Link>
```

## Add to Mobile Bottom Nav

```jsx
<nav className="btm-nav lg:hidden">
  {/* Existing nav items */}
  <button onClick={() => router.push('/chat')}>
    <MessageCircle className="w-6 h-6" />
    <span className="btm-nav-label">Chat</span>
  </button>
</nav>
```

## Default Rooms to Create

Consider pre-creating these rooms for your users:

1. **General Chat** (Public, General)
2. **JAMB 2025 Prep** (Study Group, General)
3. **Mathematics Help** (Subject, Mathematics)
4. **English Q&A** (Subject, English)
5. **Physics Discussion** (Subject, Physics)
6. **Chemistry Lab** (Subject, Chemistry)
7. **Biology Study Group** (Subject, Biology)

You can seed these rooms using a script or admin panel.

## Integration with Existing Features

### Link from Community Page
Add a quick action button in your community page:

```jsx
<Link href="/chat" className="btn btn-outline gap-2">
  <MessageCircle className="w-5 h-5" />
  Join Study Chat
</Link>
```

### Link from Dashboard
Add to quick actions:

```jsx
<div className="card bg-base-200">
  <div className="card-body">
    <h3 className="card-title">Study Chat</h3>
    <p>Connect with fellow JAMB students</p>
    <Link href="/chat" className="btn btn-primary">
      Open Chat Rooms
    </Link>
  </div>
</div>
```

## Notification Integration

To show chat notifications in your existing notification panel:

```javascript
// In your notification fetching logic
const chatNotifications = await fetchUnreadMessages();

// Display in notification panel
{chatNotifications.map(notif => (
  <div className="notification-item">
    <MessageCircle className="w-4 h-4" />
    <div>
      <p>{notif.sender.username} in {notif.roomName}</p>
      <p className="text-sm">{notif.content}</p>
    </div>
  </div>
))}
```

## Testing Your Integration

1. Navigate to `/chat` after dev server restarts
2. Click "Create Room"
3. Create a test room (e.g., "Test Math Group")
4. Join the room
5. Send a test message
6. Try replying, reacting, editing

## Styling Customization

The chat follows your existing theme automatically, but you can customize:

```css
/* In your globals.css or component */
.chat-message {
  /* Override message bubble styles */
}

.chat-room-card {
  /* Override room card styles */
}
```

## That's It!

Your chat room is ready to use. Check the full documentation in `.agent/chat-room-documentation.md` for advanced features.
