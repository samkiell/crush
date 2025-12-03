'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export default function QuestionFilterPanel({ filters, setFilters, subjects, years }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <button 
        className="md:hidden btn btn-ghost btn-sm"
        onClick={() => setIsOpen(true)}
      >
        <Filter size={20} />
      </button>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:w-64 md:shadow-none md:border-r md:border-base-200 md:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-base-200 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <Filter size={18} /> Filters
          </h3>
          <button onClick={() => setIsOpen(false)} className="md:hidden btn btn-ghost btn-xs">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Subject */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Subject</span>
            </label>
            <select 
              className="select select-bordered select-sm w-full"
              value={filters.subject || ''}
              onChange={(e) => handleChange('subject', e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Year</span>
            </label>
            <select 
              className="select select-bordered select-sm w-full"
              value={filters.year || ''}
              onChange={(e) => handleChange('year', e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <button 
            className="btn btn-ghost btn-sm w-full text-error"
            onClick={() => setFilters({})}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
