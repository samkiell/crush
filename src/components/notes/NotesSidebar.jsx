import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Trash2, ChevronRight, StickyNote } from "lucide-react";
import NotesEditor from "./NotesEditor";
import { getNotesLocal, getNoteByQuestionLocal, getNotesBySubjectLocal, saveNoteLocal, deleteNoteLocal, queueNoteSync } from "@/lib/offlineCache";
import { syncNotes } from "@/lib/syncEngine";

const NotesSidebar = ({ questionId, subject, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      // Try to sync first if online to get latest
      if (navigator.onLine) {
         await syncNotes();
      }

      let localNotes = [];
      // We need to get user ID somehow. For now, we assume we filter by questionId or subject.
      // But getNotesLocal requires userId.
      // We can get userId from a context or prop.
      // Let's assume we fetch all notes for the question/subject from local DB.
      // But my offlineCache `getNotesLocal` takes userId.
      // I should update offlineCache to allow querying by questionId/subject without userId if needed, 
      // or pass userId.
      // For now, let's assume we pass userId to NotesSidebar or we fetch all and filter.
      // Wait, `getNoteByQuestionLocal` exists.
      
      if (questionId) {
        localNotes = await getNoteByQuestionLocal(questionId);
      } else if (subject) {
        localNotes = await getNotesBySubjectLocal(subject);
      }
      
      // Filter by user ID just in case (though local DB might be shared if not carefully managed, but usually 1 user per device/browser profile)
      if (user?._id) {
          localNotes = localNotes.filter(n => n.userId === user._id || n.userId === "current-user");
      }

      // Sort by date
      localNotes.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      setNotes(localNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchNotes();
    }
  }, [questionId, subject, user]);

  const handleSaveNote = async (content) => {
    if (!user) return;

    const noteData = {
      _id: editingNote ? editingNote._id : crypto.randomUUID(), // Temp ID for new notes
      questionId,
      subject,
      content,
      userId: user._id,
      createdAt: editingNote ? editingNote.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to local
    await saveNoteLocal(noteData);
    
    // Queue sync
    await queueNoteSync(editingNote ? "update" : "create", noteData);

    // Refresh list
    await fetchNotes();
    setIsCreating(false);
    setEditingNote(null);
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    await deleteNoteLocal(noteId);
    await queueNoteSync("delete", { _id: noteId });
    await fetchNotes();
  };

  return (
    <div className="h-full flex flex-col bg-base-100 border-l border-base-content/10 w-80 shadow-2xl">
      <div className="p-4 border-b border-base-content/10 flex items-center justify-between bg-base-200/50">
        <h3 className="font-bold flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          Notes
        </h3>
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : isCreating || editingNote ? (
          <NotesEditor
            initialContent={editingNote?.content || ""}
            onSave={handleSaveNote}
            onClose={() => {
              setIsCreating(false);
              setEditingNote(null);
            }}
          />
        ) : (
          <>
            {notes.length === 0 ? (
              <div className="text-center py-10 text-base-content/50">
                <p>No notes yet.</p>
                <p className="text-sm">Add a note for this question.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="card bg-base-200/50 border border-base-content/5 hover:border-primary/30 transition-colors">
                  <div className="card-body p-4">
                    <div 
                        className="prose prose-sm max-w-none mb-2 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    <div className="flex items-center justify-between text-xs text-base-content/50 mt-2">
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                      <div className="flex gap-1">
                        <button 
                            onClick={() => setEditingNote(note)}
                            className="btn btn-ghost btn-xs text-primary"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDeleteNote(note._id)}
                            className="btn btn-ghost btn-xs text-error"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {!isCreating && !editingNote && (
        <div className="p-4 border-t border-base-content/10 bg-base-200/30 pb-24 md:pb-4">
          <button
            onClick={() => setIsCreating(true)}
            className="btn btn-primary w-full gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add New Note
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesSidebar;
