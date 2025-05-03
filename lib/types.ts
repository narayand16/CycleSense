export interface CycleDay {
  date: string; // ISO date string
  type: 'period' | 'fertile' | 'ovulation' | 'regular';
  notes?: string;
}

export interface MenstrualCycle {
  id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  duration: number; // in days
  symptoms?: string[];
  notes?: string;
}

export interface UserSettings {
  averageCycleLength: number; // default 28
  averagePeriodLength: number; // default 5
  lastUpdated: string; // ISO date string
}

export interface UserData {
  cycles: MenstrualCycle[];
  settings: UserSettings;
}

export interface DateStatus {
  date: Date;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isPredicted: boolean;
}