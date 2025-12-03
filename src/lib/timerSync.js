class TimerSync {
  constructor() {
    this.drift = 0;
    this.intervalId = null;
    this.resyncIntervalId = null;
    this.endTime = null;
    this.callbacks = [];
    this.onExpire = null;
    this.isExpired = false;
  }

  async sync() {
    try {
      const start = Date.now();
      const res = await fetch("/api/cbt/time");
      const data = await res.json();
      const end = Date.now();

      // Calculate round-trip time (RTT)
      const rtt = end - start;

      // Server time is approximately: serverTime + RTT/2
      const serverTime = data.timestamp + rtt / 2;

      // Drift = Server Time - Client Time
      // If drift is positive, server is ahead.
      // If drift is negative, server is behind.
      this.drift = serverTime - end;

      console.log(`[TimerSync] Synced. Drift: ${this.drift}ms, RTT: ${rtt}ms`);
    } catch (error) {
      console.error("[TimerSync] Sync failed:", error);
    }
  }

  getCorrectedTime() {
    return Date.now() + this.drift;
  }

  start(durationMs, onTick, onExpire) {
    this.stop(); // Clear existing

    this.onExpire = onExpire;

    // If we haven't synced yet, try to sync first
    if (this.drift === 0) {
      this.sync().then(() => {
        this._startTimer(durationMs, onTick);
      });
    } else {
      this._startTimer(durationMs, onTick);
    }

    // Resync every 30 seconds
    this.resyncIntervalId = setInterval(() => {
      this.sync();
    }, 30000);
  }

  _startTimer(durationMs, onTick) {
    // Calculate end time based on corrected time
    // If we are restarting a session, durationMs might be the *remaining* time.
    // Ideally, we should pass the absolute target end time from the server.
    // But if we only have duration, we assume it starts NOW.
    // However, for CBT, we usually have a fixed End Time stored in DB.
    // Let's assume durationMs is "Time Remaining" for now, or we can adapt.

    // Wait, usually for CBT, we want to count down to a specific Date.
    // If the user passes `endTime` timestamp, that's better.
    // But the prompt says "start(durationMs)".
    // Let's assume durationMs is the remaining time from NOW.

    const now = this.getCorrectedTime();
    this.endTime = now + durationMs;

    this.intervalId = setInterval(() => {
      const currentTime = this.getCorrectedTime();
      const timeLeft = Math.max(0, this.endTime - currentTime);

      if (timeLeft <= 0) {
        this.stop();
        this.isExpired = true;
        if (this.onExpire) this.onExpire();
        if (onTick) onTick(0, true); // 0 time left, expired = true
      } else {
        if (onTick) onTick(timeLeft, false);
      }
    }, 1000);

    // Initial tick
    if (onTick) onTick(durationMs, false);
  }

  // Alternative start method if we have absolute end time
  startWithEndTime(endTimeMs, onTick, onExpire) {
    this.stop();
    this.onExpire = onExpire;
    this.endTime = endTimeMs;

    // Sync immediately
    this.sync().then(() => {
      // Start ticking
      this.intervalId = setInterval(() => {
        const currentTime = this.getCorrectedTime();
        const timeLeft = Math.max(0, this.endTime - currentTime);

        if (timeLeft <= 0) {
          this.stop();
          this.isExpired = true;
          if (this.onExpire) this.onExpire();
          if (onTick) onTick(0, true);
        } else {
          if (onTick) onTick(timeLeft, false);
        }
      }, 1000);
    });

    this.resyncIntervalId = setInterval(() => {
      this.sync();
    }, 30000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.resyncIntervalId) clearInterval(this.resyncIntervalId);
    this.intervalId = null;
    this.resyncIntervalId = null;
  }
}

export const timerSync = new TimerSync();
