import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Plus, X } from 'lucide-react';
import { Category, Prompt } from '../types';
import { PromptCard } from './PromptCard';

interface CategoryViewProps {
  key?: React.Key;
  category: Category;
  prompts: Prompt[];
  onBack: () => void;
  onAddPrompt: (text: string) => void;
  onDeletePrompt: (id: string) => void;
}

export function CategoryView({
  category,
  prompts,
  onBack,
  onAddPrompt,
  onDeletePrompt,
}: CategoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newPromptText, setNewPromptText] = useState('');

  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return prompts;
    const query = searchQuery.toLowerCase();
    return prompts.filter((p) => p.text.toLowerCase().includes(query));
  }, [prompts, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPromptText.trim()) {
      onAddPrompt(newPromptText.trim());
      setNewPromptText('');
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${category.bgClass.replace('/10', '')} shadow-[0_0_10px_currentColor] ${category.colorClass}`}></span>
              {category.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'} saved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-[#141414] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category.bgClass} ${category.colorClass} hover:brightness-125`}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Prompt</span>
          </button>
        </div>
      </div>

      {/* Add Prompt Modal / Inline Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddSubmit} className="bg-[#141414] border border-white/10 rounded-2xl p-5 relative">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-medium text-white mb-4">Add New Prompt</h3>
              <textarea
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                placeholder="Paste your prompt here..."
                className="w-full h-32 bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-white/20 resize-none mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPromptText.trim()}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${category.bgClass} ${category.colorClass} hover:brightness-125`}
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Search className="text-gray-600" size={32} />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No prompts found</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {searchQuery
              ? `No prompts matching "${searchQuery}" in this category.`
              : "You haven't added any prompts to this category yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onDelete={onDeletePrompt}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
