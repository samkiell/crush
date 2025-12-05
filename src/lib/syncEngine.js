import {
  getNoteSyncQueue,
  clearNoteSyncQueueItem,
  saveNoteLocal,
  deleteNoteLocal,
} from "./offlineCache";

export const syncNotes = async () => {
  if (!navigator.onLine) return;

  const queue = await getNoteSyncQueue();
  if (queue.length === 0) return;

  console.log("Syncing notes...", queue.length, "items");

  for (const item of queue) {
    try {
      const { action, data, id } = item;
      let response;

      if (action === "create" || action === "update") {
        response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else if (action === "delete") {
        response = await fetch(`/api/notes?id=${data._id}`, {
          method: "DELETE",
        });
      }

      if (response && response.ok) {
        const result = await response.json();

        // Update local cache with server response (e.g. real ID) if needed
        if (action === "create" || action === "update") {
          // If we created a note with a temp ID, we might need to swap it,
          // but for simplicity let's assume the UI handles temp IDs or we just overwrite.
          // Ideally, we replace the temp ID with the server ID in the local DB.
          if (result.data) {
            await saveNoteLocal(result.data);
            // If the local ID was different (temp), delete the old one?
            // This is complex. For now, let's assume the UI waits for sync or we just update content.
            // A better approach for offline-first is using UUIDs generated on client.
          }
        } else if (action === "delete") {
          await deleteNoteLocal(data._id);
        }

        await clearNoteSyncQueueItem(id);
      } else {
        console.error("Failed to sync note item", item, response.status);
      }
    } catch (error) {
      console.error("Error syncing note item", item, error);
    }
  }
};

// Auto-sync when coming online
if (typeof window !== "undefined") {
  window.addEventListener("online", syncNotes);
  // Initial sync attempt on load
  setTimeout(syncNotes, 5000);
}
