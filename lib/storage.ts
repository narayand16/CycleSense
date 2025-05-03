"use client";

import { MenstrualCycle, UserData, UserSettings } from "@/lib/types";

const STORAGE_KEY = "cyclesense_period_tracker_data";

const DEFAULT_SETTINGS: UserSettings = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastUpdated: new Date().toISOString(),
};

const DEFAULT_USER_DATA: UserData = {
  cycles: [],
  settings: DEFAULT_SETTINGS,
};

export function getUserData(): UserData {
  if (typeof window === "undefined") {
    return DEFAULT_USER_DATA;
  }

  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return DEFAULT_USER_DATA;
  }

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
    return DEFAULT_USER_DATA;
  }
}

export function saveUserData(userData: UserData): void {
  if (typeof window === "undefined") {
    return;
  }

  userData.settings.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

export function addCycle(cycle: MenstrualCycle): void {
  const userData = getUserData();
  userData.cycles.push(cycle);
  // Sort cycles by start date in descending order (newest first)
  userData.cycles.sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  saveUserData(userData);
}

export function updateCycle(updatedCycle: MenstrualCycle): void {
  const userData = getUserData();
  const index = userData.cycles.findIndex(cycle => cycle.id === updatedCycle.id);
  
  if (index !== -1) {
    userData.cycles[index] = updatedCycle;
    saveUserData(userData);
  }
}

export function deleteCycle(cycleId: string): void {
  const userData = getUserData();
  userData.cycles = userData.cycles.filter(cycle => cycle.id !== cycleId);
  saveUserData(userData);
}

export function updateSettings(settings: UserSettings): void {
  const userData = getUserData();
  userData.settings = settings;
  saveUserData(userData);
}

export function clearAllData(): void {
  if (typeof window === "undefined") {
    return;
  }
  
  localStorage.removeItem(STORAGE_KEY);
}