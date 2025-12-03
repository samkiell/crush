import { openDB } from "idb";

const DB_NAME = "crush-cbt-db";
const STORE_QUESTIONS = "questions";
const STORE_ANSWERS = "answers";
const STORE_SYNC_QUEUE = "syncQueue";
const STORE_BOOKMARKS = "bookmarks";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_QUESTIONS)) {
        db.createObjectStore(STORE_QUESTIONS, { keyPath: "qid" });
      }
      if (!db.objectStoreNames.contains(STORE_ANSWERS)) {
        db.createObjectStore(STORE_ANSWERS, { keyPath: "questionId" });
      }
      if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
        db.createObjectStore(STORE_SYNC_QUEUE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        db.createObjectStore(STORE_BOOKMARKS, { keyPath: "questionId" });
      }
    },
  });
};

export const saveQuestions = async (questions) => {
  const db = await initDB();
  const tx = db.transaction(STORE_QUESTIONS, "readwrite");
  await Promise.all(questions.map((q) => tx.store.put(q)));
  await tx.done;
};

export const getQuestions = async () => {
  const db = await initDB();
  return db.getAll(STORE_QUESTIONS);
};

export const saveAnswerLocal = async (answer) => {
  const db = await initDB();
  await db.put(STORE_ANSWERS, answer);
  // Add to sync queue
  await db.put(STORE_SYNC_QUEUE, {
    ...answer,
    type: "answer",
    timestamp: Date.now(),
  });
};

export const getSyncQueue = async () => {
  const db = await initDB();
  return db.getAll(STORE_SYNC_QUEUE);
};

export const clearSyncQueueItem = async (id) => {
  const db = await initDB();
  await db.delete(STORE_SYNC_QUEUE, id);
};

export const saveBookmarkLocal = async (bookmark) => {
  const db = await initDB();
  await db.put(STORE_BOOKMARKS, bookmark);
};

export const removeBookmarkLocal = async (questionId) => {
  const db = await initDB();
  await db.delete(STORE_BOOKMARKS, questionId);
};

export const getBookmarks = async () => {
  const db = await initDB();
  return db.getAll(STORE_BOOKMARKS);
};
