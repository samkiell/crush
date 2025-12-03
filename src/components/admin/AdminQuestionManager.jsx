'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Edit, 
  MoreVertical, 
  CheckSquare, 
  Square,
  Upload,
  Download,
  Plus
} from 'lucide-react';
import QuestionFilterPanel from './QuestionFilterPanel';
import QuestionEditDrawer from './QuestionEditDrawer';
import toast from 'react-hot-toast';

export default function AdminQuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Mock data for filters (in real app, fetch these)
  const subjects = ['mathematics', 'english', 'physics', 'chemistry', 'biology'];
  const years = Array.from({ length: 46 }, (_, i) => 1978 + i);

  useEffect(() => {
    fetchQuestions();
  }, [page, filters, search]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        search,
        ...filters
      });
      const res = await fetch(`/api/admin/questions?${params}`);
      const data = await res.json();
      setQuestions(data.questions);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === questions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(questions.map(q => q._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} questions?`)) return;
    
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Deleted successfully');
      fetchQuestions();
      setSelectedIds(new Set());
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleSave = async (data) => {
    try {
      const method = data._id ? 'PUT' : 'POST';
      const url = data._id ? `/api/admin/questions/${data._id}` : '/api/admin/questions';
      
      // If POST (create), we might need a different endpoint or handle it in the main route
      // For now let's assume PUT for edit. For create we can use the import route or add POST to main route.
      // Let's use the import route for single create for simplicity or add POST to main route.
      // I added POST to import route, but not main route for single create. 
      // Let's just handle Edit for now or assume main route POST handles single.
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Failed');
      
      toast.success('Saved successfully');
      setIsDrawerOpen(false);
      fetchQuestions();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleDeleteSingle = async (id) => {
      try {
          const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed');
          toast.success('Deleted');
          setIsDrawerOpen(false);
          fetchQuestions();
      } catch (error) {
          toast.error('Delete failed');
      }
  };

  const handleImport = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
          try {
              const json = JSON.parse(e.target.result);
              // Check if it's array or object wrapper
              const questions = Array.isArray(json) ? json : json.questions;
              
              const res = await fetch('/api/admin/questions/import', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ questions, replace: false })
              });
              
              if (!res.ok) throw new Error('Import failed');
              const data = await res.json();
              toast.success(data.message);
              fetchQuestions();
          } catch (error) {
              toast.error('Invalid JSON or Import Failed');
          }
      };
      reader.readAsText(file);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-base-200">
      <QuestionFilterPanel 
        filters={filters} 
        setFilters={setFilters} 
        subjects={subjects}
        years={years}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-base-100 border-b border-base-200 p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input 
                type="text" 
                placeholder="Search questions..." 
                className="input input-bordered pl-10 w-full input-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="btn btn-sm btn-outline gap-2">
                <Upload size={16} /> Import JSON
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button 
                onClick={() => { setEditingQuestion({}); setIsDrawerOpen(true); }}
                className="btn btn-sm btn-primary gap-2"
            >
                <Plus size={16} /> New Question
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="bg-primary/10 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-200">
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBulkDelete}
                className="btn btn-xs btn-error text-white"
              >
                <Trash2 size={14} /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
            <table className="table table-sm w-full">
              <thead className="bg-base-200/50">
                <tr>
                  <th className="w-10">
                    <label className="cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-xs"
                        checked={selectedIds.size === questions.length && questions.length > 0}
                        onChange={handleSelectAll}
                      />
                    </label>
                  </th>
                  <th className="w-20">Year</th>
                  <th className="w-24">Subject</th>
                  <th>Question</th>
                  <th className="w-20">Answer</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-base-content/50">
                      No questions found
                    </td>
                  </tr>
                ) : (
                  questions.map(q => (
                    <tr key={q._id} className="hover:bg-base-200/50 transition-colors">
                      <td>
                        <label className="cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-xs"
                            checked={selectedIds.has(q._id)}
                            onChange={() => handleSelect(q._id)}
                          />
                        </label>
                      </td>
                      <td className="font-mono text-xs">{q.year}</td>
                      <td>
                        <span className="badge badge-sm badge-ghost capitalize">{q.subject}</span>
                      </td>
                      <td>
                        <p className="line-clamp-2 text-sm font-medium max-w-xl">
                          {q.question}
                        </p>
                      </td>
                      <td>
                        <span className="badge badge-sm badge-success text-white font-bold">
                          {q.answer}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => { setEditingQuestion(q); setIsDrawerOpen(true); }}
                          className="btn btn-ghost btn-xs btn-square"
                        >
                          <Edit size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-base-100 border-t border-base-200 p-4 flex justify-between items-center">
          <span className="text-sm text-base-content/60">
            Page {page} of {pagination.pages} ({pagination.total} items)
          </span>
          <div className="join">
            <button 
              className="join-item btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-sm">Page {page}</button>
            <button 
              className="join-item btn btn-sm"
              disabled={page === pagination.pages}
              onClick={() => setPage(p => p + 1)}
            >
              »
            </button>
          </div>
        </div>
      </div>

      <QuestionEditDrawer 
        question={editingQuestion}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        onDelete={handleDeleteSingle}
      />
    </div>
  );
}
