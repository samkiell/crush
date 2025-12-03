import { openDB } from "idb";

const DB_NAME = "crush-edu-offline-db";
const DB_VERSION = 1;

const STORES = {
  QUESTIONS: "questions",
  SUBMISSIONS: "submissions",
  STUDY_PROGRESS: "study-progress",
  CBT_SESSIONS: "cbt-sessions",
};

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORES.QUESTIONS)) {
        db.createObjectStore(STORES.QUESTIONS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.SUBMISSIONS)) {
        db.createObjectStore(STORES.SUBMISSIONS, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORES.STUDY_PROGRESS)) {
        db.createObjectStore(STORES.STUDY_PROGRESS, { keyPath: "topicId" });
      }
      if (!db.objectStoreNames.contains(STORES.CBT_SESSIONS)) {
        db.createObjectStore(STORES.CBT_SESSIONS, { keyPath: "sessionId" });
      }
    },
  });
};

// --- CBT Session Caching ---

export const cacheQuestionSet = async (sessionId, data) => {
  const db = await initDB();
  await db.put(STORES.CBT_SESSIONS, {
    sessionId,
    ...data,
    timestamp: Date.now(),
  });
};

export const getCachedQuestionSet = async (sessionId) => {
  const db = await initDB();
  return db.get(STORES.CBT_SESSIONS, sessionId);
};

export const clearCachedSession = async (sessionId) => {
  const db = await initDB();
  await db.delete(STORES.CBT_SESSIONS, sessionId);
};

// --- Question Caching (General) ---

export const cacheQuestions = async (questions) => {
  const db = await initDB();
  const tx = db.transaction(STORES.QUESTIONS, "readwrite");
  await Promise.all(questions.map((q) => tx.store.put(q)));
  await tx.done;
};

export const getCachedQuestions = async (ids) => {
  const db = await initDB();
  const tx = db.transaction(STORES.QUESTIONS, "readonly");
  const questions = await Promise.all(ids.map((id) => tx.store.get(id)));
  return questions.filter((q) => !!q);
};

// --- Offline Submissions (Sync Queue Helper) ---

export const queueSubmission = async (submissionData) => {
  const db = await initDB();
  await db.add(STORES.SUBMISSIONS, {
    ...submissionData,
    queuedAt: Date.now(),
    synced: false,
  });
};

export const getQueuedSubmissions = async () => {
  const db = await initDB();
  return db.getAll(STORES.SUBMISSIONS);
};

export const removeSubmission = async (id) => {
  const db = await initDB();
  await db.delete(STORES.SUBMISSIONS, id);
};

// --- Study Progress ---

export const saveStudyProgressLocal = async (topicId, progressData) => {
  const db = await initDB();
  await db.put(STORES.STUDY_PROGRESS, {
    topicId,
    ...progressData,
    lastUpdated: Date.now(),
  });
};

export const getStudyProgressLocal = async (topicId) => {
  const db = await initDB();
  return db.get(STORES.STUDY_PROGRESS, topicId);
};
