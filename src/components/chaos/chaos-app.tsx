
"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/chaos/header";
import { ChaosCanvas } from "@/components/chaos/canvas";
import { ControlPanel } from "@/components/chaos/controls";
import { cn } from "@/lib/utils";

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
  const [showControls, setShowControls] = useState(true);

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

  const handleToggleControls = () => {
    setShowControls(prev => {
      // If we are about to hide the controls, restart the simulation.
      if (prev) {
        handleRestart();
      }
      return !prev;
    });
  }

  const initialConditions = useMemo(() => ({
    ...params,
    a1: Math.PI / 1.5,
    a2: Math.PI / 1.501, // Tiny difference to show chaos
  }), [params, simulationKey]);
  
  useEffect(() => {
    // Start the simulation on mount
    handleRestart();
  }, []);

  const handleParamChange = (newParams: Partial<PendulumParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
    handleRestart();
  }


  return (
    <div className="flex flex-col h-screen bg-black text-foreground">
      <Header 
        onRestart={handleRestart} 
        onToggleControls={handleToggleControls}
        showControls={showControls}
        />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-0">
        <section className={cn("bg-black border rounded-lg overflow-hidden relative transition-all duration-300", showControls ? "md:col-span-2" : "md:col-span-3")}>
          <ChaosCanvas
            key={simulationKey}
            initialConditions={initialConditions}
            traceColor="#FFFF00"
            pendulumColor="#FF00FF"
            isRunning={isRunning}
          />
        </section>
        {showControls && (
            <aside className="bg-black border rounded-lg overflow-y-auto md:col-span-1">
                <ControlPanel params={params} onParamChange={handleParamChange} />
            </aside>
        )}
      </main>
    </div>
  );
}
