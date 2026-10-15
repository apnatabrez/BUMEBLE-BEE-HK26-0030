import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { FacilityMap } from './components/map/FacilityMap';
import { WasteDetection } from './components/alerts/WasteDetection';
import { SmartRecommendations } from './components/recommendations/SmartRecommendations';
import { GreenScoreLeaderboard } from './components/greenscore/GreenScoreLeaderboard';
import { ResourceAnalytics } from './components/analytics/ResourceAnalytics';
import { SustainabilityReports } from './components/reports/SustainabilityReports';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        {/* Top Navbar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <OverviewDashboard />}
          {activeTab === 'analytics' && <ResourceAnalytics />}
          {activeTab === 'facility-map' && <FacilityMap />}
          {activeTab === 'alerts' && <WasteDetection />}
          {activeTab === 'recommendations' && <SmartRecommendations />}
          {activeTab === 'green-score' && <GreenScoreLeaderboard />}
          {activeTab === 'reports' && <SustainabilityReports />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Portal Footer with PRD Attributions */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">GreenPulse</span>
              <span>&bull;</span>
              <span>Tagline: <em>Track Resources. Detect Waste. Build a Greener Future.</em></span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>PRD: SD-02 Ver 1.0 (Hackathon MVP)</span>
              <span>&bull;</span>
              <span>Apex Institute of Technology</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
