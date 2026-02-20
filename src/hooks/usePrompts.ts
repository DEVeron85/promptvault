import { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { CATEGORIES } from '../constants';

export function usePrompts() {
  const [promptsByCat, setPromptsByCat] = useState<Record<string, Prompt[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 1) Load on first render
  useEffect(() => {
    const saved = localStorage.getItem('promptvault_data');
    const initial: Record<string, Prompt[]> = {};
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        CATEGORIES.forEach(c => {
          initial[c.name] = parsed[c.name] || [];
        });
      } catch (e) {
        CATEGORIES.forEach(c => {
          initial[c.name] = [];
        });
      }
    } else {
      CATEGORIES.forEach(c => {
        initial[c.name] = [];
      });
    }
    
    setPromptsByCat(initial);
    setIsLoaded(true);
  }, []);

  // 2) Save when prompts change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('promptvault_data', JSON.stringify(promptsByCat));
    }
  }, [promptsByCat, isLoaded]);

  const addPrompt = (categoryName: string, text: string) => {
    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      categoryId: categoryName,
      text,
      createdAt: Date.now(),
    };
    setPromptsByCat((prev) => ({
      ...prev,
      [categoryName]: [newPrompt, ...(prev[categoryName] || [])]
    }));
  };

  const deletePrompt = (categoryName: string, id: string) => {
    setPromptsByCat((prev) => ({
      ...prev,
      [categoryName]: (prev[categoryName] || []).filter((p) => p.id !== id)
    }));
  };

  const getPromptsByCategory = (categoryName: string) => {
    return promptsByCat[categoryName] || [];
  };

  return {
    promptsByCat,
    addPrompt,
    deletePrompt,
    getPromptsByCategory,
    isLoaded
  };
}
