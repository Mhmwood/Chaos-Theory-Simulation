"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Header } from "@/components/chaos/header";
import { ChaosCanvas } from "@/components/chaos/canvas";

const BUTTERFLY_EFFECT_DELTA = 0.0001;

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

  const ghostInitialConditions = useMemo(() => ({
    ...initialConditions,
    a1: initialConditions.a1 + BUTTERFLY_EFFECT_DELTA,
  }), [initialConditions]);

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
    handleRestart();
  }, []);


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onRestart={handleRestart} />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-0">
        <section className="bg-card border rounded-lg overflow-hidden relative">
          <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-sm text-foreground z-10">
            Original
          </div>
          <ChaosCanvas
            key={`${simulationKey}-original`}
            initialConditions={initialConditions}
            traceColor="hsl(var(--primary))"
            pendulumColor="hsl(var(--accent))"
            isRunning={isRunning}
          />
        </section>
        <section className="bg-card border rounded-lg overflow-hidden relative">
          <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-sm text-foreground z-10">
            Ghost (Angle +{BUTTERFLY_EFFECT_DELTA.toExponential()})
          </div>
          <ChaosCanvas
             key={`${simulationKey}-ghost`}
            initialConditions={ghostInitialConditions}
            traceColor="hsl(var(--secondary))"
            pendulumColor="hsl(var(--muted-foreground))"
            isRunning={isRunning}
          />
        </section>
      </main>
    </div>
  );
}
