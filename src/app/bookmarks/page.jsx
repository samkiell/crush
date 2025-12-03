'use client';

import { useState, useEffect } from 'react';
import { getBookmarks, removeBookmarkLocal } from '@/lib/idbClient';
import Link from 'next/link';
import { ChevronLeft, Trash2, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import AudioReader from '@/components/AudioReader.client';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const savedBookmarks = await getBookmarks();
      setBookmarks(savedBookmarks);

      if (savedBookmarks.length === 0) {
        setLoading(false);
        return;
      }

      const questionIds = savedBookmarks.map(b => b.questionId);
      
      const res = await fetch('/api/questions/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIds })
      });

      if (!res.ok) throw new Error('Failed to fetch bookmarked questions');

      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (questionId) => {
    await removeBookmarkLocal(questionId);
    setQuestions(prev => prev.filter(q => q.qid !== questionId));
    setBookmarks(prev => prev.filter(b => b.questionId !== questionId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <header className="bg-base-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="btn btn-ghost btn-circle btn-sm">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">My Bookmarks</h1>
            <p className="text-xs text-base-content/60">{questions.length} saved questions</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Bookmarks Yet</h3>
            <p className="text-base-content/60 mb-6">
              Bookmark questions during your study sessions to review them here.
            </p>
            <Link href="/study" className="btn btn-primary">Start Studying</Link>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.qid} className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-50">
                  <span className="bg-base-200 px-2 py-1 rounded">{question.subject}</span>
                  <span className="bg-base-200 px-2 py-1 rounded">{question.year}</span>
                </div>
                <button 
                  onClick={() => handleRemoveBookmark(question.qid)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-start gap-4 mb-4">
                 <h3 className="font-medium text-lg leading-relaxed flex-1">{question.question}</h3>
                 <AudioReader text={question.question} />
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {Object.entries(question.options).map(([key, value]) => (
                  <div 
                    key={key} 
                    className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${
                      key === question.answer 
                        ? 'bg-success/10 border-success text-success-content font-medium' 
                        : 'bg-base-100 border-base-200 opacity-80'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                      key === question.answer ? 'bg-success text-white' : 'bg-base-200'
                    }`}>
                      {key}
                    </span>
                    {value}
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="bg-base-200/50 rounded-xl p-4 text-sm">
                  <div className="flex items-center gap-2 font-bold mb-2 opacity-70">
                    <BookOpen size={14} /> Explanation
                  </div>
                  <p className="leading-relaxed opacity-90">{question.explanation}</p>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
