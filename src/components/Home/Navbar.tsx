import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush,
  ChevronDown,
  Menu,
  X,
  Plus,
  Sparkles,
  Layers,
  Square,
  Type,
  Palette,
  Cloud,
  MousePointerClick,
  HelpCircle,
  Command,
  BookOpen,
  Lightbulb,
  Loader2,
} from 'lucide-react';

interface NavbarProps {
  onCreateCanvas: () => void;
  isCreating: boolean;
}

export function Navbar({ onCreateCanvas, isCreating }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<'design' | 'features' | 'resources' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Handle scroll shadow & background blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (key: 'design' | 'features' | 'resources') => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80'
        : 'bg-white/80 backdrop-blur-sm border-b border-slate-100'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Paintbrush className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Chull<span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Draw</span>
            </span>
          </a>

          {/* Center: Desktop Navigation items */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Design Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('design')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'design'
                  ? 'text-indigo-600 bg-indigo-50/70'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
              >
                <span>Design</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'design' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                    }`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'design' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50"
                  >
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        onCreateCanvas();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">Create a design</div>
                        <div className="text-xs text-slate-500">Blank 1200 × 700 standard canvas</div>
                      </div>
                    </button>

                    <div className="h-px bg-slate-100 my-1" />

                    {[
                      { icon: Layers, title: 'Social Post Canvas', desc: 'Square & story formats' },
                      { icon: Square, title: 'Poster & Flyer', desc: 'Marketing visuals' },
                      { icon: Sparkles, title: 'Freeform Sketch', desc: 'Pencil & shapes workspace' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          setActiveDropdown(null);
                          onCreateCanvas();
                        }}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('features')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'features'
                  ? 'text-indigo-600 bg-indigo-50/70'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                    }`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'features' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 grid grid-cols-2 gap-1"
                  >
                    {[
                      { icon: Square, title: 'Shapes & Vectors', desc: 'Rect, Circle, Triangle' },
                      { icon: Paintbrush, title: 'Smooth Pen', desc: 'Natural pencil drawing' },
                      { icon: Type, title: 'Typography', desc: 'Customizable fonts' },
                      { icon: Palette, title: 'Paint Palette', desc: '20-color preset grid' },
                      { icon: MousePointerClick, title: 'Transform', desc: 'Scale, rotate & flip' },
                      { icon: Cloud, title: 'Cloud Sync', desc: 'Auto Firestore save' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          setActiveDropdown(null);
                          const el = document.getElementById('features-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{item.title}</div>
                          <div className="text-[11px] text-slate-500">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('resources')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'resources'
                  ? 'text-indigo-600 bg-indigo-50/70'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                    }`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50"
                  >
                    {[
                      { icon: Lightbulb, title: 'Design Tips', desc: 'Creative guidelines' },
                      { icon: Command, title: 'Keyboard Shortcuts', desc: 'Fast editing hotkeys' },
                      { icon: BookOpen, title: 'Getting Started', desc: 'Canvas basics overview' },
                      { icon: HelpCircle, title: 'Documentation', desc: 'Features & persistence' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          setActiveDropdown(null);
                          const el = document.getElementById('how-it-works');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{item.title}</div>
                          <div className="text-[11px] text-slate-500">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">

          <button
            onClick={onCreateCanvas}
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 transition-all duration-200 disabled:opacity-60"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{isCreating ? 'Creating...' : 'Create a design'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onCreateCanvas}
            disabled={isCreating}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-medium text-xs shadow-sm flex items-center gap-1.5"
          >
            {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Create</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-3 shadow-xl"
          >
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onCreateCanvas();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{isCreating ? 'Creating Canvas...' : 'Create a design'}</span>
            </button>

            <div className="space-y-1 pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('features-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Features & Tools
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('cloud-save');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cloud Saving
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onCreateCanvas();
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Log In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
