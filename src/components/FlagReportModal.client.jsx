'use client';
import { useState } from 'react';
import { Flag, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function FlagReportModal({ question, isOpen, onClose }) {
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('Wrong Answer');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!question?._id) {
        toast.error("Cannot report: Question ID missing");
        return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'Question',
          targetId: question._id,
          reason,
          description,
          subject: question.subject,
          year: question.year
        })
      });

      if (res.ok) {
        toast.success('Report sent! We will look into it.');
        onClose();
        setDescription('');
        setReason('Wrong Answer');
      } else {
        toast.error('Failed to send report');
      }
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-base-100 p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-error">
          <Flag size={20} /> Report Issue
        </h3>
        
        {question && (
            <div className="bg-base-200/50 p-3 rounded-lg mb-4 text-sm">
                <div className="flex justify-between mb-1">
                    <span className="font-bold capitalize">{question.subject}</span>
                    <span className="opacity-60">{question.year}</span>
                </div>
                <div className="text-xs opacity-40 mb-2 font-mono">ID: {question.qid || question._id}</div>
                <p className="line-clamp-2 opacity-80 italic">"{question.question}"</p>
            </div>
        )}

        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">What's wrong?</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option>Wrong Answer</option>
            <option>Typo</option>
            <option>Inappropriate Content</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Description (Optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-24"
            placeholder="Provide more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost" disabled={submitting}>Cancel</button>
          <button onClick={handleSubmit} className="btn btn-error text-white" disabled={submitting}>
            {submitting ? <span className="loading loading-spinner loading-xs"></span> : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
