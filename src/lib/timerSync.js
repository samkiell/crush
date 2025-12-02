export const calculateTimeLeft = (endTime, serverTimeOffset = 0) => {
  const now = Date.now() + serverTimeOffset;
  const end = new Date(endTime).getTime();
  return Math.max(0, end - now);
};

export const syncServerTime = async () => {
  // In a real app, ping the server and calculate RTT/offset
  // For this implementation, we'll return 0 or fetch from a time endpoint
  try {
    const start = Date.now();
    // We can use the status endpoint to get server time implicitly if it returned current time,
    // but for now let's just assume local time is close enough or implement a specific time endpoint.
    // However, to be robust:
    const res = await fetch("/api/cbt/time"); // We need to create this or use an existing one
    if (res.ok) {
      const data = await res.json();
      const serverTime = new Date(data.time).getTime();
      return serverTime - (Date.now() + start) / 2;
    }
    return 0;
  } catch (e) {
    return 0;
  }
};
