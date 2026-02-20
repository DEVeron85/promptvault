import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  key?: React.Key;
  prompt: Prompt;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, onDelete }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#141414] border border-white/5 rounded-2xl p-5 group hover:border-white/10 transition-colors flex flex-col"
    >
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-6 flex-1">
        {prompt.text}
      </p>
      <div className="flex items-center justify-end gap-2 mt-auto">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={() => onDelete(prompt.id)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </motion.div>
  );
}
