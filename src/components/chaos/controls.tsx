
"use client";

import { PendulumSystem, PendulumParams, AppearanceParams } from "./chaos-app";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

type ControlPanelProps = {
  pendulums: PendulumSystem[];
  onParamChange: (id: number, newParams: Partial<PendulumParams>) => void;
  onAppearanceChange: (id: number, newAppearance: Partial<AppearanceParams>) => void;
  onRemovePendulum: (id: number) => void;
};

export function ControlPanel({ pendulums, onParamChange, onAppearanceChange, onRemovePendulum }: ControlPanelProps) {
  
  if (pendulums.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No pendulums to control. Add one to get started!
      </div>
    );
  }

  const defaultActiveItems = pendulums.map(p => `pendulum-${p.id}`);

  return (
      <Accordion type="multiple" defaultValue={defaultActiveItems} className="w-full space-y-4">
        {pendulums.map((p, index) => (
            <div key={p.id} className="rounded-lg border p-4">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-primary">Pendulum #{index + 1}</h3>
                    {pendulums.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => onRemovePendulum(p.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    )}
                 </div>
                 <Separator className="mb-4" />
                <Accordion type="multiple" defaultValue={[`p1-${p.id}`, `p2-${p.id}`, `app-${p.id}`]} className="w-full">
                    <AccordionItem value={`p1-${p.id}`}>
                    <AccordionTrigger>
                        <h4 className="font-semibold">Pendulum 1</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-4 pt-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`l1-${p.id}`}>Length (l1)</Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                    id={`l1-${p.id}`}
                                    min={50}
                                    max={200}
                                    step={1}
                                    value={[p.params.l1]}
                                    onValueChange={(value) => onParamChange(p.id, { l1: value[0] })}
                                    />
                                    <span className="text-sm font-medium w-12 text-right">{Math.round(p.params.l1)}</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`m1-${p.id}`}>Mass (m1)</Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                    id={`m1-${p.id}`}
                                    min={5}
                                    max={30}
                                    step={1}
                                    value={[p.params.m1]}
                                    onValueChange={(value) => onParamChange(p.id, { m1: value[0] })}
                                    />
                                    <span className="text-sm font-medium w-12 text-right">{Math.round(p.params.m1)}</span>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={`p2-${p.id}`}>
                    <AccordionTrigger>
                        <h4 className="font-semibold">Pendulum 2</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-4 pt-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`l2-${p.id}`}>Length (l2)</Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                    id={`l2-${p.id}`}
                                    min={50}
                                    max={200}
                                    step={1}
                                    value={[p.params.l2]}
                                    onValueChange={(value) => onParamChange(p.id, { l2: value[0] })}
                                    />
                                    <span className="text-sm font-medium w-12 text-right">{Math.round(p.params.l2)}</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`m2-${p.id}`}>Mass (m2)</Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                    id={`m2-${p.id}`}
                                    min={5}
                                    max={30}
                                    step={1}
                                    value={[p.params.m2]}
                                    onValueChange={(value) => onParamChange(p.id, { m2: value[0] })}
                                    />
                                    <span className="text-sm font-medium w-12 text-right">{Math.round(p.params.m2)}</span>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={`app-${p.id}`}>
                    <AccordionTrigger>
                        <h4 className="font-semibold">Appearance</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`traceColor-${p.id}`}>Trace Color</Label>
                                <div className="flex items-center gap-2">
                                <Input
                                    id={`traceColor-${p.id}`}
                                    type="color"
                                    value={p.appearance.traceColor}
                                    onChange={(e) => onAppearanceChange(p.id, { traceColor: e.target.value })}
                                    className="w-12 h-10 p-1"
                                    />
                                    <span className="text-sm font-medium">{p.appearance.traceColor}</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`pendulumColor-${p.id}`}>Pendulum Color</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                    id={`pendulumColor-${p.id}`}
                                    type="color"
                                    value={p.appearance.pendulumColor}
                                    onChange={(e) => onAppearanceChange(p.id, { pendulumColor: e.target.value })}
                                    className="w-12 h-10 p-1"
                                    />
                                    <span className="text-sm font-medium">{p.appearance.pendulumColor}</span>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        ))}
      </Accordion>
  );
}
