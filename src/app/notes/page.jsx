"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getNotesLocal } from "@/lib/offlineCache";
import { syncNotes } from "@/lib/syncEngine";

import { StickyNote, Search, Filter, Trash2, Edit2, Plus } from "lucide-react";
import NotesEditor from "@/components/notes/NotesEditor";
import { saveNoteLocal, deleteNoteLocal, queueNoteSync } from "@/lib/offlineCache";

const NotesPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [editingNote, setEditingNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchNotes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (navigator.onLine) {
        await syncNotes();
      }
      const localNotes = await getNotesLocal(user._id);
      // Sort by date desc
      localNotes.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      setNotes(localNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const handleSaveNote = async (content) => {
    if (!user) return;

    const noteData = {
      _id: editingNote ? editingNote._id : crypto.randomUUID(),
      questionId: editingNote?.questionId || null,
      subject: editingNote?.subject || (selectedSubject === "All" ? "General" : selectedSubject),
      content,
      userId: user._id,
      createdAt: editingNote ? editingNote.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveNoteLocal(noteData);
    await queueNoteSync(editingNote ? "update" : "create", noteData);
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

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ["All", ...new Set(notes.map((n) => n.subject))];

  return (
    <div className="min-h-screen bg-base-100">

      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <StickyNote className="w-8 h-8 text-primary" />
              My Notes
            </h1>
            <p className="text-base-content/60 mt-1">Manage your personal study notes and annotations</p>
          </div>
          
          <button 
            onClick={() => setIsCreating(true)}
            className="btn btn-primary gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Create Note
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search notes..."
              className="input input-bordered w-full pl-10 bg-base-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="w-5 h-5 text-base-content/40 shrink-0" />
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`btn btn-sm rounded-full ${selectedSubject === subj ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Modal/Overlay */}
        {(isCreating || editingNote) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl h-[600px] bg-base-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col" data-theme="light">
               <div className="p-4 border-b border-base-content/10 flex justify-between items-center">
                 <h3 className="font-bold text-lg">{editingNote ? "Edit Note" : "New Note"}</h3>
                 <div className="flex gap-2">
                    {/* Subject Selector if creating */}
                    {!editingNote && (
                        <select 
                            className="select select-bordered select-sm"
                            value={selectedSubject === "All" ? "General" : selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)} // This updates filter, maybe separate state for new note subject?
                            // For simplicity, let's just use a text input for subject if creating new, or select from existing.
                        >
                            <option value="General">General</option>
                            {subjects.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="Mathematics">Mathematics</option>
                        </select>
                    )}
                 </div>
               </div>
               <div className="flex-1 overflow-hidden">
                 <NotesEditor 
                    initialContent={editingNote?.content || ""}
                    onSave={handleSaveNote}
                    onClose={() => {
                        setIsCreating(false);
                        setEditingNote(null);
                    }}
                 />
               </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 bg-base-200/30 rounded-3xl border border-dashed border-base-content/20">
            <StickyNote className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
            <h3 className="text-xl font-bold opacity-60">No notes found</h3>
            <p className="text-base-content/40 mt-2">Create a new note or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div key={note._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all border border-base-content/5 group">
                <div className="card-body p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="badge badge-primary badge-outline text-xs font-bold">{note.subject}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingNote(note)}
                        className="btn btn-ghost btn-xs btn-square text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note._id)}
                        className="btn btn-ghost btn-xs btn-square text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="prose prose-sm mb-4 line-clamp-4 text-base-content/80"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                  
                  <div className="mt-auto pt-4 border-t border-base-content/5 flex justify-between items-center text-xs text-base-content/40">
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    {note.questionId && <span className="badge badge-ghost badge-xs">Q: {note.questionId}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotesPage;
