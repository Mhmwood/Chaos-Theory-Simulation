
"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/chaos/header";
import { ChaosCanvas } from "@/components/chaos/canvas";

export function ChaosApp() {
  // Angles in radians, lengths and masses
  const [initialConditions, setInitialConditions] = useState({
    a1: Math.PI / 1.5,
    a2: Math.PI / 1.5,
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
        setInitialConditions({
            a1: Math.PI / 1.5,
            a2: Math.PI / 1.5,
            l1: 150,
            l2: 150,
            m1: 10,
            m2: 10,
        });
        setIsRunning(true);
    }, 100);
  };
  
  useEffect(() => {
    // Start the simulation on mount
    setIsRunning(true);
  }, [simulationKey]);


  return (
    <div className="flex flex-col h-screen bg-black text-foreground">
      <Header onRestart={handleRestart} />
      <main className="flex-1 grid grid-cols-1 gap-4 p-4 min-h-0">
        <section className="bg-black border rounded-lg overflow-hidden relative">
          <ChaosCanvas
            key={simulationKey}
            initialConditions={initialConditions}
            traceColor="hsl(var(--primary))"
            pendulumColor="hsl(var(--accent))"
            isRunning={isRunning}
          />
        </section>
      </main>
    </div>
  );
}
