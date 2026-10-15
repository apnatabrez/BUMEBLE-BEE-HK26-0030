import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  FileSpreadsheet,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Layers,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { DateRangeFilter } from '../../types';

export const OverviewDashboard: React.FC = () => {
  const {
    metrics,
    dateFilter,
    setDateFilter,
    dailyTrends,
    departments,
    alerts,
    recommendations,
    setActiveTab,
    setSelectedRoomForInspection,
    rooms,
  } = useApp();

  const [activeChartResource, setActiveChartResource] = useState<'all' | 'electricity' | 'water' | 'paper'>('all');
  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');

  // Filter trends based on date range
  const filteredTrends = React.useMemo(() => {
    if (dateFilter === 'today') return dailyTrends.slice(-7); // show last 7 days context
    if (dateFilter === '7days') return dailyTrends.slice(-7);
    if (dateFilter === '30days' || dateFilter === 'month') return dailyTrends;
    return dailyTrends.slice(-14);
  }, [dateFilter, dailyTrends]);

  const dateFilterLabels: { id: DateRangeFilter; label: string }[] = [
    { id: 'today', label: 'Today (Live)' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: 'month', label: 'This Month' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Date Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Resource Monitoring Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time telemetry, baseline comparisons, and anomaly detection across campus facilities.
          </p>
        </div>

        {/* Date Filter (FR-02: Changing the date range updates all corresponding cards and charts) */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Interval:</span>
          </div>
          {dateFilterLabels.map((f) => (
            <button
              key={f.id}
              onClick={() => setDateFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                dateFilter === f.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metric Cards (FR-02) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Electricity Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Electricity
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 border border-amber-100">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics.electricityKwh.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">kWh</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.electricityDelta}% vs baseline</span>
          </div>
        </div>

        {/* Water Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Water
            </span>
            <div className="rounded-xl bg-sky-50 p-2 text-sky-600 border border-sky-100">
              <Droplets className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics.waterLitres.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">Litres</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.waterDelta}% vs baseline</span>
          </div>
        </div>

        {/* Paper Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Paper Usage
            </span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 border border-indigo-100">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics.paperSheets.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">Sheets</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.paperDelta}% vs baseline</span>
          </div>
        </div>

        {/* Monthly Cost Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Est. Monthly Cost
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700 border border-emerald-100">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">₹</span>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {metrics.monthlyCostINR.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Configured utility rates</span>
          </div>
        </div>

        {/* Potential Savings Card */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Potential Savings
            </span>
            <div className="rounded-xl bg-emerald-700 p-2 text-white shadow-xs">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs font-bold text-emerald-800">₹</span>
            <span className="text-2xl font-bold tracking-tight text-emerald-900">
              {metrics.potentialSavingsINR.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>5 quick-win actions</span>
          </div>
        </div>

        {/* Active Alerts Card */}
        <div
          onClick={() => setActiveTab('alerts')}
          className="cursor-pointer rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs hover:bg-rose-50/70 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Active Alerts
            </span>
            <div className="rounded-xl bg-rose-600 p-2 text-white shadow-xs">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-rose-700">
              {metrics.activeAlertsCount}
            </span>
            <span className="text-xs font-medium text-rose-600">hotspots</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-medium text-rose-700">
            <span>Investigate spikes</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Resource Consumption Trends (2 Cols) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                Consumption Trends vs. Baseline
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Observed telemetry compared against historical campus benchmarks.
              </p>
            </div>

            {/* Metric Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveChartResource('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeChartResource === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cost (₹)
              </button>
              <button
                onClick={() => setActiveChartResource('electricity')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeChartResource === 'electricity'
                    ? 'bg-white text-amber-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Electricity
              </button>
              <button
                onClick={() => setActiveChartResource('water')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeChartResource === 'water'
                    ? 'bg-white text-sky-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Water
              </button>
              <button
                onClick={() => setActiveChartResource('paper')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeChartResource === 'paper'
                    ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paper
              </button>
            </div>
          </div>

          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartResource === 'all' ? (
                <AreaChart data={filteredTrends}>
                  <defs>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="costINR"
                    name="Total Utility Cost (INR)"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#costGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="wasteINR"
                    name="Avoidable Wastage Cost (INR)"
                    stroke="#e11d48"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#wasteGrad)"
                  />
                </AreaChart>
              ) : activeChartResource === 'electricity' ? (
                <AreaChart data={filteredTrends}>
                  <defs>
                    <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} unit=" kWh" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="electricity"
                    name="Observed Electricity (kWh)"
                    stroke="#d97706"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#elecGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="electricityBaseline"
                    name="Baseline Target (kWh)"
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              ) : activeChartResource === 'water' ? (
                <AreaChart data={filteredTrends}>
                  <defs>
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} unit=" L" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="water"
                    name="Observed Water (Litres)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#waterGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="waterBaseline"
                    name="Baseline Target (Litres)"
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              ) : (
                <BarChart data={filteredTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} unit=" sheets" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Bar
                    dataKey="paper"
                    name="Observed Paper (Sheets)"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="paperBaseline"
                    name="Baseline Target"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Resource Comparison (1 Col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-base">
                Department Comparison
              </h3>
              <button
                onClick={() => setActiveTab('green-score')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Leaderboard
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Resource footprint and Green Sustainability Scores across campus divisions.
            </p>

            <div className="mt-4 space-y-3">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-slate-800">{dept.name}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-mono">({dept.code})</span>
                    </div>
                    <span
                      className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                        dept.greenScore >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : dept.greenScore >= 75
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dept.greenScore} / 100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dept.greenScore >= 90
                          ? 'bg-emerald-600'
                          : dept.greenScore >= 75
                          ? 'bg-teal-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${dept.greenScore}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>⚡ {dept.totalElectricity} kWh</span>
                    <span>💧 {dept.totalWater} L</span>
                    <span>📄 {dept.totalPaper} sh</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between">
            <span>Average Green Index: <strong>79.25</strong></span>
            <span className="text-emerald-700 font-semibold">+4.5% this term</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Active Waste Alerts & Facility Hotspots */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Waste Alerts (FR-03 preview) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <h3 className="font-semibold text-slate-900 text-base">
                Active Waste Hotspots ({activeAlerts.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Full Anomaly Center <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {activeAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-rose-100 bg-rose-50/20 p-3 hover:bg-rose-50/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        alert.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{alert.roomName}</span>
                  </div>
                  <span className="text-xs font-bold text-rose-600">
                    +{alert.percentageIncrease}% above baseline
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-600 flex items-center gap-3">
                  <span>Resource: <strong>{alert.resourceType}</strong></span>
                  <span>Baseline: {alert.baseline}</span>
                  <span>Observed: {alert.observedUsage}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-rose-700 font-medium">₹{alert.estimatedCostLoss}/day waste</span>
                </div>

                <p className="mt-1.5 text-xs text-slate-500 italic">
                  Suggested Action: {alert.suggestedAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facility Map Preview & Room Inspection (FR-04 link) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-700" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Facility Spatial Status (12 Monitored Rooms)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('facility-map')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Interactive Floor Map <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Color coding status: <span className="font-semibold text-emerald-700">● Normal</span> &bull;{' '}
              <span className="font-semibold text-amber-600">● Warning (20-49%)</span> &bull;{' '}
              <span className="font-semibold text-rose-600">● Critical (50%+)</span>
            </p>

            {/* Quick Room Badges Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {rooms.slice(0, 6).map((room) => (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomForInspection(room);
                    setActiveTab('facility-map');
                  }}
                  className={`cursor-pointer rounded-xl border p-2.5 text-left transition-all ${
                    room.status === 'critical'
                      ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/60'
                      : room.status === 'warning'
                      ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/60'
                      : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{room.code}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        room.status === 'critical'
                          ? 'bg-rose-500 animate-ping'
                          : room.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="font-semibold text-xs text-slate-800 truncate mt-1">{room.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{room.status} status</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Full SVG floor map available with room click diagnostics</span>
            </span>
            <button
              onClick={() => setActiveTab('facility-map')}
              className="font-bold underline hover:text-emerald-950"
            >
              Open Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
