"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen, Zap, HelpCircle, FileText } from "lucide-react";
import { helpContent } from "@/lib/helpContent";
import Link from "next/link";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const filteredContent = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return helpContent;

    return {
      quickStart: helpContent.quickStart.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      ),
      features: helpContent.features.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.overview.toLowerCase().includes(query) ||
          item.points.some((p) => p.toLowerCase().includes(query))
      ),
      faqs: helpContent.faqs
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.q.toLowerCase().includes(query) ||
              q.a.toLowerCase().includes(query)
          ),
        }))
        .filter((category) => category.questions.length > 0),
    };
  }, [searchQuery]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header / Search Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Quick Start Section */}
        {filteredContent.quickStart.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-yellow-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Start Guide</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.quickStart.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features Section */}
        {filteredContent.features.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feature Guides</h2>
            </div>
            <div className="space-y-6">
              {filteredContent.features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {feature.overview}
                    </p>
                    <ul className="space-y-2">
                      {feature.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {filteredContent.faqs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="text-green-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {filteredContent.faqs.map((category, catIndex) => (
                <div key={catIndex} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 mt-6 mb-3">
                    {category.category}
                  </h3>
                  {category.questions.map((faq, qIndex) => {
                    const uniqueIndex = `${catIndex}-${qIndex}`;
                    const isOpen = openFaqIndex === uniqueIndex;

                    return (
                      <div
                        key={uniqueIndex}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(uniqueIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {faq.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp size={20} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-0 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700/50 mt-2 pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {Object.values(filteredContent).every(
          (arr) => Array.isArray(arr) && arr.length === 0
        ) && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
