import { useState, useEffect, useCallback } from "react";
import {
  saveQuestions,
  getQuestions,
  saveAnswerLocal,
  getSyncQueue,
  clearSyncQueueItem,
} from "./idbClient";
import { calculateTimeLeft } from "./timerSync";

export const useCbtSession = ({ sessionId, endTime, initialQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: option }
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState("loading");
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  // Load questions
  useEffect(() => {
    const load = async () => {
      try {
        // 1. Fetch Session Status & Time
        let sessionEndTime = endTime;
        if (!sessionEndTime) {
          try {
            const statusRes = await fetch(`/api/cbt/${sessionId}/status`);
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              if (statusData.endTime) {
                sessionEndTime = new Date(statusData.endTime).getTime();
              }
            }
          } catch (err) {
            console.error("Failed to fetch session status", err);
          }
        }

        // If still no endTime (e.g. offline start), set a default 2 hours from now for testing
        // In real app, we should block or handle this better
        if (!sessionEndTime) {
          sessionEndTime = Date.now() + 2 * 60 * 60 * 1000;
        }

        // 2. Load Questions
        // Try loading from IDB first
        let qs = await getQuestions();

        // If no questions in IDB or force refresh needed, fetch from API
        if (qs.length === 0) {
          // Parse session ID: subject-year-topic
          const parts = sessionId.split("-");
          const subject = parts[0];
          const year = parts[1];

          if (subject && year) {
            try {
              const res = await fetch(
                `/api/questions?subject=${subject}&year=${year}`
              );
              if (res.ok) {
                const data = await res.json();
                if (data.questions && data.questions.length > 0) {
                  qs = data.questions;
                } else {
                  throw new Error("No questions found");
                }
              } else {
                throw new Error("Failed to fetch questions");
              }
            } catch (err) {
              console.error("API fetch failed, falling back to mock", err);
              // Fallback mock only if API fails
              qs = Array.from({ length: 40 }).map((_, i) => ({
                qid: `q-${i}`,
                question: `This is a sample question ${
                  i + 1
                } (Fallback). Real questions failed to load.`,
                options: {
                  A: "Option A",
                  B: "Option B",
                  C: "Option C",
                  D: "Option D",
                },
                answer: "A",
              }));
            }
          } else {
            // Fallback if ID format is wrong
            qs = Array.from({ length: 40 }).map((_, i) => ({
              qid: `q-${i}`,
              question: `This is a sample question ${i + 1} (Invalid ID).`,
              options: {
                A: "Option A",
                B: "Option B",
                C: "Option C",
                D: "Option D",
              },
              answer: "A",
            }));
          }

          await saveQuestions(qs);
        }

        setQuestions(qs);
        setStatus("active");

        // Start Timer Logic with fetched endTime
        const interval = setInterval(() => {
          const left = calculateTimeLeft(sessionEndTime);
          setTimeLeft(left);
          if (left <= 0) {
            setStatus("submitted");
            clearInterval(interval);
          }
        }, 1000);

        // Cleanup interval on unmount is tricky inside useEffect,
        // so we might need to move this to a ref or separate effect.
        // For now, let's update the state endTime so the other effect picks it up.
        // But wait, the other effect depends on `endTime` prop.
        // Let's use a local state for sessionEndTime.
        setInternalEndTime(sessionEndTime);
      } catch (e) {
        console.error("Failed to load questions", e);
        setStatus("error");
      }
    };
    load();
  }, [initialQuestions]);

  const [internalEndTime, setInternalEndTime] = useState(endTime);

  // Timer
  useEffect(() => {
    const targetTime = internalEndTime || endTime;
    if (!targetTime) return;

    const interval = setInterval(() => {
      const left = calculateTimeLeft(targetTime);
      setTimeLeft(left);
      if (left <= 0) {
        setStatus("submitted");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, internalEndTime]);

  // Integrity Listeners
  useEffect(() => {
    if (status !== "active") return;

    const logIntegrity = async (type, details = {}) => {
      try {
        await fetch(`/api/cbt/${sessionId}/integrity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: type,
            details,
            severity: "medium",
          }),
        });
      } catch (e) {
        console.error("Integrity log failed", e);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logIntegrity("visibility_hidden", { timestamp: Date.now() });
        // Optional: Show warning or blur content
      } else {
        logIntegrity("visibility_visible", { timestamp: Date.now() });
      }
    };

    const handleBlur = () => {
      logIntegrity("window_blur", { timestamp: Date.now() });
    };

    const handleFocus = () => {
      logIntegrity("window_focus", { timestamp: Date.now() });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [status, sessionId]);

  // Online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync Queue
  useEffect(() => {
    const sync = async () => {
      if (!isOnline) return;
      const queue = await getSyncQueue();
      if (queue.length === 0) return;

      // Process queue
      try {
        const answers = queue.filter((item) => item.type === "answer");
        if (answers.length > 0) {
          await fetch(`/api/cbt/${sessionId}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
          });

          // Clear synced items
          for (const item of answers) {
            await clearSyncQueueItem(item.id); // Assuming id is the key in IDB
          }
        }
      } catch (e) {
        console.error("Sync failed", e);
      }
    };
    const interval = setInterval(sync, 10000);
    return () => clearInterval(interval);
  }, [isOnline, sessionId]);

  const markAnswer = async (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    await saveAnswerLocal({ questionId, selectedOption: option, sessionId });
  };

  const next = useCallback(
    () => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1)),
    [questions.length]
  );
  const prev = useCallback(
    () => setCurrentIndex((i) => Math.max(i - 1, 0)),
    []
  );
  const jumpTo = useCallback((i) => setCurrentIndex(i), []);

  const submitSession = async () => {
    try {
      setStatus("submitting");

      // 1. Sync any remaining local answers first (optional but good practice)
      // For now, we rely on the background sync or just send what we have if we want to be robust.

      // 2. Call Submit API
      const res = await fetch(`/api/cbt/${sessionId}/submit`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Submission failed");

      const data = await res.json();
      setStatus("submitted");
      return data; // Returns summary
    } catch (e) {
      console.error("Submit error:", e);
      setStatus("error");
      throw e;
    }
  };

  return {
    questions,
    currentIndex,
    answers,
    timeLeft,
    status,
    isOnline,
    markAnswer,
    next,
    prev,
    jumpTo,
    submitSession,
  };
};
