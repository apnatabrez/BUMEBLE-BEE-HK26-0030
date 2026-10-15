import React, { useState } from 'react';
import {
  Building2,
  Layers,
  AlertCircle,
  CheckCircle,
  Zap,
  Droplets,
  FileSpreadsheet,
  X,
  Wrench,
  Activity,
  Sliders,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';

export const FacilityMap: React.FC = () => {
  const {
    rooms,
    updateRoom,
    alerts,
    resolveAlert,
    selectedRoomForInspection,
    setSelectedRoomForInspection,
    showToast,
  } = useApp();

  const [activeBuildingFilter, setActiveBuildingFilter] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  // Filter rooms
  const displayedRooms = rooms.filter((r) => {
    if (activeBuildingFilter === 'all') return true;
    return r.buildingId === activeBuildingFilter;
  });

  const inspectedRoom = selectedRoomForInspection || null;
  const roomAlerts = inspectedRoom
    ? alerts.filter((a) => a.roomId === inspectedRoom.id && a.status !== 'resolved')
    : [];

  const handleQuickResolve = (alertId: string) => {
    resolveAlert(alertId);
    if (inspectedRoom) {
      updateRoom(inspectedRoom.id, {
        status: 'normal',
        electricityCurrent: inspectedRoom.electricityBaseline,
        waterCurrent: inspectedRoom.waterBaseline,
        paperCurrent: inspectedRoom.paperBaseline,
      });
      showToast(`Corrective action recorded. ${inspectedRoom.name} restored to Normal status.`);
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'critical':
        return {
          fill: '#fee2e2', // red-100
          stroke: '#ef4444', // red-500
          text: '#991b1b',
          badge: 'bg-rose-100 text-rose-700 border-rose-300',
          dot: 'bg-rose-500',
        };
      case 'warning':
        return {
          fill: '#fef3c7', // amber-100
          stroke: '#f59e0b', // amber-500
          text: '#92400e',
          badge: 'bg-amber-100 text-amber-700 border-amber-300',
          dot: 'bg-amber-500',
        };
      default:
        return {
          fill: '#dcfce7', // emerald-100
          stroke: '#10b981', // emerald-500
          text: '#065f46',
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
          dot: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Interactive Facility Mapping
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              FR-04 Ready
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Predefined SVG architectural floor plan. Select any room to inspect telemetry and waste status.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-2.5 text-xs shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span className="font-medium text-slate-700">Normal (&lt;20%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
            <span className="font-medium text-slate-700">Warning (20-49%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500 ring-2 ring-rose-200 animate-pulse" />
            <span className="font-medium text-slate-700">Critical (&ge;50%)</span>
          </div>
        </div>
      </div>

      {/* Building & Floor Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveBuildingFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeBuildingFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Buildings (Masterplan)
          </button>
          <button
            onClick={() => setActiveBuildingFilter('b-1')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeBuildingFilter === 'b-1'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Block A (Turing Complex)
          </button>
          <button
            onClick={() => setActiveBuildingFilter('b-2')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeBuildingFilter === 'b-2'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wing B (Aryabhata)
          </button>
          <button
            onClick={() => setActiveBuildingFilter('b-3')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeBuildingFilter === 'b-3'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Block C (Admin & Library)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <Layers className="h-4 w-4 text-emerald-700" />
          <span>Floor View:</span>
          <button
            onClick={() => setSelectedFloor(1)}
            className={`h-7 w-7 rounded-md font-bold ${
              selectedFloor === 1 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setSelectedFloor(2)}
            className={`h-7 w-7 rounded-md font-bold ${
              selectedFloor === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            2
          </button>
        </div>
      </div>

      {/* Main Floor Plan & Room Detail Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* SVG Interactive Floor Plan (2 cols) */}
        <div className="relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-700" />
              <span className="font-semibold text-slate-800 text-sm">
                Campus Floor Plan (Floor {selectedFloor} Architecture)
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Click any room to open diagnostics
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="mt-4 relative w-full overflow-x-auto rounded-xl bg-slate-50/70 p-4 border border-slate-100">
            <svg
              viewBox="0 0 840 490"
              className="w-full h-auto min-w-[700px] select-none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.02))' }}
            >
              {/* Outer Campus Grid & Corridors */}
              <defs>
                <pattern id="campusGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="840" height="490" fill="url(#campusGrid)" rx="12" />

              {/* Corridor / Pathway Walkways */}
              <rect x="20" y="155" width="800" height="20" fill="#e2e8f0" rx="4" />
              <text x="420" y="169" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" letterSpacing="2">
                CENTRAL CONCOURSE &bull; NORTH WALKWAY
              </text>

              <rect x="20" y="305" width="800" height="20" fill="#e2e8f0" rx="4" />
              <text x="420" y="319" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" letterSpacing="2">
                ACADEMIC PLAZA &bull; SOUTH WALKWAY
              </text>

              {/* Building Sections labels */}
              <text x="30" y="28" fill="#64748b" fontSize="11" fontWeight="700">
                BLOCK A: COMPUTING & DATA LABS
              </text>
              <text x="30" y="176" fill="#64748b" fontSize="11" fontWeight="700">
                WING B: ENGINEERING & WORKSHOPS
              </text>
              <text x="30" y="326" fill="#64748b" fontSize="11" fontWeight="700">
                BLOCK C: ADMIN & CENTRAL LIBRARY
              </text>

              {/* Render Room SVG Nodes */}
              {displayedRooms.map((room) => {
                const coords = room.coordinates || { x: 30, y: 40, width: 140, height: 110 };
                const colors = getStatusColor(room.status);
                const isSelected = inspectedRoom?.id === room.id;
                const isHovered = hoveredRoom?.id === room.id;

                return (
                  <g
                    key={room.id}
                    onClick={() => setSelectedRoomForInspection(room)}
                    onMouseEnter={() => setHoveredRoom(room)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition-all duration-200"
                    style={{ transformOrigin: `${coords.x + coords.width / 2}px ${coords.y + coords.height / 2}px` }}
                  >
                    {/* Room Base Rectangle */}
                    <rect
                      x={coords.x}
                      y={coords.y}
                      width={coords.width}
                      height={coords.height}
                      rx="8"
                      fill={isSelected ? '#f0fdf4' : colors.fill}
                      stroke={isSelected ? '#059669' : colors.stroke}
                      strokeWidth={isSelected ? '3' : isHovered ? '2.5' : '1.5'}
                      strokeDasharray={room.status === 'critical' ? 'none' : 'none'}
                      className="transition-all"
                    />

                    {/* Non-colour Status Cue: Indicator badge in corner */}
                    <circle
                      cx={coords.x + coords.width - 14}
                      cy={coords.y + 14}
                      r="5"
                      fill={room.status === 'critical' ? '#ef4444' : room.status === 'warning' ? '#f59e0b' : '#10b981'}
                    />
                    {room.status === 'critical' && (
                      <circle
                        cx={coords.x + coords.width - 14}
                        cy={coords.y + 14}
                        r="9"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    )}

                    {/* Room Code */}
                    <text
                      x={coords.x + 10}
                      y={coords.y + 20}
                      fill="#0f172a"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {room.code}
                    </text>

                    {/* Room Name (multiline or truncated) */}
                    <text
                      x={coords.x + 10}
                      y={coords.y + 38}
                      fill="#334155"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {room.name.length > 18 ? room.name.slice(0, 16) + '...' : room.name}
                    </text>

                    {/* Resource metric chips */}
                    <text
                      x={coords.x + 10}
                      y={coords.y + 60}
                      fill="#475569"
                      fontSize="10"
                    >
                      ⚡ {room.electricityCurrent} kWh
                    </text>
                    <text
                      x={coords.x + 10}
                      y={coords.y + 76}
                      fill="#475569"
                      fontSize="10"
                    >
                      💧 {room.waterCurrent} L &bull; 📄 {room.paperCurrent} sh
                    </text>

                    {/* Status Pill on room bottom */}
                    <rect
                      x={coords.x + 8}
                      y={coords.y + coords.height - 24}
                      width={coords.width - 16}
                      height="16"
                      rx="4"
                      fill={room.status === 'critical' ? '#fee2e2' : room.status === 'warning' ? '#fef3c7' : '#dcfce7'}
                    />
                    <text
                      x={coords.x + coords.width / 2}
                      y={coords.y + coords.height - 12}
                      textAnchor="middle"
                      fill={colors.text}
                      fontSize="9"
                      fontWeight="bold"
                      letterSpacing="0.5"
                    >
                      {room.status.toUpperCase()} STATUS
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map bottom helper */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Floor Area: 42,000 sq ft &bull; 12 IoT Monitored Zones</span>
            <span className="font-medium text-emerald-800">
              {rooms.filter((r) => r.status === 'normal').length} Normal &bull;{' '}
              {rooms.filter((r) => r.status === 'warning').length} Warnings &bull;{' '}
              {rooms.filter((r) => r.status === 'critical').length} Critical
            </span>
          </div>
        </div>

        {/* Room Inspection Panel (FR-04 Acceptance: "Room click opens usage and alert details") */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          {inspectedRoom ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-800">
                      {inspectedRoom.code}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        getStatusColor(inspectedRoom.status).badge
                      }`}
                    >
                      {inspectedRoom.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mt-1">
                    {inspectedRoom.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {inspectedRoom.buildingName} &bull; {inspectedRoom.departmentName} &bull; Floor {inspectedRoom.floor}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRoomForInspection(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Resource Breakdown vs Baseline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Resource Telemetry vs Baseline
                </h4>

                {/* Electricity */}
                <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      Electricity
                    </span>
                    <span className="font-bold text-slate-900">
                      {inspectedRoom.electricityCurrent} kWh{' '}
                      <span className="text-slate-400 font-normal">/ {inspectedRoom.electricityBaseline} kWh</span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        inspectedRoom.electricityCurrent > inspectedRoom.electricityBaseline * 1.5
                          ? 'bg-rose-500'
                          : inspectedRoom.electricityCurrent > inspectedRoom.electricityBaseline * 1.2
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (inspectedRoom.electricityCurrent / (inspectedRoom.electricityBaseline * 1.6)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Baseline: {inspectedRoom.electricityBaseline} kWh</span>
                    <span
                      className={`font-semibold ${
                        inspectedRoom.electricityCurrent > inspectedRoom.electricityBaseline
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {inspectedRoom.electricityCurrent >= inspectedRoom.electricityBaseline
                        ? `+${Math.round(
                            ((inspectedRoom.electricityCurrent - inspectedRoom.electricityBaseline) /
                              inspectedRoom.electricityBaseline) *
                              100
                          )}%`
                        : `-${Math.round(
                            ((inspectedRoom.electricityBaseline - inspectedRoom.electricityCurrent) /
                              inspectedRoom.electricityBaseline) *
                              100
                          )}%`}
                    </span>
                  </div>
                </div>

                {/* Water */}
                <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Droplets className="h-3.5 w-3.5 text-sky-500" />
                      Water
                    </span>
                    <span className="font-bold text-slate-900">
                      {inspectedRoom.waterCurrent} L{' '}
                      <span className="text-slate-400 font-normal">/ {inspectedRoom.waterBaseline} L</span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        inspectedRoom.waterCurrent > inspectedRoom.waterBaseline * 1.5
                          ? 'bg-rose-500'
                          : inspectedRoom.waterCurrent > inspectedRoom.waterBaseline * 1.2
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (inspectedRoom.waterCurrent / (inspectedRoom.waterBaseline * 1.8)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Baseline: {inspectedRoom.waterBaseline} L</span>
                    <span
                      className={`font-semibold ${
                        inspectedRoom.waterCurrent > inspectedRoom.waterBaseline
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {inspectedRoom.waterCurrent >= inspectedRoom.waterBaseline
                        ? `+${Math.round(
                            ((inspectedRoom.waterCurrent - inspectedRoom.waterBaseline) /
                              inspectedRoom.waterBaseline) *
                              100
                          )}%`
                        : `-${Math.round(
                            ((inspectedRoom.waterBaseline - inspectedRoom.waterCurrent) /
                              inspectedRoom.waterBaseline) *
                              100
                          )}%`}
                    </span>
                  </div>
                </div>

                {/* Paper */}
                <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-500" />
                      Paper
                    </span>
                    <span className="font-bold text-slate-900">
                      {inspectedRoom.paperCurrent} Sheets{' '}
                      <span className="text-slate-400 font-normal">/ {inspectedRoom.paperBaseline}</span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        inspectedRoom.paperCurrent > inspectedRoom.paperBaseline * 1.5
                          ? 'bg-rose-500'
                          : inspectedRoom.paperCurrent > inspectedRoom.paperBaseline * 1.2
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (inspectedRoom.paperCurrent / (inspectedRoom.paperBaseline * 1.8)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Active Anomalies for this room */}
              {roomAlerts.length > 0 ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>Active Waste Flag</span>
                  </div>
                  {roomAlerts.map((alt) => (
                    <div key={alt.id} className="text-xs space-y-1">
                      <p className="font-semibold text-slate-800">{alt.suggestedAction}</p>
                      <p className="text-[11px] text-rose-700">
                        Observed {alt.observedUsage} vs baseline {alt.baseline} (+{alt.percentageIncrease}%)
                      </p>
                      <button
                        onClick={() => handleQuickResolve(alt.id)}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-xs"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        Resolve &amp; Restore Baseline
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No active anomaly alerts for this room. Baseline intact.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
              <Layers className="h-12 w-12 text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">Room Inspector</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Click any room on the SVG campus map or select from the list below to inspect live readings and anomaly status.
              </p>

              {/* Quick selector list */}
              <div className="mt-6 w-full space-y-1.5 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Select Room:
                </span>
                {rooms.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoomForInspection(r)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-100 p-2 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-800">{r.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{r.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
