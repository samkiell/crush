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
        // Try loading from IDB first
        let qs = await getQuestions();

        // If no questions in IDB or force refresh needed, fetch from API
        if (qs.length === 0) {
          // Parse session ID to get subject/year if needed, or use a specific endpoint
          // For now, let's mock some questions if the API fails or is not ready
          // In production, this should call /api/questions?subject=...

          // Attempt to fetch from API (assuming an endpoint exists or we use the mock)
          // const res = await fetch(`/api/questions?subject=${subject}&year=${year}`);
          // qs = await res.json();

          // FALLBACK MOCK DATA for testing if API is not ready
          qs = Array.from({ length: 40 }).map((_, i) => ({
            qid: `q-${i}`,
            question: `This is a sample question ${
              i + 1
            } for testing the CBT interface. What is the answer?`,
            options: {
              A: "Option A",
              B: "Option B",
              C: "Option C",
              D: "Option D",
            },
            answer: "A",
          }));

          await saveQuestions(qs);
        }

        setQuestions(qs);
        setStatus("active");
      } catch (e) {
        console.error("Failed to load questions", e);
        setStatus("error");
      }
    };
    load();
  }, [initialQuestions]);

  // Timer
  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      const left = calculateTimeLeft(endTime);
      setTimeLeft(left);
      if (left <= 0) {
        setStatus("submitted");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

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
  };
};
