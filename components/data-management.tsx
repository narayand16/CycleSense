"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { getUserData, saveUserData } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/lib/types";
import labels from '@/lib/labels.json';

export function DataManagement() {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    const data = getUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    
    link.href = url;
    link.download = `cyclesense-data-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: labels.messages.success.dataExported.title,
      description: labels.messages.success.dataExported.description,
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const text = await file.text();
      const importedData = JSON.parse(text) as UserData;

      // Validate the imported data structure
      if (!importedData.cycles || !importedData.settings) {
        throw new Error("Invalid data format");
      }

      // Save the imported data
      saveUserData(importedData);

      toast({
        title: labels.messages.success.dataImported.title,
        description: labels.messages.success.dataImported.description,
      });

      // Reload the page to reflect the imported data
      window.location.reload();
    } catch (error) {
      toast({
        title: labels.messages.error.dataImport.title,
        description: labels.messages.error.dataImport.description,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">{labels.pages.settings.dataManagement.title}</h3>
        <p className="text-muted-foreground mb-4">
          {labels.pages.settings.dataManagement.description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleExport}
          className="flex-1"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          {labels.pages.settings.dataManagement.export}
        </Button>

        <div className="flex-1">
          <input
            type="file"
            id="import-file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
            disabled={importing}
          />
          <Button
            onClick={() => document.getElementById("import-file")?.click()}
            className="w-full"
            variant="outline"
            disabled={importing}
          >
            <Upload className="mr-2 h-4 w-4" />
            {importing 
              ? labels.pages.settings.dataManagement.importing 
              : labels.pages.settings.dataManagement.import}
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {labels.pages.settings.dataManagement.note}
      </p>
    </div>
  );
}