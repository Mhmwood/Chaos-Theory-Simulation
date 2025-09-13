
"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/chaos/header";
import { ChaosCanvas } from "@/components/chaos/canvas";
import { ControlPanel } from "@/components/chaos/controls";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export type PendulumParams = {
  l1: number;
  l2: number;
  m1: number;
  m2: number;
};

export function ChaosApp() {
  const [params, setParams] = useState<PendulumParams>({
    l1: 150,
    l2: 150,
    m1: 10,
    m2: 10,
  });

  const [isRunning, setIsRunning] = useState(true);

  // A key to force-remount the canvas and restart the simulation
  const [simulationKey, setSimulationKey] = useState(Date.now());
  
  const handleRestart = () => {
    setIsRunning(false);
    // Give it a moment to stop, then restart
    setTimeout(() => {
        setSimulationKey(Date.now());
        setIsRunning(true);
    }, 100);
  };
  
  useEffect(() => {
    // Start the simulation on mount
    handleRestart();
  }, []);

  const handleParamChange = (newParams: Partial<PendulumParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
    handleRestart();
  }

  const initialConditions = useMemo(() => ({
    ...params,
    a1: Math.PI / 1.5,
    a2: Math.PI / 1.501, // Tiny difference to show chaos
  }), [params, simulationKey]);


  return (
    <Sheet>
      <div className="flex flex-col h-screen bg-black text-foreground">
        <Header onRestart={handleRestart}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Controls
                </Button>
            </SheetTrigger>
        </Header>
        <main className="flex-1 flex flex-col min-h-0">
          <section className="flex-1 bg-black border rounded-lg overflow-hidden relative m-4">
            <ChaosCanvas
              key={simulationKey}
              initialConditions={initialConditions}
              traceColor="#FFFF00"
              pendulumColor="#FF00FF"
              isRunning={isRunning}
            />
          </section>
        </main>
        <SheetContent side="bottom" className="bg-black border-t">
            <SheetHeader>
                <SheetTitle>Controls</SheetTitle>
            </SheetHeader>
            <div className="py-4">
                <ControlPanel params={params} onParamChange={handleParamChange} />
            </div>
        </SheetContent>
      </div>
    </Sheet>
  );
}
