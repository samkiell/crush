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
        let qs = await getQuestions();
        if (qs.length === 0 && initialQuestions) {
          qs = initialQuestions;
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
