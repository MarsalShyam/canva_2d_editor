import { motion } from 'framer-motion';
import {
  Save,
  Undo2,
  Redo2,
  MousePointer2,
  Pencil,
  Type,
  Square,
  Circle,
  Triangle,
  Star,
  Check,
  Sparkles,
  Layers,
  Palette,
} from 'lucide-react';

export function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      className="relative w-full max-w-6xl mx-auto mt-12 sm:mt-16 px-2 sm:px-4"
    >
      {/* Glow aura background */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main Container / Window Frame */}
      <div className="bg-[#1e1e24] rounded-2xl sm:rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden text-slate-200 select-none">
        {/* 1. Window Header / Titlebar */}
        <div className="h-10 px-4 flex items-center justify-between bg-[#17171c] border-b border-[#2b2b34] text-xs">
          {/* Traffic lights / Window dots */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              ChullDraw - Creative Canvas
            </span>
          </div>

          {/* Quick status */}
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1 bg-[#25252e] px-2 py-0.5 rounded text-[11px] text-emerald-400 border border-emerald-500/20">
              <Check className="w-3 h-3" />
              <span>Saved to Cloud</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <Undo2 className="w-3.5 h-3.5" />
              <Redo2 className="w-3.5 h-3.5" />
              <Save className="w-3.5 h-3.5 text-blue-400 ml-1" />
            </div>
          </div>
        </div>

        {/* 2. Ribbon Toolbar Mockup */}
        <div className="h-14 sm:h-16 px-4 bg-[#23232b] border-b border-[#2d2d38] flex items-center justify-between gap-2 overflow-x-auto text-xs">
          {/* Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-[#1a1a20] p-1 rounded-xl border border-[#333340]">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <MousePointer2 className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center">
                <Pencil className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center">
                <Type className="w-4 h-4 font-bold" />
              </div>
            </div>

            {/* Shapes */}
            <div className="hidden sm:flex items-center gap-1 bg-[#1a1a20] p-1 rounded-xl border border-[#333340]">
              <div className="w-8 h-8 rounded-lg text-slate-300 flex items-center justify-center">
                <Square className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-lg text-slate-300 flex items-center justify-center">
                <Circle className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-lg text-slate-300 flex items-center justify-center">
                <Triangle className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-lg text-amber-400 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-[#1a1a20] px-3 py-1.5 rounded-xl border border-[#333340]">
              <div className="w-5 h-5 rounded-md bg-indigo-500 border-2 border-white shadow-sm" />
              <div className="w-5 h-5 rounded-md bg-amber-400 border border-slate-600" />
              <div className="hidden md:flex items-center gap-1 pl-2 border-l border-[#333340]">
                {['#22C55E', '#EC4899', '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6'].map((c) => (
                  <div key={c} className="w-4 h-4 rounded-full border border-black/40" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Canvas Drawing Area Mockup */}
        <div className="relative min-h-[320px] sm:min-h-[460px] bg-[#141418] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
          {/* Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* White Canvas Sheet */}
          <div className="relative w-full max-w-3xl aspect-[16/10] bg-white rounded-xl shadow-2xl overflow-hidden p-6 sm:p-10 flex flex-col justify-between border border-slate-300/40 text-slate-900">
            {/* Top Canvas artwork elements */}
            <div className="flex items-start justify-between">
              {/* Badge element */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Modern 2D Canvas</span>
              </div>

              {/* Geometric graphic badge */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-md transform rotate-6">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            {/* Selected Heading with Fabric Selection Handles */}
            <div className="relative my-auto text-center">
              <div className="inline-block relative p-3 border-2 border-dashed border-blue-500 rounded-lg bg-blue-50/20">
                {/* 8 Control Points (Fabric Handles) */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />

                {/* Text */}
                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Design Your Next Idea
                </h3>
              </div>
            </div>

            {/* Bottom canvas artwork shapes */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 shadow-sm flex items-center justify-center text-white font-bold text-xs">
                  2D
                </div>
                <div className="w-20 h-4 bg-slate-200 rounded-full" />
              </div>

              {/* Colorful shapes */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-rose-500 shadow-sm" />
                <div className="w-7 h-7 rounded-lg bg-blue-600 shadow-sm" />
                <div className="w-7 h-7 rounded-lg bg-indigo-600 shadow-sm transform rotate-45" />
              </div>
            </div>
          </div>

          {/* Floating UI Widget 1: Layers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden lg:flex absolute left-8 bottom-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-3.5 items-center gap-3 text-slate-800"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Vector Shapes</div>
              <div className="text-[11px] text-slate-500">Move, rotate, resize</div>
            </div>
          </motion.div>

          {/* Floating UI Widget 2: Color Styling */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="hidden lg:flex absolute right-8 top-16 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-3.5 items-center gap-3 text-slate-800"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">MS Paint Palette</div>
              <div className="text-[11px] text-slate-500">20 Presets & Custom Hex</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
