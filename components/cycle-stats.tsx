"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/lib/storage";
import { getCycleStatistics } from "@/lib/cycle-utils";
import { BarChart3 } from "lucide-react";
import labels from '@/lib/labels.json';

export function CycleStats() {
  const [stats, setStats] = useState({
    averageCycleLength: 0,
    averagePeriodLength: 0,
    shortestCycle: 0,
    longestCycle: 0,
    cycleRegularity: "",
    totalTrackedCycles: 0
  });
  
  useEffect(() => {
    const { cycles } = getUserData();
    const statistics = getCycleStatistics(cycles);
    setStats(statistics);
  }, []);
  
  // Display message if no cycles recorded
  if (stats.totalTrackedCycles === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            <span>{labels.pages.dashboard.cycleStats}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
            <p>{labels.messages.noData.cycles}</p>
            <p className="text-sm mt-2">{labels.messages.noData.addPeriod}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          <span>{labels.pages.dashboard.cycleStats}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Average Cycle</p>
            <p className="text-2xl font-bold">{stats.averageCycleLength} days</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Average Period</p>
            <p className="text-2xl font-bold">{stats.averagePeriodLength} days</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Shortest Cycle</p>
            <p className="text-2xl font-bold">
              {stats.shortestCycle ? `${stats.shortestCycle} days` : "N/A"}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Longest Cycle</p>
            <p className="text-2xl font-bold">
              {stats.longestCycle ? `${stats.longestCycle} days` : "N/A"}
            </p>
          </div>
          
          <div className="space-y-1 col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Cycle Regularity</p>
            <p className="text-lg font-semibold">{stats.cycleRegularity}</p>
          </div>
          
          <div className="col-span-2 pt-2">
            <p className="text-sm text-muted-foreground">
              Based on {stats.totalTrackedCycles} recorded cycle{stats.totalTrackedCycles !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}