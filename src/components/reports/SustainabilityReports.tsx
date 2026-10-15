import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Building,
  ShieldCheck,
  Zap,
  Droplets,
  IndianRupee,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useApp } from '../../context/AppContext';

export const SustainabilityReports: React.FC = () => {
  const {
    settings,
    metrics,
    departments,
    rooms,
    alerts,
    recommendations,
    dateFilter,
    setDateFilter,
    showToast,
  } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('October 2026');
  const [reportType, setReportType] = useState<'comprehensive' | 'energy' | 'water' | 'paper'>('comprehensive');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Generate and Download PDF Report (FR-07)
  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Emerald Header Banner
      doc.setFillColor(5, 150, 105); // emerald-600
      doc.rect(0, 0, pageWidth, 38, 'F');

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('GreenPulse Sustainability Audit Report', 14, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${settings.name} • ${settings.campusName}`, 14, 26);
      doc.text(`Period: ${selectedPeriod} | Generated: ${new Date().toLocaleDateString()}`, 14, 32);

      // Section 1: Executive Summary
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Executive Resource Summary', 14, 48);

      const summaryData = [
        ['Electricity Consumption', `${metrics.electricityKwh.toLocaleString()} kWh`, `+${metrics.electricityDelta}% vs baseline`],
        ['Water Consumption', `${metrics.waterLitres.toLocaleString()} Litres`, `+${metrics.waterDelta}% vs baseline`],
        ['Paper Usage', `${metrics.paperSheets.toLocaleString()} Sheets`, `+${metrics.paperDelta}% vs baseline`],
        ['Estimated Monthly Cost', `INR ${metrics.monthlyCostINR.toLocaleString()}`, 'Configured Utility Rates'],
        ['Potential Financial Savings', `INR ${metrics.potentialSavingsINR.toLocaleString()}`, 'Identified via 5 Action Plans'],
        ['Active Anomaly Hotspots', `${metrics.activeAlertsCount} Hotspots`, 'Exceeding Tolerance Thresholds'],
      ];

      autoTable(doc, {
        startY: 52,
        head: [['Metric / Pillar', 'Observed Value', 'Benchmark Status']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105] },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      // Section 2: Department Green Sustainability Scores
      let nextY = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Department Performance & Green Scores', 14, nextY);

      const deptData = departments.map((d) => [
        d.name,
        d.code,
        `${d.greenScore} / 100`,
        `${d.totalElectricity} kWh`,
        `${d.totalWater} L`,
        `${d.totalPaper} sheets`,
        `${d.activeAlerts} alerts`,
      ]);

      autoTable(doc, {
        startY: nextY + 4,
        head: [['Department', 'Code', 'Green Score', 'Electricity', 'Water', 'Paper', 'Alerts']],
        body: deptData,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 8.5, cellPadding: 2.5 },
      });

      // Section 3: Active Waste Anomalies
      nextY = (doc as any).lastAutoTable.finalY + 12;
      if (nextY > 230) {
        doc.addPage();
        nextY = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Detected Waste Hotspots & Anomaly Flags', 14, nextY);

      const alertData = alerts
        .filter((a) => a.status !== 'resolved')
        .map((a) => [
          a.id,
          a.roomName,
          a.resourceType.toUpperCase(),
          `${a.observedUsage} vs ${a.baseline}`,
          `+${a.percentageIncrease}%`,
          a.severity.toUpperCase(),
          a.suggestedAction,
        ]);

      autoTable(doc, {
        startY: nextY + 4,
        head: [['ID', 'Room', 'Resource', 'Observed vs Base', 'Deviation', 'Severity', 'Recommended Action']],
        body: alertData,
        theme: 'striped',
        headStyles: { fillColor: [225, 29, 72] }, // rose-600
        styles: { fontSize: 8, cellPadding: 2.5 },
      });

      // Section 4: Efficiency Recommendations & Savings
      nextY = (doc as any).lastAutoTable.finalY + 12;
      if (nextY > 230) {
        doc.addPage();
        nextY = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('4. Smart Efficiency Recommendations (Labelled Estimates)', 14, nextY);

      const recData = recommendations.map((r) => [
        r.category,
        r.suggestedAction,
        `${r.excessPerDay} ${r.unit}/day`,
        `INR ${r.dailySavingsINR.toFixed(2)}`,
        `INR ${r.monthlySavingsINR.toLocaleString()}`,
        r.isImplemented ? 'IMPLEMENTED' : 'PENDING',
      ]);

      autoTable(doc, {
        startY: nextY + 4,
        head: [['Category', 'Recommended Measure', 'Excess Usage', 'Daily Est.', 'Monthly Est. Savings', 'Status']],
        body: recData,
        theme: 'grid',
        headStyles: { fillColor: [4, 120, 87] },
        styles: { fontSize: 8, cellPadding: 2.5 },
      });

      // Signatures Footer
      const finalY = Math.min(270, (doc as any).lastAutoTable.finalY + 20);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text('Certified by GreenPulse Automated Energy Audit Engine | SD-02 Hackathon MVP Specification', 14, finalY);
      doc.text('Campus Sustainability Officer Signature: _______________________', 14, finalY + 8);

      // Save Document
      doc.save(`GreenPulse_Sustainability_Report_${selectedPeriod.replace(/\s+/g, '_')}.pdf`);
      showToast('📄 PDF Sustainability Report generated and downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF report.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate and Download CSV Export (FR-07)
  const handleDownloadCSV = () => {
    try {
      const headers = [
        'Room ID',
        'Room Code',
        'Room Name',
        'Building',
        'Department',
        'Status',
        'Electricity Baseline (kWh)',
        'Electricity Current (kWh)',
        'Water Baseline (L)',
        'Water Current (L)',
        'Paper Baseline (Sheets)',
        'Paper Current (Sheets)',
        'Primary Anomaly',
      ];

      const rows = rooms.map((r) => [
        r.id,
        r.code,
        `"${r.name}"`,
        `"${r.buildingName}"`,
        `"${r.departmentName}"`,
        r.status,
        r.electricityBaseline,
        r.electricityCurrent,
        r.waterBaseline,
        r.waterCurrent,
        r.paperBaseline,
        r.paperCurrent,
        `"${r.primaryIssue || 'None'}"`,
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `GreenPulse_Telemetry_Export_${selectedPeriod.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('📊 CSV Telemetry dataset exported and downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error exporting CSV.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sustainability Audit Reports
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              FR-07 PDF &amp; CSV
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Generate formal compliance audits, board presentations, and raw telemetry spreadsheets.
          </p>
        </div>

        {/* Quick Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
            <span>Export CSV Dataset</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isGenerating ? 'Compiling PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Configuration Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reporting Period (FR-07)
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="October 2026">October 2026 (Current Month)</option>
            <option value="Q3 2026 (July - September)">Q3 2026 (July - September)</option>
            <option value="Q2 2026 (April - June)">Q2 2026 (April - June)</option>
            <option value="Academic Year 2025-2026">Academic Year 2025-2026</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Report Scope
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="comprehensive">Comprehensive Audit (Electricity, Water, Paper)</option>
            <option value="energy">Energy &amp; Electrical Focus</option>
            <option value="water">Water Conservation &amp; Leakage Audit</option>
            <option value="paper">Paperless Campus Transformation Audit</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Auditing Institution
          </label>
          <div className="mt-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
            {settings.name}
          </div>
        </div>
      </div>

      {/* Live Report Preview Frame */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base">
              Report Document Preview: {selectedPeriod}
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Ready for formal submission &amp; export
          </span>
        </div>

        {/* Paper simulation canvas */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                GreenPulse &bull; Sustainability Audit Document
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {settings.name}
              </h2>
              <p className="text-xs text-slate-500">{settings.campusName}</p>
            </div>
            <div className="mt-3 sm:mt-0 text-left sm:text-right text-xs text-slate-500">
              <p>Period: <strong>{selectedPeriod}</strong></p>
              <p>Status: <strong className="text-emerald-700">Validated Hackathon MVP</strong></p>
            </div>
          </div>

          {/* Key Metrics Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Key Executive Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[11px] text-slate-500">Electricity</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{metrics.electricityKwh.toLocaleString()} kWh</p>
                <span className="text-[10px] text-amber-600 font-semibold">+{metrics.electricityDelta}% vs base</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[11px] text-slate-500">Water</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{metrics.waterLitres.toLocaleString()} L</p>
                <span className="text-[10px] text-rose-600 font-semibold">+{metrics.waterDelta}% vs base</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[11px] text-slate-500">Paper</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{metrics.paperSheets.toLocaleString()} sh</p>
                <span className="text-[10px] text-amber-600 font-semibold">+{metrics.paperDelta}% vs base</span>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                <span className="text-[11px] text-emerald-800 font-bold">Potential Savings</span>
                <p className="font-bold text-emerald-950 text-sm mt-0.5">₹{metrics.potentialSavingsINR.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-700 font-semibold">5 actions active</span>
              </div>
            </div>
          </div>

          {/* Department Green Scores preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Department Sustainability Breakdown
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-500">
                  <tr>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Green Score</th>
                    <th className="p-2.5">Electricity</th>
                    <th className="p-2.5">Water</th>
                    <th className="p-2.5">Paper</th>
                    <th className="p-2.5">Active Alerts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.map((d) => (
                    <tr key={d.id}>
                      <td className="p-2.5 font-semibold text-slate-800">{d.name}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{d.greenScore} / 100</td>
                      <td className="p-2.5">{d.totalElectricity} kWh</td>
                      <td className="p-2.5">{d.totalWater} L</td>
                      <td className="p-2.5">{d.totalPaper} sheets</td>
                      <td className="p-2.5">
                        <span className="rounded bg-rose-50 px-1.5 py-0.5 font-bold text-rose-700">
                          {d.activeAlerts}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
