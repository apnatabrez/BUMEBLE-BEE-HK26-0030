import React, { useState } from 'react';
import {
  Lightbulb,
  IndianRupee,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Calculator,
  Zap,
  Droplets,
  FileSpreadsheet,
  Cpu,
  Wind,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Recommendation } from '../../types';

export const SmartRecommendations: React.FC = () => {
  const {
    recommendations,
    toggleRecommendation,
    settings,
    showToast,
    setActiveTab,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredRecs = recommendations.filter((r) => {
    if (categoryFilter === 'all') return true;
    return r.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  const totalMonthlySavings = recommendations
    .filter((r) => !r.isImplemented)
    .reduce((sum, r) => sum + r.monthlySavingsINR, 0);

  const realizedSavings = recommendations
    .filter((r) => r.isImplemented)
    .reduce((sum, r) => sum + r.monthlySavingsINR, 0);

  const handleToggle = (rec: Recommendation) => {
    toggleRecommendation(rec.id);
    if (!rec.isImplemented) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      showToast(`🎉 "${rec.suggestedAction}" marked as Implemented! Savings activated.`);
    } else {
      showToast(`Recommendation "${rec.suggestedAction}" reopened.`);
    }
  };

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'Lighting':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      case 'HVAC':
        return <Wind className="h-5 w-5 text-cyan-500" />;
      case 'Water':
        return <Droplets className="h-5 w-5 text-sky-500" />;
      case 'Paper':
        return <FileSpreadsheet className="h-5 w-5 text-indigo-500" />;
      case 'Equipment / IT':
        return <Cpu className="h-5 w-5 text-purple-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Smart Sustainability Recommendations
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              FR-05 Cost Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Data-driven energy &amp; resource efficiency opportunities with dynamic financial savings estimation.
          </p>
        </div>

        {/* Total Projected Savings Banner */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 shadow-xs">
          <div className="rounded-xl bg-emerald-700 p-2.5 text-white shadow-xs">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Total Potential Savings (Est.)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-emerald-900">₹</span>
              <span className="text-2xl font-black text-emerald-950">
                {totalMonthlySavings.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">/ month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Formula Callout Box (FR-05) */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
        <div className="flex items-start gap-3">
          <Calculator className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <p className="font-bold text-slate-900">
              Auditable Formula: Configurable Utility Rates in Action
            </p>
            <p className="text-slate-600 leading-relaxed">
              Example formula from PRD FR-05: <em>8 excess kWh/day &times; INR {settings.utilityRates.electricityPerKwh}/kWh = INR {(8 * settings.utilityRates.electricityPerKwh).toFixed(2)}/day, or INR {(8 * settings.utilityRates.electricityPerKwh * 30).toLocaleString()} over 30 days</em>.
              Current rates: Electricity <strong>₹{settings.utilityRates.electricityPerKwh}/kWh</strong> &bull; Water <strong>₹{settings.utilityRates.waterPerLitre * 1000}/kL</strong> &bull; Paper <strong>₹{settings.utilityRates.paperPerSheet}/sheet</strong>.
            </p>
            <p className="text-[11px] font-semibold text-emerald-800 pt-0.5">
              ⚠️ Note: All financial savings must be labelled estimates, not guaranteed outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Realized vs Potential Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Available Actions
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {recommendations.filter((r) => !r.isImplemented).length}
            </span>
            <span className="text-xs text-slate-500">pending initiatives</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Implemented Actions
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">
              {recommendations.filter((r) => r.isImplemented).length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">initiatives live</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Realized Monthly Value
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-400">₹</span>
            <span className="text-2xl font-bold text-emerald-700">
              {realizedSavings.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/ mo</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'lighting', 'hvac', 'water', 'paper', 'equipment'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-xl px-3.5 py-2 font-semibold capitalize whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All 5 Categories' : cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredRecs.map((rec) => {
          return (
            <div
              key={rec.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                rec.isImplemented
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header with Category & Difficulty */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-slate-100 p-2">
                      {getCategoryIcon(rec.category)}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-700">{rec.category}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                          {rec.implementationDifficulty}
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                          {rec.impactLevel} Impact
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-400">
                    {rec.id}
                  </span>
                </div>

                {/* Problem Statement */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-400">Identified Resource Waste:</p>
                  <p className="font-semibold text-sm text-slate-800 mt-0.5">
                    {rec.potentialIssue}
                  </p>
                </div>

                {/* Actionable Solution */}
                <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    Recommended Action:
                  </span>
                  <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed">
                    {rec.suggestedAction}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Affected zones: <strong>{rec.affectedRoomsSummary}</strong>
                  </p>
                </div>

                {/* Savings Calculation Breakdown (FR-05) */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800">
                      Excess Usage Identified
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      {rec.excessPerDay} {rec.unit} / day
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Rate: ₹{rec.ratePerUnit}/{rec.unit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">
                      Estimated Monthly Savings
                    </span>
                    <p className="text-base font-black text-emerald-900">
                      ₹{rec.monthlySavingsINR.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      ₹{rec.dailySavingsINR.toFixed(2)} / day est.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400 italic">
                  *Labelled estimate
                </span>

                <button
                  onClick={() => handleToggle(rec)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
                    rec.isImplemented
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                      : 'bg-emerald-700 text-white hover:bg-emerald-800'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {rec.isImplemented ? 'Implemented (Click to Reopen)' : 'Mark as Implemented'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
