"use client";

import { useState, useRef, useEffect } from "react";
import { Bold, List, Heading, Save, X, Loader2 } from "lucide-react";

const NotesEditor = ({ initialContent = "", onSave, onClose, isSaving = false }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
        // Only set if significantly different to avoid cursor jumps if we were binding onInput
        // But here we set initial only.
        if (initialContent) {
            editorRef.current.innerHTML = initialContent;
        }
    }
  }, [initialContent]);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="bg-base-100 rounded-xl shadow-xl border border-base-content/10 overflow-hidden flex flex-col h-full max-h-[500px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-base-content/10 bg-base-200/50">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleFormat("bold")}
            className="btn btn-ghost btn-sm btn-square"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("insertUnorderedList")}
            className="btn btn-ghost btn-sm btn-square"
            title="List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormat("formatBlock", "H2")}
            className="btn btn-ghost btn-sm btn-square"
            title="Heading"
          >
            <Heading className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
            {onClose && (
                <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        className="flex-1 p-4 overflow-y-auto focus:outline-none prose prose-sm max-w-none"
        contentEditable
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        suppressContentEditableWarning={true}
        style={{ minHeight: "150px" }}
      />

      {/* Footer */}
      <div className="p-3 border-t border-base-content/10 bg-base-200/30 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary btn-sm gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Note
        </button>
      </div>
    </div>
  );
};

export default NotesEditor;
