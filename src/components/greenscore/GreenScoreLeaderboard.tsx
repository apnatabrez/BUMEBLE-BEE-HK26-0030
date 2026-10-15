import React from 'react';
import {
  Award,
  Medal,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Zap,
  Droplets,
  FileSpreadsheet,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GreenScoreLeaderboard: React.FC = () => {
  const { departments } = useApp();

  // Sort departments by score descending
  const sortedDepartments = [...departments].sort((a, b) => b.greenScore - a.greenScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Green Sustainability Score
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              FR-06 Leaderboard
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Standardized 0-100 department index based on consumption efficiency, anomaly frequency, and conservation actions.
          </p>
        </div>

        {/* Average Campus Rating */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-3 shadow-xs">
          <div className="rounded-xl bg-emerald-700 p-2.5 text-white">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Campus Average Green Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">79.3</span>
              <span className="text-xs text-emerald-700 font-bold">Grade A- (Sustainable)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Documented Audit Methodology & Weights (FR-06 Requirement) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Info className="h-4 w-4 text-emerald-700" />
          <h3 className="font-bold text-slate-800 text-sm">
            Green Score Formula &amp; Weight Documentation
          </h3>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          The GreenPulse Index evaluates each department on a 100-point composite rubric calculated weekly across four core operational pillars:
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700">1. Consumption Efficiency</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                40% Weight
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Deviation of observed kWh, Litres, and Paper from historical target baselines.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700">2. Anomaly Resolution</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                30% Weight
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Speed of resolution and severity suppression for warning/critical spikes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700">3. Conservation Actions</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                20% Weight
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Execution of smart recommendations, LED dimming, and device sleep modes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700">4. Continuous Progress</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                10% Weight
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Month-over-month reduction in per-capita resource waste.
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Cards */}
      <div className="space-y-4">
        {sortedDepartments.map((dept, index) => {
          const rank = index + 1;
          const isTop = rank === 1;

          return (
            <div
              key={dept.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all ${
                isTop
                  ? 'border-emerald-300 bg-gradient-to-r from-emerald-50/40 via-white to-white'
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Rank & Title */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-lg ${
                      rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-300/30 ring-4 ring-amber-100'
                        : rank === 2
                        ? 'bg-slate-200 text-slate-700 ring-4 ring-slate-100'
                        : rank === 3
                        ? 'bg-amber-700/20 text-amber-900 ring-4 ring-amber-50'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    #{rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">
                        {dept.name}
                      </h3>
                      <span className="font-mono text-xs font-bold text-slate-400">
                        ({dept.code})
                      </span>
                      {isTop && (
                        <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                          Campus Green Champion
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Department Chair: {dept.head} &bull; {dept.activeAlerts} active alerts
                    </p>
                  </div>
                </div>

                {/* Right: Score Display */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Sustainability Score
                    </span>
                    <span
                      className={`text-3xl font-black tracking-tight ${
                        dept.greenScore >= 90
                          ? 'text-emerald-700'
                          : dept.greenScore >= 75
                          ? 'text-teal-700'
                          : 'text-amber-600'
                      }`}
                    >
                      {dept.greenScore}{' '}
                      <span className="text-sm font-bold text-slate-400">/ 100</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & Breakdown Grid */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
                  <span>Score Breakdown Breakdown:</span>
                  <span className="font-semibold text-slate-800">
                    Efficiency: {dept.scoreBreakdown.consumptionEfficiency}/40 &bull; Resolution: {dept.scoreBreakdown.anomalyResolution}/30 &bull; Efforts: {dept.scoreBreakdown.conservationEfforts}/20 &bull; Trend: {dept.scoreBreakdown.historicalImprovement}/10
                  </span>
                </div>

                {/* Visual bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-600"
                    style={{ width: `${(dept.scoreBreakdown.consumptionEfficiency / 40) * 40}%` }}
                    title="Consumption Efficiency"
                  />
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: `${(dept.scoreBreakdown.anomalyResolution / 30) * 30}%` }}
                    title="Anomaly Resolution"
                  />
                  <div
                    className="h-full bg-sky-500"
                    style={{ width: `${(dept.scoreBreakdown.conservationEfforts / 20) * 20}%` }}
                    title="Conservation Efforts"
                  />
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${(dept.scoreBreakdown.historicalImprovement / 10) * 10}%` }}
                    title="Historical Improvement"
                  />
                </div>

                {/* Resource Totals */}
                <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <strong>{dept.totalElectricity}</strong> kWh electricity
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5 text-sky-500" />
                      <strong>{dept.totalWater}</strong> L water
                    </span>
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-500" />
                      <strong>{dept.totalPaper}</strong> sheets paper
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700">
                    Audited for Hackathon MVP SD-02
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
