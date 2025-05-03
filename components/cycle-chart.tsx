"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, differenceInDays } from "date-fns";
import { MenstrualCycle } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/lib/storage";
import labels from '@/lib/labels.json';

interface CycleDataPoint {
  date: string;
  cycleLength: number;
  periodLength: number;
}

export function CycleChart() {
  const [chartData, setChartData] = useState<CycleDataPoint[]>([]);
  const [averageCycleLength, setAverageCycleLength] = useState<number>(28);

  useEffect(() => {
    const { cycles, settings } = getUserData();
    
    if (cycles.length < 2) {
      return;
    }
    
    // Sort cycles by start date (oldest first)
    const sortedCycles = [...cycles].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    // Calculate cycle lengths and create chart data
    const data: CycleDataPoint[] = [];
    let totalCycleLength = 0;
    let cycleCount = 0;
    
    for (let i = 0; i < sortedCycles.length - 1; i++) {
      const currentCycle = sortedCycles[i];
      const nextCycle = sortedCycles[i + 1];
      
      const currentStart = new Date(currentCycle.startDate);
      const nextStart = new Date(nextCycle.startDate);
      
      const cycleLength = differenceInDays(nextStart, currentStart);
      
      if (cycleLength > 0 && cycleLength < 50) { // Filter out potentially erroneous data
        totalCycleLength += cycleLength;
        cycleCount++;
        
        const periodLength = differenceInDays(
          new Date(currentCycle.endDate),
          new Date(currentCycle.startDate)
        ) + 1;
        
        data.push({
          date: format(currentStart, "MMM dd"),
          cycleLength,
          periodLength,
        });
      }
    }
    
    // Calculate average cycle length
    const avgLength = cycleCount > 0 
      ? Math.round(totalCycleLength / cycleCount) 
      : settings.averageCycleLength;
    
    setAverageCycleLength(avgLength);
    setChartData(data);
  }, []);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{labels.pages.dashboard.cycleTrends}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {labels.messages.noData.trends}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.pages.dashboard.cycleTrends}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickMargin={10} 
              />
              <YAxis 
                domain={[10, 40]} 
                ticks={[10, 15, 20, 25, 28, 30, 35, 40]} 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "cycleLength") return [`${value} days`, "Cycle Length"];
                  if (name === "periodLength") return [`${value} days`, "Period Length"];
                  return [value, name];
                }}
              />
              <ReferenceLine 
                y={averageCycleLength} 
                label={{ 
                  value: `Avg: ${averageCycleLength}`, 
                  position: 'insideBottomRight',
                  fontSize: 12 
                }} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={28} 
                label={{ 
                  value: 'Typical: 28',
                  position: 'insideTopRight',
                  fontSize: 12 
                }} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="3 3" 
                opacity={0.5} 
              />
              <Line
                type="monotone"
                dataKey="cycleLength"
                name="Cycle Length"
                stroke="hsl(var(--chart-1))"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="periodLength"
                name="Period Length"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}