"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isFuture, differenceInDays, addDays } from "date-fns";
import { getUserData } from "@/lib/storage";
import { calculateFertilityWindow, predictNextPeriod } from "@/lib/cycle-utils";
import { CalendarRange, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import labels from '@/lib/labels.json';

export function FertilityWindow() {
  const [fertileDays, setFertileDays] = useState<Date[]>([]);
  const [ovulationDay, setOvulationDay] = useState<Date | null>(null);
  
  useEffect(() => {
    const { cycles, settings } = getUserData();
    
    if (cycles.length === 0) {
      return;
    }
    
    // Get last cycle or predicted next cycle
    const { predictedStart } = predictNextPeriod(cycles, settings);
    const { fertileStart, fertileEnd, ovulationDay } = calculateFertilityWindow(
      predictedStart,
      settings.averageCycleLength
    );
    
    // Generate array of fertile days
    const days: Date[] = [];
    let currentDay = fertileStart;
    
    while (currentDay <= fertileEnd) {
      days.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }
    
    setFertileDays(days);
    setOvulationDay(ovulationDay);
  }, []);
  
  // If there's no data or all fertile days are in the past
  if (
    fertileDays.length === 0 ||
    (fertileDays.length > 0 && fertileDays.every(day => !isFuture(day) && !isToday(day)))
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarRange className="mr-2 h-5 w-5" />
            <span>{labels.pages.dashboard.fertilityWindow}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {labels.pages.settings.about.howItWorks.content}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
            <p>{labels.messages.noData.fertilityWindow.title}</p>
            <p className="text-sm mt-2">{labels.messages.noData.fertilityWindow.description}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get only current and future fertile days
  const upcomingFertileDays = fertileDays.filter(
    day => isFuture(day) || isToday(day)
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarRange className="mr-2 h-5 w-5" />
          <span>{labels.pages.dashboard.fertilityWindow}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {labels.pages.settings.about.howItWorks.content}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-1.5">
            {upcomingFertileDays.length > 0 && (
              <span className="text-sm font-medium text-muted-foreground">
                {format(upcomingFertileDays[0], "MMM d")} - {format(upcomingFertileDays[upcomingFertileDays.length - 1], "MMM d")}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {upcomingFertileDays.map((day, index) => {
              const isOvulation = ovulationDay && 
                format(day, "yyyy-MM-dd") === format(ovulationDay, "yyyy-MM-dd");
              const isCurrentDay = isToday(day);
              let daysAway = "";
              
              if (isCurrentDay) {
                daysAway = "Today";
              } else {
                const days = differenceInDays(day, new Date());
                daysAway = `in ${days} day${days !== 1 ? "s" : ""}`;
              }
              
              return (
                <Badge
                  key={index}
                  variant={isOvulation ? "default" : "secondary"}
                  className={cn(
                    "py-2 px-3",
                    isOvulation ? "bg-purple-500 hover:bg-purple-600" : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                  )}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{format(day, "EEE, MMM d")}</span>
                    <span className="text-xs mt-0.5">{daysAway}</span>
                    {isOvulation && (
                      <span className="text-xs font-medium mt-1">Ovulation Day</span>
                    )}
                  </div>
                </Badge>
              );
            })}
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            These are your most fertile days if you're trying to conceive.
            {ovulationDay && isFuture(ovulationDay) && (
              <span className="block mt-1">
                Your predicted ovulation day is <strong>{format(ovulationDay, "MMMM d")}</strong>
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}