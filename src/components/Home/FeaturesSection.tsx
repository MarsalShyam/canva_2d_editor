import { motion } from 'framer-motion';
import {
  Pencil,
  Square,
  Circle,
  Triangle,
  Type,
  Palette,
  MousePointerClick,
  Cloud,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features-section" className="py-20 sm:py-28 bg-[#f8fafc] px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Everything you need to create
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Simple tools. No complicated workflow. Focus on what you want to draw.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Large Card: Freeform Drawing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Pencil className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Freeform Sketching</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mb-2.5">
                Smooth Freehand Pen & Brush
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                Sketch naturally with mouse or trackpad. Adjust stroke thickness and color on the fly, with brush strokes that become interactive objects.
              </p>
            </div>

            {/* Visual illustration inside card */}
            <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/60 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-24 text-indigo-500" viewBox="0 0 300 80" fill="none">
                <path
                  d="M10 50 Q 80 10, 150 40 T 290 30"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <circle cx="150" cy="40" r="8" fill="#6366f1" />
                <circle cx="290" cy="30" r="6" fill="#ec4899" />
              </svg>
            </div>
          </motion.div>

          {/* 2. Small Card: Vector Shapes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Square className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Shapes</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2">
                Geometric Vectors
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Drag to draw rectangles, circles, triangles, stars, arrows, and lines.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500 shadow-sm" />
              <div className="w-9 h-9 rounded-full bg-indigo-500 shadow-sm" />
              <div className="w-9 h-9 rounded-lg bg-amber-400 transform rotate-45 shadow-sm" />
            </div>
          </motion.div>

          {/* 3. Small Card: Typography & Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Type className="w-6 h-6 font-bold" />
              </div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Typography</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2">
                Editable Text
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Double-click inline editing, custom fonts, size, bold, italic, and text alignment.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Aa Bb Gg
              </span>
            </div>
          </motion.div>

          {/* 4. Large Card: Colors & MS Paint Palette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Color Styling</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mb-2.5">
                MS Paint Dual-Palette & Custom Hex
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                Color 1 for outlines and text, Color 2 for shape fill. Instant selection across a classic 2-row swatch grid plus full custom color wheel.
              </p>
            </div>

            {/* Visual palette row preview */}
            <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50/60 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                {['#000000', '#7F7F7F', '#880015', '#ED1C24', '#FF7F27', '#FFF200', '#22B14C', '#00A2E8', '#3F48CC', '#A349A4'].map((c) => (
                  <div key={c} className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform cursor-pointer" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex items-center justify-center gap-2">
                {['#FFFFFF', '#C3C3C3', '#B97A57', '#FFAEC9', '#FFC90E', '#EFE4B0', '#B5E61D', '#99D9EA', '#7092BE', '#C8BFE7'].map((c) => (
                  <div key={c} className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform cursor-pointer" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* 5. Small Card: Object Transformation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Transform</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2">
                Full Control
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Scale with corner handles, rotate smoothly, flip horizontally or vertically, and manage layers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
              <RotateCcw className="w-5 h-5 text-rose-500" />
              <Layers className="w-5 h-5 text-indigo-500" />
            </div>
          </motion.div>

          {/* 6. Small Card: Firestore Cloud Sync */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cloud className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Persistence</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2">
                Cloud Saved
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Saved directly to Firebase Firestore. Reload anytime via your unique URL (/canvas/:canvasId).
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
              <div className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold flex items-center gap-1.5 border border-cyan-100">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Shareable Link</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
