import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  PlusCircle,
  RotateCcw,
  Sliders,
  DollarSign,
  Building,
  Activity,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResourceType, SourceType } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    rooms,
    addManualReading,
    resetToDefaults,
    showToast,
  } = useApp();

  // Institution settings state
  const [instName, setInstName] = useState(settings.name);
  const [campusName, setCampusName] = useState(settings.campusName);
  const [elecRate, setElecRate] = useState(settings.utilityRates.electricityPerKwh);
  const [waterRate, setWaterRate] = useState(settings.utilityRates.waterPerLitre);
  const [paperRate, setPaperRate] = useState(settings.utilityRates.paperPerSheet);
  const [warningThreshold, setWarningThreshold] = useState(settings.thresholds.warningPercentage);
  const [criticalThreshold, setCriticalThreshold] = useState(settings.thresholds.criticalPercentage);

  // Manual Reading Entry Form (FR-08)
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [resourceType, setResourceType] = useState<ResourceType>('electricity');
  const [consumptionValue, setConsumptionValue] = useState<number>(55);
  const [sourceType, setSourceType] = useState<SourceType>('manual');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name: instName,
      campusName: campusName,
      utilityRates: {
        electricityPerKwh: Number(elecRate),
        waterPerLitre: Number(waterRate),
        paperPerSheet: Number(paperRate),
      },
      thresholds: {
        warningPercentage: Number(warningThreshold),
        criticalPercentage: Number(criticalThreshold),
      },
    });
  };

  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoom = rooms.find((r) => r.id === selectedRoomId);
    if (!targetRoom) return;

    addManualReading({
      roomId: targetRoom.id,
      roomName: targetRoom.name,
      departmentId: targetRoom.departmentId,
      resourceType: resourceType,
      consumptionValue: Number(consumptionValue),
      unit: resourceType === 'electricity' ? 'kWh' : resourceType === 'water' ? 'Litres' : 'Sheets',
      recordedAt: new Date().toISOString(),
      sourceType: sourceType,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Settings &amp; Data Management
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              FR-08 Config
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure campus profile, utility tariffs, anomaly sensitivity thresholds, and ingest manual or IoT telemetry.
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <RotateCcw className="h-4 w-4 text-slate-500" />
          <span>Reset to PRD Seed Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form 1: Institution & Utility Rates */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <DollarSign className="h-5 w-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base">
              Institution Profile &amp; Utility Tariffs
            </h3>
          </div>

          <form onSubmit={handleSaveSettings} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block">
                Institution Name
              </label>
              <input
                type="text"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block">
                Campus Location
              </label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Utility Rates (Used for Cost &amp; Savings Calculations)
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Electricity (INR/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={elecRate}
                    onChange={(e) => setElecRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Water (INR/Litre)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={waterRate}
                    onChange={(e) => setWaterRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400">₹{waterRate * 1000}/kL</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Paper (INR/Sheet)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={paperRate}
                    onChange={(e) => setPaperRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Threshold Configuration (FR-03 & FR-08) */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Anomaly Detection Sensitivity Thresholds
              </h4>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-700">Warning Threshold:</span>
                  <span className="font-bold text-slate-800">{warningThreshold}% above baseline</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(Number(e.target.value))}
                  className="w-full accent-amber-500 mt-1 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-700">Critical Threshold:</span>
                  <span className="font-bold text-slate-800">{criticalThreshold}% above baseline</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="100"
                  value={criticalThreshold}
                  onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                  className="w-full accent-rose-500 mt-1 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Save Platform Configuration</span>
            </button>
          </form>
        </div>

        {/* Form 2: Ingest Readings & Manual Input (FR-08) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Database className="h-5 w-5 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-base">
                Manual Reading Ingestion (FR-08)
              </h3>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Submit meter readings manually or simulate IoT feeds. Breaching thresholds automatically flags active waste anomalies!
            </p>

            <form onSubmit={handleAddReading} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block">
                  Select Room Facility
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code}) &bull; Base Elec: {r.electricityBaseline} kWh
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">
                    Resource Type
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="electricity">⚡ Electricity</option>
                    <option value="water">💧 Water</option>
                    <option value="paper">📄 Paper</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">
                    Source Type (FR-08)
                  </label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="manual">Manual Auditor Entry</option>
                    <option value="mock_import">Mock Import File</option>
                    <option value="live_iot">Live IoT Sensor Feed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">
                  Consumption Value ({resourceType === 'electricity' ? 'kWh' : resourceType === 'water' ? 'Litres' : 'Sheets'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={consumptionValue}
                  onChange={(e) => setConsumptionValue(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="Enter observed telemetry value"
                  required
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200/60">
                <p className="font-semibold">💡 Try an Anomaly Spike:</p>
                <p className="mt-0.5 text-slate-600">
                  Entering a value &gt;50% over the room baseline triggers an automatic CRITICAL alert and paints the room RED on the facility map!
                </p>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                <span>Record Resource Reading</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Data Model: PostgreSQL / Prisma Schema Ready</span>
            <span className="font-semibold text-emerald-700">Audit Trail: Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
