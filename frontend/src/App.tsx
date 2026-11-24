import { useState, useEffect } from 'react';
import './App.css';
import type {
  AppSettings,
  IllustrationCategory,
  IllustrationCreation,
  IllustrationStyle,
  ImageDimension,
  NavigationPage,
  PromptTemplate,
} from './types';
import { INITIAL_CREATIONS } from './data/sampleCreations';
import { PROMPT_TEMPLATES } from './data/templates';
import { StorageService } from './services/storageService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Generate } from './pages/Generate';
import { Creations } from './pages/Creations';
import { Templates } from './pages/Templates';
import { Settings } from './pages/Settings';
import { HelpDocs } from './pages/HelpDocs';

const STORAGE_KEY_SETTINGS = 'devillustrate_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  defaultMethod: 'api', // Cloudflare Workers AI by default
  defaultStyle: 'flat-vector',
  defaultDimensions: '1024x1024',
  defaultSteps: 4,
  defaultGuidance: 7.5,
  themePreference: 'studio-dark',
  enableSoundEffects: true,
  autoSaveToCreations: true,
};

function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load creations from IndexedDB (with fallback to INITIAL_CREATIONS)
  const [creations, setCreations] = useState<IllustrationCreation[]>(INITIAL_CREATIONS);

  // Load settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Active template state to prefill Generation workspace
  const [activeTemplatePreset, setActiveTemplatePreset] = useState<{
    prompt: string;
    category: IllustrationCategory;
    style: IllustrationStyle;
    dimensions: ImageDimension;
    steps: number;
    guidance: number;
  } | null>(null);

  // Initial load from IndexedDB
  useEffect(() => {
    StorageService.getAllCreations(INITIAL_CREATIONS).then((items) => {
      setCreations(items);
    });
  }, []);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const handleSaveCreation = async (newCreation: IllustrationCreation) => {
    setCreations((prev) => {
      const exists = prev.some((c) => c.id === newCreation.id);
      if (exists) return prev;
      return [newCreation, ...prev];
    });
    await StorageService.saveCreation(newCreation);
  };

  const handleDeleteCreation = async (id: string) => {
    setCreations((prev) => prev.filter((c) => c.id !== id));
    await StorageService.deleteCreation(id);
  };

  const handleClearAllCreations = async () => {
    setCreations([]);
    await StorageService.clearAllCreations();
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  };

  const handleUseTemplate = (template: PromptTemplate) => {
    setActiveTemplatePreset({
      prompt: template.prompt,
      category: template.category,
      style: template.style,
      dimensions: template.recommendedDimensions,
      steps: template.recommendedSteps,
      guidance: template.recommendedGuidance,
    });
    setCurrentPage('generate');
  };

  const savedIds = new Set(creations.map((c) => c.id));

  return (
    <div className={`app-container theme-${settings.themePreference}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        creationsCount={creations.length}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="page-content fade-in">
          {currentPage === 'dashboard' && (
            <Dashboard
              creations={creations}
              templates={PROMPT_TEMPLATES}
              onNavigate={setCurrentPage}
              onUseTemplate={handleUseTemplate}
              onDeleteCreation={handleDeleteCreation}
              onPreviewCreation={() => setCurrentPage('creations')}
            />
          )}

          {currentPage === 'generate' && (
            <Generate
              key={activeTemplatePreset ? activeTemplatePreset.prompt : 'default-gen'}
              initialPrompt={activeTemplatePreset?.prompt}
              initialCategory={activeTemplatePreset?.category || 'software-architecture'}
              initialStyle={activeTemplatePreset?.style || settings.defaultStyle}
              initialSettings={{
                method: settings.defaultMethod,
                dimensions: activeTemplatePreset?.dimensions || settings.defaultDimensions,
                inferenceSteps: activeTemplatePreset?.steps || settings.defaultSteps,
                guidanceScale: activeTemplatePreset?.guidance || settings.defaultGuidance,
              }}
              onSaveCreation={handleSaveCreation}
              savedCreationIds={savedIds}
            />
          )}

          {currentPage === 'creations' && (
            <Creations
              creations={creations}
              onDeleteCreation={handleDeleteCreation}
              onClearAll={handleClearAllCreations}
              onNavigateToGenerate={() => setCurrentPage('generate')}
            />
          )}

          {currentPage === 'templates' && (
            <Templates
              templates={PROMPT_TEMPLATES}
              onUseTemplate={handleUseTemplate}
            />
          )}

          {currentPage === 'settings' && (
            <Settings
              settings={settings}
              onUpdateSettings={(updated) => setSettings((s) => ({ ...s, ...updated }))}
              onClearHistory={handleClearAllCreations}
              onResetDefaults={handleResetSettings}
            />
          )}

          {currentPage === 'help' && <HelpDocs />}
        </main>
      </div>
    </div>
  );
}

export default App;
