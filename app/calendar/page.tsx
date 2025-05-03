import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarHeatmap } from "@/components/ui/calendar-heat";
import { AddPeriodForm } from "@/components/add-period-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import labels from '@/lib/labels.json';

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0 pt-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{labels.pages.calendar.title}</CardTitle>
                <CardDescription>
                  {labels.pages.calendar.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="calendar">{labels.pages.calendar.tabs.calendar}</TabsTrigger>
                    <TabsTrigger value="add">{labels.pages.calendar.tabs.logPeriod}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="calendar" className="mt-0">
                    <div className="flex justify-center">
                      <CalendarHeatmap />
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">{labels.pages.calendar.legend.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950"></div>
                          <span>{labels.pages.calendar.legend.periodDays}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950"></div>
                          <span>{labels.pages.calendar.legend.fertileWindow}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950"></div>
                          <span>{labels.pages.calendar.legend.ovulationDay}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border border-dashed border-gray-400"></div>
                          <span>{labels.pages.calendar.legend.predictedDays}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="add" className="mt-0">
                    <div className="max-w-md mx-auto">
                      <AddPeriodForm />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}