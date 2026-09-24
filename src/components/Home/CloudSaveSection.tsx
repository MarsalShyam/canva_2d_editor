import { motion } from 'framer-motion';
import { Cloud, Check, Link, Globe } from 'lucide-react';

export function CloudSaveSection() {
  return (
    <section id="cloud-save" className="py-20 sm:py-28 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="max-w-xl relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Persistence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Your canvas stays with you.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Save your work to Firebase Firestore with one click. Every canvas receives its own unique shareable URL so you can resume editing anytime.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Instant Firestore synchronization</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Unique shareable URL</span>
              </div>
            </div>
          </div>

          {/* Right Visual Workflow Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-6 relative z-10 shadow-2xl"
          >
            <div className="space-y-4">
              {/* Step 1: Canvas ID URL */}
              <div className="bg-black/30 rounded-xl p-3.5 flex items-center gap-3 border border-white/10 text-xs">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-mono text-slate-300 truncate">
                  chulldraw.vercel.app/canvas/<span className="text-indigo-400 font-bold">a8f7d91c23</span>
                </span>
              </div>

              {/* Step 2: Save Status */}
              <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Serialized Vector State Saved</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Firestore ✓</span>
              </div>

              {/* Step 3: Fast Reload */}
              <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
                <span>Refresh anytime without losing objects</span>
                <Link className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
