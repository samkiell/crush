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
    // Assuming we have a time endpoint or just use the session start response
    // const res = await fetch('/api/time');
    // const serverTime = res.data.time;
    // return serverTime - (Date.now() + start) / 2;
    return 0;
  } catch (e) {
    return 0;
  }
};
