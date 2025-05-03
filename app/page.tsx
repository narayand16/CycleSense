import { Header } from "@/components/header";
import { AddPeriodForm } from "@/components/add-period-form";
import { CalendarHeatmap } from "@/components/ui/calendar-heat";
import { FertilityWindow } from "@/components/fertility-window";
import { CycleStats } from "@/components/cycle-stats";
import { CycleChart } from "@/components/cycle-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import labels from '@/lib/labels.json';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0 pt-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Calendar Card */}
              <div className="flex-1">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{labels.pages.dashboard.cycleCalendar}</CardTitle>
                      <ModeToggle />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CalendarHeatmap />
                  </CardContent>
                </Card>
              </div>
              
              {/* Add Period Form */}
              <div className="md:w-80 lg:w-96">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{labels.pages.dashboard.logPeriod}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddPeriodForm />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Middle Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FertilityWindow />
              <CycleStats />
            </div>
            
            {/* Bottom Section */}
            <CycleChart />
          </div>
        </div>
      </main>
    </div>
  );
}