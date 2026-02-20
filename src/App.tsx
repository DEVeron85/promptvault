import { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { CATEGORIES } from './constants';
import { usePrompts } from './hooks/usePrompts';
import { CategoryGrid } from './components/CategoryGrid';
import { CategoryView } from './components/CategoryView';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { promptsByCat, addPrompt, deletePrompt, getPromptsByCategory, isLoaded } = usePrompts();

  const selectedCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategoryId),
    [selectedCategoryId]
  );

  const promptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((c) => {
      counts[c.id] = promptsByCat[c.name]?.length || 0;
    });
    return counts;
  }, [promptsByCat]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-white/20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">PromptVault</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <div key="grid">
              <div className="mb-8">
                <h2 className="text-3xl font-light tracking-tight text-white mb-2">
                  Your Prompt Library
                </h2>
                <p className="text-gray-400">
                  Organize and manage your image generation prompts.
                </p>
              </div>
              <CategoryGrid
                onSelectCategory={setSelectedCategoryId}
                promptCounts={promptCounts}
              />
            </div>
          ) : (
            <CategoryView
              key="view"
              category={selectedCategory}
              prompts={getPromptsByCategory(selectedCategory.name)}
              onBack={() => setSelectedCategoryId(null)}
              onAddPrompt={(text) => addPrompt(selectedCategory.name, text)}
              onDeletePrompt={(id) => deletePrompt(selectedCategory.name, id)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
