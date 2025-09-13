"use client";

import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

type HeaderProps = {
  onRestart: () => void;
};

export function Header({ onRestart }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-headline text-primary">
          Chaos Theory
        </h1>
        <p className="text-sm text-muted-foreground hidden sm:block">The Double Pendulum & The Butterfly Effect</p>
      </div>
      <Button onClick={onRestart} variant="outline">
        <RotateCw className="mr-2 h-4 w-4" /> Restart
      </Button>
    </header>
  );
}
