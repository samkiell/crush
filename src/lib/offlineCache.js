import { openDB } from "idb";

const DB_NAME = "crush-edu-offline-db";
const DB_VERSION = 1;

const STORES = {
  QUESTIONS: "questions",
  SUBMISSIONS: "submissions",
  STUDY_PROGRESS: "study-progress",
  CBT_SESSIONS: "cbt-sessions",
  NOTES: "notes",
  NOTE_SYNC_QUEUE: "note-sync-queue",
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
      if (!db.objectStoreNames.contains(STORES.NOTES)) {
        const noteStore = db.createObjectStore(STORES.NOTES, {
          keyPath: "_id",
        });
        noteStore.createIndex("userId", "userId");
        noteStore.createIndex("questionId", "questionId");
        noteStore.createIndex("subject", "subject");
      }
      if (!db.objectStoreNames.contains(STORES.NOTE_SYNC_QUEUE)) {
        db.createObjectStore(STORES.NOTE_SYNC_QUEUE, {
          keyPath: "id",
          autoIncrement: true,
        });
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

// --- Notes Caching ---

export const saveNoteLocal = async (note) => {
  const db = await initDB();
  await db.put(STORES.NOTES, note);
};

export const getNotesLocal = async (userId) => {
  const db = await initDB();
  const tx = db.transaction(STORES.NOTES, "readonly");
  const index = tx.store.index("userId");
  return index.getAll(userId);
};

export const getNoteByQuestionLocal = async (questionId) => {
  const db = await initDB();
  const tx = db.transaction(STORES.NOTES, "readonly");
  const index = tx.store.index("questionId");
  return index.getAll(questionId);
};

export const deleteNoteLocal = async (noteId) => {
  const db = await initDB();
  await db.delete(STORES.NOTES, noteId);
};

export const queueNoteSync = async (action, noteData) => {
  const db = await initDB();
  await db.add(STORES.NOTE_SYNC_QUEUE, {
    action, // 'create', 'update', 'delete'
    data: noteData,
    timestamp: Date.now(),
  });
};

export const getNoteSyncQueue = async () => {
  const db = await initDB();
  return db.getAll(STORES.NOTE_SYNC_QUEUE);
};

export const clearNoteSyncQueueItem = async (id) => {
  const db = await initDB();
  await db.delete(STORES.NOTE_SYNC_QUEUE, id);
};
