import { motion } from 'framer-motion';
import { Plus, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface CTASectionProps {
  onCreateCanvas: () => void;
  isCreating: boolean;
}

export function CTASection({ onCreateCanvas, isCreating }: CTASectionProps) {
  return (
    <section className="relative isolate py-12 sm:py-16 bg-slate-950 text-white overflow-hidden px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
      {/* Dark Grid Background */}
      {/* <div className="absolute inset-0 z-0 bg-slate-950 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      </div> */}

      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-violet-400/20 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Content on top */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Ready to start drawing?
        </h2>

        <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Open a ChullDraw and turn your next idea into something visual. No setup or credit card required.
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
