
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Header } from "@/components/chaos/header";
import { ChaosCanvas } from "@/components/chaos/canvas";
import { ControlPanel } from "@/components/chaos/controls";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, PlusCircle } from "lucide-react";
import { hslToHex } from "@/lib/utils";

export type PendulumParams = {
  l1: number;
  l2: number;
  m1: number;
  m2: number;
};

export type AppearanceParams = {
    traceColor: string;
    pendulumColor: string;
}

export type PendulumSystem = {
    id: number;
    params: PendulumParams;
    appearance: AppearanceParams;
    initialAngles: { a1: number; a2: number };
};

const createNewPendulum = (id: number): PendulumSystem => {
    const randomAngle = () => Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    const randomH = Math.random() * 360;

    return {
        id,
        params: {
            l1: 100 + Math.random() * 100,
            l2: 100 + Math.random() * 100,
            m1: 8 + Math.random() * 14,
            m2: 8 + Math.random() * 14,
        },
        appearance: {
            traceColor: hslToHex(randomH, 100, 75),
            pendulumColor: hslToHex(randomH + 60 % 360, 100, 75),
        },
        initialAngles: {
            a1: randomAngle(),
            a2: randomAngle() + (Math.random() - 0.5) * 0.01, // Tiny difference
        },
    };
};


export function ChaosApp() {
  const [pendulums, setPendulums] = useState<PendulumSystem[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [simulationKey, setSimulationKey] = useState(Date.now());
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Start with one pendulum on mount
    setPendulums([createNewPendulum(1)]);
  }, []);
  
  const handleRestart = useCallback(() => {
    setIsRunning(false);
    setTimeout(() => {
      setSimulationKey(Date.now());
      setIsRunning(true);
    }, 50);
  }, []);

  const handleAddPendulum = () => {
    setPendulums(prev => [...prev, createNewPendulum(Date.now())]);
    handleRestart();
  };

  const handleRemovePendulum = (id: number) => {
    setPendulums(prev => prev.filter(p => p.id !== id));
  };
  
  const handleParamChange = (id: number, newParams: Partial<PendulumParams>) => {
    setPendulums(prev => prev.map(p => p.id === id ? { ...p, params: { ...p.params, ...newParams } } : p));
    handleRestart();
  }

  const handleAppearanceChange = (id: number, newAppearance: Partial<AppearanceParams>) => {
     setPendulums(prev => prev.map(p => p.id === id ? { ...p, appearance: { ...p.appearance, ...newAppearance } } : p));
  }

  const handleSyncPhysics = useCallback((sourceId: number) => {
    setPendulums(prev => {
        const sourcePendulum = prev.find(p => p.id === sourceId);
        if (!sourcePendulum) return prev;
        
        const sourceParams = sourcePendulum.params;
        return prev.map(p => ({
            ...p,
            params: sourceParams,
        }));
    });
    handleRestart();
  }, [handleRestart]);

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.2, 5));
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.2, 0.2));

  const simulationSystems = useMemo(() => pendulums.map(p => ({
    id: p.id,
    ...p.params,
    ...p.appearance,
    a1: p.initialAngles.a1,
    a2: p.initialAngles.a2,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [pendulums, simulationKey]);


  return (
    <Sheet>
      <div className="flex flex-col h-screen bg-black text-foreground">
        <Header 
            onRestart={handleRestart}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
        >
             <Button onClick={handleAddPendulum} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Pendulum
            </Button>
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
              systems={simulationSystems}
              isRunning={isRunning}
              zoom={zoom}
            />
          </section>
        </main>
        <SheetContent side="bottom" className="bg-black border-t h-[75vh] flex flex-col">
            <SheetHeader>
                <SheetTitle>Controls</SheetTitle>
                <SheetDescription>
                  Manage the properties of each independent pendulum system.
                </SheetDescription>
            </SheetHeader>
            <div className="py-4 flex-1 overflow-y-auto">
                <ControlPanel 
                    pendulums={pendulums}
                    onParamChange={handleParamChange}
                    onAppearanceChange={handleAppearanceChange}
                    onRemovePendulum={handleRemovePendulum}
                    onSyncPhysics={handleSyncPhysics}
                />
            </div>
        </SheetContent>
      </div>
    </Sheet>
  );
}
