import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { BentoShowcase } from './components/BentoShowcase';
import { LiveMicroDemo } from './components/LiveMicroDemo';
import { PricingGrid } from './components/PricingGrid';
import { StudioDashboard } from './components/StudioDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { ToolType, GenerationInput } from './types';
import { PRESET_TEMPLATES } from './data/presets';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>('landing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [brandName, setBrandName] = useState('AuraCommerce AI');
  const [serverHasKey, setServerHasKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [studioInput, setStudioInput] = useState<GenerationInput | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Check stored brand name and API key status on mount
  useEffect(() => {
    try {
      const storedBrand = localStorage.getItem('auracommerce_brand_name');
      if (storedBrand) setBrandName(storedBrand);

      const customKey = localStorage.getItem('auracommerce_gemini_key');
      if (customKey && customKey.trim().length > 0) {
        setHasApiKey(true);
      }
    } catch (e) {
      console.error('Failed reading localStorage:', e);
    }

    // Ping backend status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasEnvKey) {
          setServerHasKey(true);
          setHasApiKey(true);
        }
      })
      .catch((err) => {
        console.warn('Backend status check:', err);
      });
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const handleLaunchStudioWithTool = (tool: ToolType) => {
    const matched = PRESET_TEMPLATES.find((p) => p.input.toolType === tool) || PRESET_TEMPLATES[0];
    setStudioInput({
      ...matched.input,
      toolType: tool,
    });
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchStudioWithInput = (input: GenerationInput) => {
    setStudioInput(input);
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanSelection = (planName: string) => {
    showToast(`Access granted to ${planName}. Launching Studio...`, 'success');
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-neutral-100 flex flex-col font-sans selection:bg-[#D4AF37]/25 selection:text-[#FFFDF8]">
      {/* Top Bar Navigation */}
      <Navigation
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        brandName={brandName}
        hasApiKey={hasApiKey}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {viewMode === 'landing' ? (
          <div>
            <Hero
              onLaunchStudio={() => {
                setViewMode('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToDemo={() => {
                const el = document.getElementById('demo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <BentoShowcase onSelectTool={handleLaunchStudioWithTool} />

            <LiveMicroDemo
              onOpenInStudioWithInput={handleLaunchStudioWithInput}
              hasApiKey={hasApiKey}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            <PricingGrid onSelectPlan={handlePlanSelection} />

            <Footer
              onOpenSettings={() => setIsSettingsOpen(true)}
              onLaunchStudio={() => {
                setViewMode('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              brandName={brandName}
            />
          </div>
        ) : (
          <StudioDashboard
            initialInput={studioInput}
            hasApiKey={hasApiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
            showToast={showToast}
          />
        )}
      </main>

      {/* API Key & White-Label Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        brandName={brandName}
        setBrandName={setBrandName}
        onKeySaved={(key) => {
          setHasApiKey(Boolean(key || serverHasKey));
          showToast('Settings saved successfully', 'success');
        }}
        serverHasKey={serverHasKey}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
