import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { Folder, ChevronRight, Wand2 } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (id: string) => void;
  promptCounts: Record<string, number>;
}

export function CategoryGrid({ onSelectCategory, promptCounts }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {CATEGORIES.map((category, index) => {
        const Icon = category.iconName === 'Wand2' ? Wand2 : Folder;
        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectCategory(category.id)}
            className={`group flex flex-col text-left p-6 rounded-2xl border ${category.bgClass} ${category.borderClass} ${category.hoverBorderClass} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className={`p-3 rounded-xl bg-black/20 ${category.colorClass}`}>
                <Icon size={24} />
              </div>
              <ChevronRight className={`opacity-0 group-hover:opacity-100 transition-opacity ${category.colorClass}`} size={20} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">{category.name}</h3>
            <p className="text-sm text-gray-400">
              {promptCounts[category.id] || 0} {(promptCounts[category.id] === 1) ? 'prompt' : 'prompts'}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
