import { motion } from 'framer-motion';
import { Plus, ArrowDown, Sparkles, Loader2 } from 'lucide-react';
import { ProductPreview } from './ProductPreview';

interface HeroProps {
  onCreateCanvas: () => void;
  isCreating: boolean;
}

export function Hero({ onCreateCanvas, isCreating }: HeroProps) {
  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-7 pb-10 sm:pt-10 sm:pb-10 overflow-hidden">
      {/* Grid Pattern Background */}
      {/* <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" /> */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      {/* <div class="relative h-full w-full bg-white"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div></div> */}
      {/* Subtle radial ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Eyebrow Pill */}
        {/* <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase shadow-sm mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>The Simple 2D Creative Workspace</span>
        </motion.div> */}

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-5xl"
        >
          Turn ideas into <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            something you can draw.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal"
        >
          ChullDraw is a simple, powerful 2D canvas for sketching ideas, creating graphics, adding text, and bringing your imagination to life.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          <button
            id="hero-create-btn"
            onClick={onCreateCanvas}
            disabled={isCreating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            <span>{isCreating ? 'Opening Editor...' : 'Create a design'}</span>
          </button>

          <button
            onClick={scrollToFeatures}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold text-base border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all duration-200"
          >
            <span>Explore features</span>
            <ArrowDown className="w-4 h-4 text-slate-400" />
          </button>
        </motion.div>

        {/* Product Showcase Visual */}
        <ProductPreview />
      </div>
    </section>
  );
}
