export type Role = 'admin' | 'facility_manager' | 'department_head';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleTitle: string;
  department?: string;
  avatar: string;
}

export type ResourceType = 'electricity' | 'water' | 'paper';

export type AlertSeverity = 'normal' | 'warning' | 'critical';

export type SourceType = 'manual' | 'mock_import' | 'live_iot';

export interface Room {
  id: string;
  code: string;
  name: string;
  buildingId: string;
  buildingName: string;
  departmentId: string;
  departmentName: string;
  floor: number;
  capacity: number;
  status: AlertSeverity;
  // Baseline vs Current (Daily average)
  electricityBaseline: number; // kWh
  electricityCurrent: number;  // kWh
  waterBaseline: number;       // Litres
  waterCurrent: number;        // Litres
  paperBaseline: number;       // Sheets
  paperCurrent: number;        // Sheets
  primaryIssue?: string;
  coordinates?: { x: number; y: number; width: number; height: number };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  greenScore: number;
  scoreBreakdown: {
    consumptionEfficiency: number; // /40
    anomalyResolution: number;     // /30
    conservationEfforts: number;   // /20
    historicalImprovement: number; // /10
  };
  totalElectricity: number; // kWh
  totalWater: number;       // Litres
  totalPaper: number;       // Sheets
  activeAlerts: number;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  totalRooms: number;
  floors: number;
}

export interface ResourceReading {
  id: string;
  roomId: string;
  roomName: string;
  departmentId: string;
  resourceType: ResourceType;
  consumptionValue: number;
  unit: string;
  recordedAt: string; // ISO date string
  sourceType: SourceType;
  createdAt: string;
}

export interface Alert {
  id: string;
  roomId: string;
  roomName: string;
  buildingName: string;
  department: string;
  resourceType: ResourceType;
  baseline: number;
  observedUsage: number;
  percentageIncrease: number;
  severity: 'warning' | 'critical';
  timestamp: string;
  suggestedAction: string;
  status: 'active' | 'investigating' | 'resolved';
  estimatedCostLoss: number; // in INR
}

export interface Recommendation {
  id: string;
  category: 'Lighting' | 'HVAC' | 'Water' | 'Paper' | 'Equipment / IT';
  potentialIssue: string;
  suggestedAction: string;
  affectedRoomIds: string[];
  affectedRoomsSummary: string;
  resourceType: ResourceType;
  excessPerDay: number;
  unit: string;
  ratePerUnit: number; // in INR
  dailySavingsINR: number;
  monthlySavingsINR: number; // 30 days
  impactLevel: 'High' | 'Medium' | 'Low';
  implementationDifficulty: 'Quick Win' | 'Medium Effort' | 'Capital Project';
  isImplemented: boolean;
}

export interface UtilityRates {
  electricityPerKwh: number; // INR
  waterPerLitre: number;     // INR (e.g. 0.045 per L = 45 per 1000L)
  paperPerSheet: number;     // INR (e.g. 0.8 per sheet)
}

export interface AnomalyThresholds {
  warningPercentage: number;  // Default: 20%
  criticalPercentage: number; // Default: 50%
}

export interface InstitutionSettings {
  name: string;
  campusName: string;
  currency: string;
  utilityRates: UtilityRates;
  thresholds: AnomalyThresholds;
}

export type DateRangeFilter = 'today' | '7days' | '30days' | 'month' | 'custom';
