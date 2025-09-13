"use client";

import { Button } from "@/components/ui/button";
import { PanelRightClose, PanelRightOpen, RotateCw } from "lucide-react";

type HeaderProps = {
  onRestart: () => void;
  onToggleControls: () => void;
  showControls: boolean;
};

export function Header({ onRestart, onToggleControls, showControls }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-headline text-primary">
          Chaos Theory
        </h1>
        <p className="text-sm text-muted-foreground hidden sm:block">The Double Pendulum & The Butterfly Effect</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onRestart} variant="outline">
          <RotateCw className="mr-2 h-4 w-4" /> Restart
        </Button>
        <Button onClick={onToggleControls} variant="outline">
          {showControls ? <PanelRightClose className="mr-2 h-4 w-4" /> : <PanelRightOpen className="mr-2 h-4 w-4" />}
          {showControls ? "Hide Controls" : "Show Controls"}
        </Button>
      </div>
    </header>
  );
}
