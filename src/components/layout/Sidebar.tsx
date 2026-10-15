import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  MapPin,
  AlertTriangle,
  Lightbulb,
  Award,
  FileText,
  Settings,
  Leaf,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, alerts, resetToDefaults } = useApp();

  const activeAlertCount = alerts.filter((a) => a.status !== 'resolved').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Campus Overview & KPIs',
    },
    {
      id: 'analytics',
      label: 'Resource Analytics',
      icon: BarChart3,
      badge: 'Electricity • Water • Paper',
      description: 'Diurnal Trends & Carbon Offset',
    },
    {
      id: 'facility-map',
      label: 'Facility Mapping',
      icon: MapPin,
      badge: 'Interactive SVG',
      description: 'Room & Floor Heatmaps',
    },
    {
      id: 'alerts',
      label: 'Waste Detection',
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? `${activeAlertCount} Active` : null,
      badgeColor: 'bg-rose-500 text-white',
      description: 'Anomaly Thresholds & Rules',
    },
    {
      id: 'recommendations',
      label: 'Smart Recommendations',
      icon: Lightbulb,
      badge: 'Savings Engine',
      description: 'Efficiency & Action Plans',
    },
    {
      id: 'green-score',
      label: 'Green Score',
      icon: Award,
      badge: '0-100 Rating',
      description: 'Department Leaderboard',
    },
    {
      id: 'reports',
      label: 'Sustainability Reports',
      icon: FileText,
      badge: 'PDF / CSV',
      description: 'Audits & Compliance Export',
    },
    {
      id: 'settings',
      label: 'Settings & Data',
      icon: Settings,
      badge: null,
      description: 'Rates, Thresholds & Readings',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:static ${
          isOpen ? 'w-64' : 'w-20'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-700/20">
              <Leaf className="h-5 w-5" />
            </div>
            {isOpen && (
              <div className="flex flex-col truncate">
                <span className="font-bold tracking-tight text-slate-900 text-base">
                  GreenPulse
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">
                  Resource & Energy Audit
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                title={!isOpen ? item.label : undefined}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'
                  }`}
                />

                {isOpen && (
                  <div className="flex flex-1 items-center justify-between truncate text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Status Card */}
        {isOpen && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Leaf className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="text-xs font-semibold">Hackathon MVP</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-950/80 leading-relaxed">
                Version 1.0 (PRD SD-02). Complete resource audit, anomaly triggers & PDF reports.
              </p>
              <div className="mt-2.5 flex items-center justify-between">
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                  title="Reset demo data to PRD baseline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset PRD Data
                </button>
                <span className="text-[10px] font-medium text-slate-400">Ver 1.0</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
