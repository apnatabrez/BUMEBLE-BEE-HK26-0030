import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  FileSpreadsheet,
  Trees,
  CloudRain,
  Flame,
  ArrowUpRight,
  Clock,
  Sparkles,
  BarChart2,
  TrendingDown,
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
import { HOURLY_ANALYTICS_DATA } from '../../data/mockData';

export const ResourceAnalytics: React.FC = () => {
  const { metrics, rooms } = useApp();
  const [selectedPillar, setSelectedPillar] = useState<'electricity' | 'water' | 'paper'>('electricity');

  // Eco-equivalents calculations
  const totalKwh = metrics.electricityKwh;
  const co2Kg = Math.round(totalKwh * 0.82); // 0.82 kg CO2 per kWh (India Grid benchmark)
  const treesRequired = Math.round(co2Kg / 21); // 1 mature tree absorbs ~21kg CO2/year

  const totalWater = metrics.waterLitres;
  const waterLeakLossL = 480; // from active leak in B-202

  const totalPaper = metrics.paperSheets;
  const paperTreesSaved = ((10000 - totalPaper) / 8333).toFixed(2); // ~8,333 sheets = 1 tree

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Resource Analytics Deep Dive
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              Diurnal Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            24-hour diurnal load curves, peak-hour consumption, and environmental impact conversions.
          </p>
        </div>

        {/* Pillar Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
          <button
            onClick={() => setSelectedPillar('electricity')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedPillar === 'electricity'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Electricity (kWh)</span>
          </button>
          <button
            onClick={() => setSelectedPillar('water')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedPillar === 'water'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Droplets className="h-4 w-4" />
            <span>Water (Litres)</span>
          </button>
          <button
            onClick={() => setSelectedPillar('paper')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedPillar === 'paper'
                ? 'bg-indigo-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Paper (Sheets)</span>
          </button>
        </div>
      </div>

      {/* Environmental Impact Equivalencies */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Carbon Footprint
            </span>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{co2Kg.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500">kg CO₂e</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Based on standard grid emission intensity (0.82 kg/kWh).
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Offset Tree Counter
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
              <Trees className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-700">{treesRequired}</span>
            <span className="text-xs font-bold text-slate-500">mature trees</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Annual tree absorption needed to neutralize current energy emissions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avoidable Resource Leakage
            </span>
            <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
              <CloudRain className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-rose-600">{waterLeakLossL}</span>
            <span className="text-xs font-bold text-slate-500">L / day waste</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Active plumbing leakage detected in Restroom Block B-202.
          </p>
        </div>
      </div>

      {/* 24-Hour Diurnal Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              24-Hour Diurnal Profile &amp; Peak Hour Detection
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly usage breakdown throughout the day. Highlights after-hours baseline idling.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Peak Demand Window: <strong>11:00 AM – 3:00 PM</strong></span>
          </div>
        </div>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {selectedPillar === 'electricity' ? (
              <AreaChart data={HOURLY_ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="elecDiurnal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit=" kWh" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="electricity"
                  name="Observed Hourly Power (kWh)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#elecDiurnal)"
                />
                <Area
                  type="monotone"
                  dataKey="baselineElec"
                  name="Scheduled Baseline (kWh)"
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            ) : selectedPillar === 'water' ? (
              <AreaChart data={HOURLY_ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="waterDiurnal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit=" L" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="water"
                  name="Hourly Water Draw (Litres)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#waterDiurnal)"
                />
              </AreaChart>
            ) : (
              <BarChart data={HOURLY_ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit=" sh" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Bar
                  dataKey="paper"
                  name="Hourly Print Queue (Sheets)"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Level Breakdown Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-3">
          Room-Level Consumption Audit
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/70 font-semibold uppercase text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Room</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Electricity (kWh)</th>
                <th className="py-2.5 px-3">Water (Litres)</th>
                <th className="py-2.5 px-3">Paper (Sheets)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {room.name} <span className="font-mono text-slate-400">({room.code})</span>
                  </td>
                  <td className="py-2.5 px-3">{room.departmentName}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800">{room.electricityCurrent}</span>
                    <span className="text-slate-400 ml-1">/ {room.electricityBaseline}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800">{room.waterCurrent}</span>
                    <span className="text-slate-400 ml-1">/ {room.waterBaseline}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800">{room.paperCurrent}</span>
                    <span className="text-slate-400 ml-1">/ {room.paperBaseline}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        room.status === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : room.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
