import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { TrustStrip } from './TrustStrip';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorks } from './HowItWorks';
import { ToolsSection } from './ToolsSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import { CustomCursor } from './CustomCursor';

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

      <Navbar onCreateCanvas={handleCreateCanvas} isCreating={isCreating} />
      <Hero onCreateCanvas={handleCreateCanvas} isCreating={isCreating} />
      <TrustStrip />
      <FeaturesSection />
      <HowItWorks />
      <ToolsSection />
      <CTASection onCreateCanvas={handleCreateCanvas} isCreating={isCreating} />
      <Footer onCreateCanvas={handleCreateCanvas} />
      <CustomCursor />
    </div>
  );
}
