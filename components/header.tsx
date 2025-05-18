"use client";

import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { AudioWaveform as Waveform, Calendar, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import labels from '@/lib/labels.json';

export function Header() {
  const pathname = usePathname();
  
  const links = [
    { path: "/", label: "Dashboard", icon: Waveform },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/settings", label: "Settings", icon: Settings2 },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full bg-card/70 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Waveform className="h-6 w-6 text-primary rotate-90" />
          <span className="font-semibold text-xl">{labels.app.name}</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  isActive 
                    ? "text-primary border-b-2 border-primary pb-3.5 pt-4" 
                    : "text-muted-foreground pt-4 pb-3.5 border-b-2 border-transparent"
                )}
              >
                <link.icon className="h-4 w-4 mr-2" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="md:hidden">
          <MobileNav links={links} pathname={pathname} />
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ 
  links, 
  pathname 
}: { 
  links: { path: string; label: string; icon: any }[]; 
  pathname: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/70 backdrop-blur-md border-t">
      <div className="flex items-center justify-between p-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.path} 
              href={link.path}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-md w-1/3",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}