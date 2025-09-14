
"use client";

import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import type { ReactNode } from "react";

type HeaderProps = {
  onRestart: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  children: ReactNode;
};

export function Header({ onRestart, onZoomIn, onZoomOut, children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b flex-wrap gap-4">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold font-headline text-primary">
          Chaos Theory
        </h1>
        <p className="text-sm text-muted-foreground hidden sm:block">The Double Pendulum & The Butterfly Effect</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-end">
         <Button onClick={onZoomIn} variant="outline" size="icon" title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={onZoomOut} variant="outline" size="icon" title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={onRestart} variant="outline">
          <RotateCw className="mr-2 h-4 w-4" /> Restart
        </Button>
        {children}
      </div>
    </header>
  );
}
