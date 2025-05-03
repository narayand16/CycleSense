"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getDateStatus } from "@/lib/cycle-utils";

export function CalendarHeatmap() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Go to previous month
  const previousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add days from previous and next month to fill the calendar grid
  let startDay = monthStart.getDay();
  if (startDay === 0) startDay = 7; // Adjust for Sunday as 0
  
  const prefixDays = Array(startDay - 1)
    .fill(null)
    .map((_, i) => subMonths(addDays(monthStart, i - startDay + 1), 0));
  
  const suffixDays = Array(42 - prefixDays.length - daysInMonth.length)
    .fill(null)
    .map((_, i) => addDays(monthEnd, i + 1));
  
  const allDays = [...prefixDays, ...daysInMonth, ...suffixDays];
  
  // Group days into rows (weeks)
  const calendarRows = [];
  for (let i = 0; i < allDays.length; i += 7) {
    calendarRows.push(allDays.slice(i, i + 7));
  }
  
  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
          <div className="font-medium">Mon</div>
          <div className="font-medium">Tue</div>
          <div className="font-medium">Wed</div>
          <div className="font-medium">Thu</div>
          <div className="font-medium">Fri</div>
          <div className="font-medium">Sat</div>
          <div className="font-medium">Sun</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarRows.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const dayKey = `${weekIndex}-${dayIndex}`;
              if (!day) return <div key={dayKey} className="h-9" />;
              
              const status = getDateStatus(day);
              
              return (
                <button
                  key={dayKey}
                  className={cn(
                    "h-9 w-full rounded-full flex items-center justify-center text-sm transition-colors",
                    !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
                    isToday(day) && "border border-primary",
                    status.isPeriod && !status.isPredicted && "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300",
                    status.isPeriod && status.isPredicted && "bg-red-50 dark:bg-red-900/30 text-red-700/80 dark:text-red-400/60 border border-dashed border-red-300 dark:border-red-700",
                    status.isOvulation && !status.isPredicted && "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-medium",
                    status.isOvulation && status.isPredicted && "bg-purple-50 dark:bg-purple-900/30 text-purple-700/80 dark:text-purple-400/60 border border-dashed border-purple-300 dark:border-purple-700",
                    status.isFertile && !status.isOvulation && !status.isPredicted && "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300",
                    status.isFertile && !status.isOvulation && status.isPredicted && "bg-blue-50 dark:bg-blue-900/30 text-blue-700/80 dark:text-blue-400/60 border border-dashed border-blue-300 dark:border-blue-700",
                    !status.isPeriod && !status.isFertile && !status.isOvulation && "hover:bg-accent"
                  )}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
              );
            })
          )}
        </div>
      </div>
      
      <div className="p-3 border-t border-border">
        <div className="flex flex-wrap gap-4 justify-between text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-950"></div>
            <span>Period</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-950"></div>
            <span>Fertile</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-100 dark:bg-purple-950"></div>
            <span>Ovulation</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border border-dashed border-gray-400"></div>
            <span>Predicted</span>
          </div>
        </div>
      </div>
    </div>
  );
}