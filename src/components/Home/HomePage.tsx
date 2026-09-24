import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { TrustStrip } from './TrustStrip';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorks } from './HowItWorks';
import { ToolsSection } from './ToolsSection';
import { CloudSaveSection } from './CloudSaveSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

import { useFirestore } from '../../hooks/useFirestore';
import { showToast } from '../shared/Toast';

export function HomePage() {
  const navigate = useNavigate();
  const { createCanvas } = useFirestore();
  const [isCreating, setIsCreating] = useState(false);

  // Centralized canvas creation handler
  const handleCreateCanvas = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const canvasId = await createCanvas('Untitled - Paint');
      showToast('success', 'Canvas ready! Opening editor...');
      navigate(`/canvas/${canvasId}`);
    } catch {
      showToast('error', 'Failed to initialize canvas.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Sticky Navigation Bar with Dropdowns */}
      <Navbar onCreateCanvas={handleCreateCanvas} isCreating={isCreating} />

      {/* 2. Hero Section with Product Showcase Visual */}
      <Hero onCreateCanvas={handleCreateCanvas} isCreating={isCreating} />

      {/* 3. Credibility / Feature Strip */}
      <TrustStrip />

      {/* 4. Bento Grid Feature Suite */}
      <FeaturesSection />

      {/* 5. 3-Step Process (From Blank Canvas to Finished Idea) */}
      <HowItWorks />

      {/* 6. Core Tools Showcase & Shortcuts */}
      <ToolsSection />

      {/* 7. Firestore Cloud Sync & Persistence */}
      <CloudSaveSection />

      {/* 8. Bottom Call to Action */}
      <CTASection onCreateCanvas={handleCreateCanvas} isCreating={isCreating} />

      {/* 9. Comprehensive Multi-Column Footer */}
      <Footer onCreateCanvas={handleCreateCanvas} />
    </div>
  );
}
