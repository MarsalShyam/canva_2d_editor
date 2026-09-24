import { motion } from 'framer-motion';
import { Plus, Palette, Cloud, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Start with a blank canvas',
      desc: 'Click "Create a design" to instantly generate a clean 1200 × 700 drawing canvas with its own dedicated Firestore ID.',
      icon: Plus,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Draw, shape and customize',
      desc: 'Sketch with smooth freehand pen, drag and drop vector shapes, format text, and choose colors from the 20-color MS Paint palette.',
      icon: Palette,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      step: '03',
      title: 'Save and come back anytime',
      desc: 'Hit Save to write serialized vector state to Firestore. Reopen your canvas anytime by bookmarking or sharing your URL.',
      icon: Cloud,
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-12 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-100 w-full flex flex-col items-center">
      <div className="max-w-6xl mx-auto w-full">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-4">
            From blank canvas to finished idea
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A frictionless 3-step creative process designed to keep you in the flow.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative bg-slate-50/70 rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between min-h-[280px]"
              >
                {/* Step badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-300 font-mono tracking-tighter">
                      {item.step}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom step progression indicator */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                  <span>Step {idx + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
