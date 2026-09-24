import { motion } from 'framer-motion';
import { Plus, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface CTASectionProps {
  onCreateCanvas: () => void;
  isCreating: boolean;
}

export function CTASection({ onCreateCanvas, isCreating }: CTASectionProps) {
  return (
    <section className="py-10 sm:py-15 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
      {/* Background Decorative Rings */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-violet-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span>Start in seconds</span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Ready to start drawing?
        </h2>

        <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Open a canvas and turn your next idea into something visual. No setup or credit card required.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="cta-create-btn"
            onClick={onCreateCanvas}
            disabled={isCreating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-950 font-bold text-base shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Creating Canvas...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-indigo-600 font-bold" />
                <span>Create a free canvas</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
