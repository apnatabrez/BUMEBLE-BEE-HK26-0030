import React, { useState } from 'react';
import {
  Bell,
  Zap,
  Menu,
  Shield,
  UserCheck,
  ChevronDown,
  Activity,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    switchUser,
    users,
    alerts,
    simulateAnomaly,
    setActiveTab,
    toastMessage,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md transition-all sm:px-6">
      {/* Left: Mobile Toggle & Campus Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm shadow-emerald-700/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900 sm:text-lg">
                GreenPulse
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                SD-02 MVP
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 md:block">
              Apex Institute of Technology • Sustainability Audit Portal
            </p>
          </div>
        </div>
      </div>

      {/* Center: Live Status & Simulation Action */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>IoT Telemetry: Active</span>
        </div>

        <button
          onClick={() => simulateAnomaly('electricity')}
          title="Simulate a real-time spike in energy consumption to test anomaly detection"
          className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
        >
          <Activity className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
          <span>Simulate Waste Spike</span>
        </button>
      </div>

      {/* Right: Notifications & User Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Alerts / Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Alerts"
          >
            <Bell className="h-5 w-5" />
            {activeAlerts.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Modal */}
          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-800">Waste Anomalies & Alerts</h4>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                    {activeAlerts.length} Active
                  </span>
                </div>
                <button
                  onClick={() => setShowAlertsDropdown(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {activeAlerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-1" />
                    All resources operating within historical baselines.
                  </div>
                ) : (
                  activeAlerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setActiveTab('alerts');
                        setShowAlertsDropdown(false);
                      }}
                      className="cursor-pointer rounded-lg border border-slate-100 p-2.5 text-xs hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded ${
                            alert.severity === 'critical'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {alert.severity} • {alert.resourceType}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          +{alert.percentageIncrease}%
                        </span>
                      </div>
                      <p className="font-medium text-slate-800 mt-1 line-clamp-1">{alert.roomName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {alert.suggestedAction}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 pt-2 mt-2 text-center">
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setShowAlertsDropdown(false);
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  View All Anomalies & History
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher & User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-left text-xs hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div className="hidden sm:block text-left">
              <div className="font-semibold text-slate-800 flex items-center gap-1">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* User Switcher Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Select Demo Persona (FR-01)
                </p>
              </div>

              <div className="space-y-1">
                {users.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.role as Role);
                        setShowUserDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span>{user.name}</span>
                          {isSelected && <UserCheck className="h-3.5 w-3.5 text-emerald-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {user.roleTitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2 px-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                Role-based access control active
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
};
