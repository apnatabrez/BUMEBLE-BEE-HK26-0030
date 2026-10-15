import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUpRight,
  Wrench,
  Search,
  Activity,
  Flame,
  Check,
  Zap,
  Droplets,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AlertSeverity, ResourceType } from '../../types';

export const WasteDetection: React.FC = () => {
  const {
    alerts,
    resolveAlert,
    acknowledgeAlert,
    simulateAnomaly,
    settings,
  } = useApp();

  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedResource !== 'all' && alert.resourceType !== selectedResource) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.roomName.toLowerCase().includes(q) ||
        alert.department.toLowerCase().includes(q) ||
        alert.suggestedAction.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = alerts.filter((a) => a.status !== 'resolved').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length;
  const totalDailyWasteLoss = alerts
    .filter((a) => a.status !== 'resolved')
    .reduce((sum, curr) => sum + curr.estimatedCostLoss, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Waste Detection &amp; Anomaly Engine
            </h1>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
              FR-03 Rule-Based
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time baseline deviation analysis. Automatically flags room-level usage exceeding configurable thresholds.
          </p>
        </div>

        {/* Live Anomaly Trigger Simulation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateAnomaly('electricity')}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
          >
            <Activity className="h-4 w-4 text-amber-600 animate-pulse" />
            <span>Simulate Energy Surge</span>
          </button>

          <button
            onClick={() => simulateAnomaly('water')}
            className="flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-900 hover:bg-sky-100 transition-colors shadow-xs"
          >
            <Droplets className="h-4 w-4 text-sky-600 animate-pulse" />
            <span>Simulate Water Leak</span>
          </button>
        </div>
      </div>

      {/* Threshold Status Rules Banner (FR-03) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Normal Status
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 mt-2">Within Baseline</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Consumption within ±{settings.thresholds.warningPercentage}% of historical average.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Warning Rule
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 mt-2">
            {settings.thresholds.warningPercentage}% – {settings.thresholds.criticalPercentage - 1}% Above
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Triggers proactive inspection recommendation &amp; facility review.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Critical Rule
            </span>
            <Flame className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 mt-2">
            &ge; {settings.thresholds.criticalPercentage}% Above Baseline
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Urgent waste hotspot! Immediate maintenance dispatch recommended.
          </p>
        </div>
      </div>

      {/* KPI Stats strip */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Anomalies</span>
            <p className="text-xl font-bold text-slate-900">{activeCount}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-xs text-slate-500 font-medium">Critical Emergencies</span>
            <p className="text-xl font-bold text-rose-600">{criticalCount}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-xs text-slate-500 font-medium">Est. Financial Waste</span>
            <p className="text-xl font-bold text-amber-700">₹{Math.round(totalDailyWasteLoss).toLocaleString()} / day</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 italic">
          *Flags indicate potential waste patterns, not confirmed equipment faults.
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search room, department, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setSelectedSeverity('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedSeverity === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedSeverity('critical')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedSeverity === 'critical' ? 'bg-white font-bold text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedSeverity('warning')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedSeverity === 'warning' ? 'bg-white font-bold text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Warning
            </button>
          </div>

          {/* Resource filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setSelectedResource('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedResource === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setSelectedResource('electricity')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedResource === 'electricity' ? 'bg-white font-bold text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ⚡ Electricity
            </button>
            <button
              onClick={() => setSelectedResource('water')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedResource === 'water' ? 'bg-white font-bold text-sky-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              💧 Water
            </button>
            <button
              onClick={() => setSelectedResource('paper')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedResource === 'paper' ? 'bg-white font-bold text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              📄 Paper
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Anomalies</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All monitored facilities are currently operating within historical baseline tolerances.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = alert.status === 'resolved';
            const isInvestigating = alert.status === 'investigating';

            return (
              <div
                key={alert.id}
                className={`rounded-2xl border p-5 transition-all shadow-xs ${
                  isResolved
                    ? 'border-slate-200 bg-slate-50/60 opacity-70'
                    : alert.severity === 'critical'
                    ? 'border-rose-200 bg-white hover:border-rose-400'
                    : 'border-amber-200 bg-white hover:border-amber-400'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {alert.id}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                        {alert.resourceType}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInvestigating
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        ● {alert.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {alert.roomName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {alert.buildingName} &bull; {alert.department} &bull; Detected:{' '}
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {/* Percentage Increase Badge */}
                  <div className="flex flex-col items-end">
                    <div
                      className={`flex items-center gap-1 rounded-xl px-3 py-1 font-bold text-sm ${
                        alert.severity === 'critical'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-amber-500 text-white shadow-xs'
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      <span>+{alert.percentageIncrease}% Spike</span>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-700 mt-1">
                      ₹{alert.estimatedCostLoss}/day waste cost
                    </span>
                  </div>
                </div>

                {/* Telemetry Comparison Strip */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Historical Baseline</span>
                    <span className="font-bold text-slate-700 text-sm">
                      {alert.baseline} {alert.resourceType === 'electricity' ? 'kWh' : alert.resourceType === 'water' ? 'L' : 'sh'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Observed Telemetry</span>
                    <span className="font-bold text-rose-600 text-sm">
                      {alert.observedUsage} {alert.resourceType === 'electricity' ? 'kWh' : alert.resourceType === 'water' ? 'L' : 'sh'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Excess Quantity</span>
                    <span className="font-bold text-amber-700 text-sm">
                      +{(alert.observedUsage - alert.baseline).toFixed(1)} {alert.resourceType === 'electricity' ? 'kWh' : alert.resourceType === 'water' ? 'L' : 'sh'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Anomaly Status</span>
                    <span className="font-semibold text-slate-700 capitalize">
                      {isResolved ? 'Resolved' : isInvestigating ? 'In Progress' : 'Unaddressed'}
                    </span>
                  </div>
                </div>

                {/* Suggested Action & Resolution controls */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-3">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-600">Recommended Corrective Action:</span>
                    <p className="text-xs text-slate-800 font-medium mt-0.5">
                      {alert.suggestedAction}
                    </p>
                  </div>

                  {!isResolved && (
                    <div className="flex items-center gap-2">
                      {!isInvestigating && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>Investigate</span>
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
