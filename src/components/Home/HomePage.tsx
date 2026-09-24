import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Paintbrush,
  Plus,
  Palette,
  Cloud,
  MousePointerClick,
  Sparkles,
  Loader2,
  Square,
  Type,
  Pencil,
} from 'lucide-react';

import { useFirestore } from '../../hooks/useFirestore';
import { showToast } from '../shared/Toast';

export function HomePage() {
  const navigate = useNavigate();
  const { createCanvas } = useFirestore();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCanvas = async () => {
    setIsCreating(true);
    try {
      const canvasId = await createCanvas('Untitled - Paint');
      showToast('success', 'Canvas created! Opening editor...');
      navigate(`/canvas/${canvasId}`);
    } catch {
      showToast('error', 'Failed to create canvas.');
      setIsCreating(false);
    }
  };

  const features = [
    {
      icon: Square,
      title: 'Shapes & Lines',
      desc: 'Drag and draw rectangles, circles, triangles, lines, stars & arrows with live outline.',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      icon: Pencil,
      title: 'Freehand Pen & Eraser',
      desc: 'Smooth pencil brush with customizable stroke widths and colors.',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      icon: Type,
      title: 'Typography & Text',
      desc: 'Add editable text, format font family, font size, bold, italic, and alignments.',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      icon: MousePointerClick,
      title: 'Transformations',
      desc: 'Select, move, resize, rotate, flip, and re-order any object on canvas.',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    {
      icon: Palette,
      title: 'MS Paint Palette',
      desc: 'Classic 2-row color palette with Color 1 (Stroke) and Color 2 (Fill) selection.',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      icon: Cloud,
      title: 'Firebase Persistence',
      desc: 'Save canvas state directly to Firestore and reload anytime via unique URL.',
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#121214] text-[#e0e0e0] flex flex-col font-sans relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation Bar */}
      <header className="relative z-10 h-16 px-6 md:px-12 flex items-center justify-between border-b border-[#252528] bg-[#161618]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Paintbrush className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Paint<span className="text-blue-400">Flow</span> 2D
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateCanvas}
            disabled={isCreating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            {isCreating ? 'Creating...' : 'New Canvas'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-medium mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Production-Quality 2D Canvas Editor
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
        >
          MS Paint Workspace. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Modern Web Simplicity.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed"
        >
          Draw shapes, sketch freehand, edit text, adjust colors, and save your work to Firestore with full URL-based reload and undo/redo history.
        </motion.p>

        {/* Create New Canvas CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10"
        >
          <button
            id="create-canvas-btn"
            onClick={handleCreateCanvas}
            disabled={isCreating}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Canvas in Firestore...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create New Canvas
              </>
            )}
          </button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left w-full"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-5 rounded-2xl bg-[#1c1c1f]/80 border border-[#2b2b2f] hover:border-[#3d3d42] transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border mb-3 ${f.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-gray-500 border-t border-[#222225]">
        React • Fabric.js • Firebase Firestore • Tailwind CSS
      </footer>
    </div>
  );
}
