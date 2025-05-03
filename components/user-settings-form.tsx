"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserData, updateSettings, clearAllData } from "@/lib/storage";
import { UserSettings } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import labels from '@/lib/labels.json';

export function UserSettingsForm() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    averageCycleLength: 28,
    averagePeriodLength: 5,
    lastUpdated: new Date().toISOString(),
  });
  
  useEffect(() => {
    const { settings } = getUserData();
    setSettings(settings);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (settings.averageCycleLength < 21 || settings.averageCycleLength > 45) {
      toast({
        title: "Error",
        description: labels.messages.error.invalidCycleLength,
        variant: "destructive",
      });
      return;
    }
    
    if (settings.averagePeriodLength < 2 || settings.averagePeriodLength > 10) {
      toast({
        title: "Error",
        description: labels.messages.error.invalidPeriodLength,
        variant: "destructive",
      });
      return;
    }
    
    // Update settings in storage
    updateSettings(settings);
    
    toast({
      title: "Success",
      description: labels.messages.success.settingsSaved,
    });
  };
  
  const handleResetData = () => {
    clearAllData();
    
    // Reset form to defaults
    setSettings({
      averageCycleLength: 28,
      averagePeriodLength: 5,
      lastUpdated: new Date().toISOString(),
    });
    
    toast({
      title: "Success",
      description: labels.messages.success.dataCleared,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cycle-length">{labels.forms.settings.cycleLength.label}</Label>
          <Input
            id="cycle-length"
            type="number"
            min={21}
            max={45}
            value={settings.averageCycleLength}
            onChange={(e) =>
              setSettings({
                ...settings,
                averageCycleLength: parseInt(e.target.value) || 28,
              })
            }
          />
          <p className="text-sm text-muted-foreground">
            {labels.forms.settings.cycleLength.description}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="period-length">{labels.forms.settings.periodLength.label}</Label>
          <Input
            id="period-length"
            type="number"
            min={2}
            max={10}
            value={settings.averagePeriodLength}
            onChange={(e) =>
              setSettings({
                ...settings,
                averagePeriodLength: parseInt(e.target.value) || 5,
              })
            }
          />
          <p className="text-sm text-muted-foreground">
            {labels.forms.settings.periodLength.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Button type="submit" className="flex-1">
          {labels.forms.settings.submit}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              {labels.forms.settings.reset}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{labels.forms.settings.resetConfirm.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {labels.forms.settings.resetConfirm.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetData}>
                {labels.forms.settings.reset}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
}