'use client';

import { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

export default function QuestionEditDrawer({ question, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState(question || {});

  useEffect(() => {
    setFormData(question || {});
  }, [question]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleOptionChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      options: { ...prev.options, [key]: value }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-base-100 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-100 z-10">
          <h2 className="text-lg font-bold">
            {question?._id ? 'Edit Question' : 'New Question'}
          </h2>
          <div className="flex items-center gap-2">
            {question?._id && (
              <button 
                onClick={() => {
                    if(confirm('Are you sure?')) onDelete(question._id);
                }} 
                className="btn btn-ghost btn-sm text-error"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Subject</label>
              <input 
                type="text" 
                className="input input-bordered input-sm" 
                value={formData.subject || ''}
                onChange={e => handleChange('subject', e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">Year</label>
              <input 
                type="number" 
                className="input input-bordered input-sm" 
                value={formData.year || ''}
                onChange={e => handleChange('year', e.target.value)}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="form-control">
            <label className="label">Question Text</label>
            <textarea 
              className="textarea textarea-bordered h-32 text-base" 
              value={formData.question || ''}
              onChange={e => handleChange('question', e.target.value)}
            />
          </div>

          {/* Image URL (Optional) */}
          <div className="form-control">
            <label className="label">Image URL (Optional)</label>
            <div className="join">
                <input 
                    type="text" 
                    className="input input-bordered input-sm join-item w-full" 
                    value={formData.image || ''}
                    onChange={e => handleChange('image', e.target.value)}
                    placeholder="https://..."
                />
                <button className="btn btn-sm join-item"><ImageIcon size={16} /></button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="label font-bold">Options</label>
            {['A', 'B', 'C', 'D', 'E'].map(opt => (
              <div key={opt} className="flex items-center gap-2">
                <span className={`w-8 h-8 flex items-center justify-center rounded font-bold ${formData.answer === opt ? 'bg-success text-white' : 'bg-base-200'}`}>
                  {opt}
                </span>
                <input 
                  type="text" 
                  className="input input-bordered input-sm flex-1" 
                  value={formData.options?.[opt] || ''}
                  onChange={e => handleOptionChange(opt, e.target.value)}
                />
                <input 
                  type="radio" 
                  name="correctAnswer" 
                  className="radio radio-success radio-sm"
                  checked={formData.answer === opt}
                  onChange={() => handleChange('answer', opt)}
                />
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="form-control">
            <label className="label">Explanation</label>
            <textarea 
              className="textarea textarea-bordered h-24" 
              value={formData.explanation || ''}
              onChange={e => handleChange('explanation', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-200 bg-base-50 flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button 
            onClick={() => onSave(formData)} 
            className="btn btn-primary"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
