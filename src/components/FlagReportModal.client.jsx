'use client';
import { useState } from 'react';
import { Flag } from 'lucide-react';

export default function FlagReportModal({ sessionId, questionId, isOpen, onClose }) {
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch(`http://localhost:5000/api/cbt/${sessionId}/integrity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'flag',
          details: { questionId, description },
          severity: 'low'
        })
      });
      onClose();
      setDescription('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Flag size={20} className="text-error" /> Report Issue
        </h3>
        <textarea
          className="textarea textarea-bordered w-full h-32 mb-4"
          placeholder="Describe the issue with this question..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-error" disabled={submitting}>
            {submitting ? 'Sending...' : 'Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
