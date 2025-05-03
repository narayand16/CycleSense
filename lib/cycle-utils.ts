"use client";

import { addDays, subDays, differenceInDays, format, parse } from 'date-fns';
import { DateStatus, MenstrualCycle, UserSettings } from './types';
import { getUserData } from './storage';

// Calculate fertility window based on cycle data
export function calculateFertilityWindow(
  cycleStartDate: Date, 
  cycleLength: number
): { fertileStart: Date; fertileEnd: Date; ovulationDay: Date } {
  // Ovulation typically occurs around 14 days before the start of the next period
  const nextCycleStart = addDays(cycleStartDate, cycleLength);
  const ovulationDay = subDays(nextCycleStart, 14);
  
  // Fertile window is usually 5 days before ovulation until 1 day after
  const fertileStart = subDays(ovulationDay, 5);
  const fertileEnd = addDays(ovulationDay, 1);
  
  return { fertileStart, fertileEnd, ovulationDay };
}

// Predict the next period based on previous cycles
export function predictNextPeriod(
  cycles: MenstrualCycle[], 
  settings: UserSettings
): { predictedStart: Date; predictedEnd: Date } {
  if (cycles.length === 0) {
    return {
      predictedStart: new Date(),
      predictedEnd: addDays(new Date(), settings.averagePeriodLength)
    };
  }
  
  // Sort cycles by start date (newest first)
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  const lastCycle = sortedCycles[0];
  const lastCycleStart = new Date(lastCycle.startDate);
  
  // Calculate average cycle length from actual data if available
  let averageCycleLength = settings.averageCycleLength;
  if (sortedCycles.length >= 2) {
    let totalLength = 0;
    let count = 0;
    
    // Use up to last 6 cycles to calculate average
    const cyclesToUse = sortedCycles.slice(0, Math.min(6, sortedCycles.length));
    
    for (let i = 0; i < cyclesToUse.length - 1; i++) {
      const currentStart = new Date(cyclesToUse[i].startDate);
      const nextStart = new Date(cyclesToUse[i + 1].startDate);
      const length = differenceInDays(currentStart, nextStart);
      
      if (length > 0 && length < 50) { // Filter out potentially erroneous data
        totalLength += length;
        count++;
      }
    }
    
    if (count > 0) {
      averageCycleLength = Math.round(totalLength / count);
    }
  }
  
  const predictedStart = addDays(lastCycleStart, averageCycleLength);
  const predictedEnd = addDays(predictedStart, settings.averagePeriodLength - 1);
  
  return { predictedStart, predictedEnd };
}

// Get date status for calendar display
export function getDateStatus(date: Date): DateStatus {
  const { cycles, settings } = getUserData();
  const dateStr = format(date, 'yyyy-MM-dd');
  const today = new Date();
  
  // Initialize status object
  const status: DateStatus = {
    date,
    isPeriod: false,
    isFertile: false,
    isOvulation: false,
    isPredicted: false,
  };
  
  // Check if date is in a recorded period
  for (const cycle of cycles) {
    const cycleStart = new Date(cycle.startDate);
    const cycleEnd = new Date(cycle.endDate);
    
    if (date >= cycleStart && date <= cycleEnd) {
      status.isPeriod = true;
      return status; // Return early as we found a match
    }
    
    // Check if in fertility window of this cycle
    const { fertileStart, fertileEnd, ovulationDay } = calculateFertilityWindow(
      cycleStart, 
      settings.averageCycleLength
    );
    
    if (date >= fertileStart && date <= fertileEnd) {
      status.isFertile = true;
    }
    
    if (format(date, 'yyyy-MM-dd') === format(ovulationDay, 'yyyy-MM-dd')) {
      status.isOvulation = true;
    }
  }
  
  // Check if this is a predicted period or fertility window
  if (cycles.length > 0) {
    const { predictedStart, predictedEnd } = predictNextPeriod(cycles, settings);
    
    if (date >= predictedStart && date <= predictedEnd && date > today) {
      status.isPeriod = true;
      status.isPredicted = true;
    }
    
    // Also predict the fertility window for the next cycle
    const { fertileStart, fertileEnd, ovulationDay } = calculateFertilityWindow(
      predictedStart, 
      settings.averageCycleLength
    );
    
    if (date >= fertileStart && date <= fertileEnd && date > today) {
      status.isFertile = true;
      status.isPredicted = true;
    }
    
    if (
      format(date, 'yyyy-MM-dd') === format(ovulationDay, 'yyyy-MM-dd') && 
      date > today
    ) {
      status.isOvulation = true;
      status.isPredicted = true;
    }
  }
  
  return status;
}

// Calculate average cycle length
export function calculateAverageCycleLength(cycles: MenstrualCycle[]): number {
  if (cycles.length < 2) {
    return 28; // Default if not enough data
  }
  
  // Sort by start date, oldest first
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  let totalDays = 0;
  let validIntervals = 0;
  
  for (let i = 0; i < sortedCycles.length - 1; i++) {
    const currentStart = new Date(sortedCycles[i].startDate);
    const nextStart = new Date(sortedCycles[i + 1].startDate);
    const days = differenceInDays(nextStart, currentStart);
    
    // Only count realistic cycle lengths
    if (days >= 21 && days <= 45) {
      totalDays += days;
      validIntervals++;
    }
  }
  
  return validIntervals > 0 ? Math.round(totalDays / validIntervals) : 28;
}

// Generate cycle statistics
export function getCycleStatistics(cycles: MenstrualCycle[]) {
  if (cycles.length === 0) {
    return {
      averageCycleLength: 28,
      averagePeriodLength: 5,
      shortestCycle: 0,
      longestCycle: 0,
      cycleRegularity: "No data",
      totalTrackedCycles: 0
    };
  }
  
  // Sort by start date (oldest first)
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  // Calculate cycle lengths
  const cycleLengths: number[] = [];
  for (let i = 0; i < sortedCycles.length - 1; i++) {
    const currentStart = new Date(sortedCycles[i].startDate);
    const nextStart = new Date(sortedCycles[i + 1].startDate);
    const days = differenceInDays(nextStart, currentStart);
    
    if (days > 0 && days < 100) { // Filter out potentially incorrect data
      cycleLengths.push(days);
    }
  }
  
  // Calculate period lengths
  const periodLengths = sortedCycles.map(cycle => {
    const start = new Date(cycle.startDate);
    const end = new Date(cycle.endDate);
    return differenceInDays(end, start) + 1;
  }).filter(length => length > 0 && length < 15); // Filter out potentially incorrect data
  
  // Calculate statistics
  const avgCycleLength = cycleLengths.length > 0 
    ? cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length 
    : 28;
    
  const avgPeriodLength = periodLengths.length > 0 
    ? periodLengths.reduce((sum, len) => sum + len, 0) / periodLengths.length 
    : 5;
    
  const shortestCycle = cycleLengths.length > 0 
    ? Math.min(...cycleLengths) 
    : 0;
    
  const longestCycle = cycleLengths.length > 0 
    ? Math.max(...cycleLengths) 
    : 0;
  
  // Determine cycle regularity
  let cycleRegularity = "No data";
  if (cycleLengths.length >= 3) {
    const variance = calculateVariance(cycleLengths);
    if (variance < 2) {
      cycleRegularity = "Very regular";
    } else if (variance < 4) {
      cycleRegularity = "Regular";
    } else if (variance < 6) {
      cycleRegularity = "Slightly irregular";
    } else {
      cycleRegularity = "Irregular";
    }
  }
  
  return {
    averageCycleLength: Math.round(avgCycleLength),
    averagePeriodLength: Math.round(avgPeriodLength * 10) / 10,
    shortestCycle,
    longestCycle,
    cycleRegularity,
    totalTrackedCycles: cycles.length
  };
}

// Helper function to calculate variance
function calculateVariance(values: number[]): number {
  if (values.length <= 1) return 0;
  
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squareDiffs = values.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  
  return Math.sqrt(squareDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / values.length);
}