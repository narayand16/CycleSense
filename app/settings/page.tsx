import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSettingsForm } from "@/components/user-settings-form";
import { DataManagement } from "@/components/data-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import labels from '@/lib/labels.json';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0 pt-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{labels.pages.settings.title}</CardTitle>
                <CardDescription>
                  {labels.pages.settings.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="cycle" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="cycle">{labels.pages.settings.tabs.cycle}</TabsTrigger>
                    <TabsTrigger value="data">{labels.pages.settings.tabs.data}</TabsTrigger>
                    <TabsTrigger value="about">{labels.pages.settings.tabs.about}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cycle" className="mt-0">
                    <div className="max-w-2xl">
                      <UserSettingsForm />
                    </div>
                  </TabsContent>

                  <TabsContent value="data" className="mt-0">
                    <div className="max-w-2xl">
                      <DataManagement />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="about" className="mt-0">
                    <div className="max-w-2xl space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{labels.pages.settings.about.privacy.title}</h3>
                        <p className="text-muted-foreground">
                          {labels.pages.settings.about.privacy.content}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">{labels.pages.settings.about.howItWorks.title}</h3>
                        <p className="text-muted-foreground">
                          {labels.pages.settings.about.howItWorks.content}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">{labels.pages.settings.about.dataStorage.title}</h3>
                        <p className="text-muted-foreground">
                          {labels.pages.settings.about.dataStorage.content}
                        </p>
                      </div>
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