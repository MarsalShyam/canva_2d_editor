import { CheckCircle2 } from 'lucide-react';

export function TrustStrip() {
  const items = [
    'Draw freely',
    'Add vector shapes',
    'Edit typography',
    'Customize colors',
    'Save to Firestore cloud',
    'Unique shareable URLs',
  ];

  return (
    <div className="w-full bg-white border-y border-slate-200/80 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:f
      lex-row items-center justify-between gap-5 text-center md:text-left">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Everything you need to turn an idea into a visual.
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Designed for sketches, posters, flyers, diagrams, and digital creations.
          </p>
        </div>

        {/* Feature Check Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {items.map((item) => (
            <div
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
