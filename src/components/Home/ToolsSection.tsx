import { motion } from 'framer-motion';
import {
  Pencil,
  Square,
  Type,
  Palette,
  MousePointer2,
  Undo2,
  Command,
} from 'lucide-react';

export function ToolsSection() {
  const tools = [
    {
      icon: Pencil,
      title: 'Freehand Pen',
      desc: 'Sketch naturally with smooth freehand drawing and adjustable line thickness.',
      shortcut: 'P',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: Square,
      title: 'Vector Shapes',
      desc: 'Build ideas with rectangles, circles, triangles, stars, arrows, and lines.',
      shortcut: 'R / C / L',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Type,
      title: 'Editable Text',
      desc: 'Add editable text and typography formatted with fonts, weights, and alignments.',
      shortcut: 'T',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Palette,
      title: 'Color Palette',
      desc: 'Select primary stroke & secondary fill colors from standard 20-color palettes.',
      shortcut: 'Hex / Swatch',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: MousePointer2,
      title: 'Transformations',
      desc: 'Scale, rotate, reorder, flip, lock, and delete canvas objects with precision.',
      shortcut: 'V / Del',
      color: 'bg-rose-50 text-rose-600',
    },
    {
      icon: Undo2,
      title: 'Undo & Redo',
      desc: 'Track full canvas change history with instant keyboard shortcuts and buttons.',
      shortcut: 'Ctrl+Z / Ctrl+Y',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-slate-50/60 px-4 sm:px-6 lg:px-8 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
            Core Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
            Tools that stay out of your way
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Everything is accessible from the top ribbon and keyboard shortcuts.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tool.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-mono text-slate-600 border border-slate-200/80">
                      <Command className="w-3 h-3 text-slate-400" />
                      <span>{tool.shortcut}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
