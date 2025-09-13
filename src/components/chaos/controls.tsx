
"use client";

import { PendulumParams } from "./chaos-app";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ControlPanelProps = {
  params: PendulumParams;
  onParamChange: (newParams: Partial<PendulumParams>) => void;
};

export function ControlPanel({ params, onParamChange }: ControlPanelProps) {
  return (
    <Card className="bg-transparent border-none">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Pendulum 1</h3>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="l1">Length (l1)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                        id="l1"
                        min={50}
                        max={200}
                        step={1}
                        value={[params.l1]}
                        onValueChange={(value) => onParamChange({ l1: value[0] })}
                        />
                        <span className="text-sm font-medium w-12 text-right">{params.l1}</span>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="m1">Mass (m1)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                        id="m1"
                        min={5}
                        max={30}
                        step={1}
                        value={[params.m1]}
                        onValueChange={(value) => onParamChange({ m1: value[0] })}
                        />
                         <span className="text-sm font-medium w-12 text-right">{params.m1}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Pendulum 2</h3>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="l2">Length (l2)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                        id="l2"
                        min={50}
                        max={200}
                        step={1}
                        value={[params.l2]}
                        onValue-change={(value) => onParamChange({ l2: value[0] })}
                        />
                         <span className="text-sm font-medium w-12 text-right">{params.l2}</span>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="m2">Mass (m2)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                        id="m2"
                        min={5}
                        max={30}
                        step={1}
                        value={[params.m2]}
                        onValueChange={(value) => onParamChange({ m2: value[0] })}
                        />
                         <span className="text-sm font-medium w-12 text-right">{params.m2}</span>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
