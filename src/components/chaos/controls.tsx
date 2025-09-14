
"use client";

import { PendulumSystem, PendulumParams, AppearanceParams } from "./chaos-app";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";

type ControlPanelProps = {
  pendulums: PendulumSystem[];
  onParamChange: (id: number, newParams: Partial<PendulumParams>) => void;
  onAppearanceChange: (id: number, newAppearance: Partial<AppearanceParams>) => void;
  onRemovePendulum: (id: number) => void;
  onSyncPhysics: (sourceId: number) => void;
};

export function ControlPanel({ pendulums, onParamChange, onAppearanceChange, onRemovePendulum, onSyncPhysics }: ControlPanelProps) {
  
  if (pendulums.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No pendulums to control. Add one to get started!
      </div>
    );
  }

  return (
      <ScrollArea className="h-full">
        <div className="space-y-4 pr-6">
            {pendulums.map((p, index) => (
                <div key={p.id} className="rounded-lg border p-2 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-primary">Pendulum #{index + 1}</h3>
                        {pendulums.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => onRemovePendulum(p.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                    <Separator className="mb-4" />
                    <Accordion type="multiple" defaultValue={[`params-${p.id}`, `appearance-${p.id}`]} className="w-full">
                        <AccordionItem value={`params-${p.id}`}>
                        <AccordionTrigger>
                            <h4 className="font-semibold">Physics Parameters</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid gap-4 pt-2">
                                {pendulums.length > 1 && (
                                    <div className="pt-2">
                                        <Button onClick={() => onSyncPhysics(p.id)} className="w-full" variant="secondary" size="sm">
                                            <Copy className="mr-2 h-4 w-4" />
                                            Sync All Physics to This Pendulum
                                        </Button>
                                    <Separator className="my-4" />
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label htmlFor={`l1-${p.id}`}>Length 1 (l1)</Label>
                                    <div className="flex items-center gap-2 sm:gap-4">
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
                                    <Label htmlFor={`m1-${p.id}`}>Mass 1 (m1)</Label>
                                    <div className="flex items-center gap-2 sm:gap-4">
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
                                 <Separator />
                                <div className="grid gap-2">
                                    <Label htmlFor={`l2-${p.id}`}>Length 2 (l2)</Label>
                                    <div className="flex items-center gap-2 sm:gap-4">
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
                                    <Label htmlFor={`m2-${p.id}`}>Mass 2 (m2)</Label>
                                    <div className="flex items-center gap-2 sm:gap-4">
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
                        <AccordionItem value={`appearance-${p.id}`}>
                        <AccordionTrigger>
                            <h4 className="font-semibold">Appearance</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="grid gap-2">
                                    <Label htmlFor={`traceColor-${p.id}`}>Trace Color</Label>
                                    <div className="flex items-center gap-2">
                                    <Input
                                        id={`traceColor-${p.id}`}
                                        type="color"
                                        value={p.appearance.traceColor}
                                        onChange={(e) => onAppearanceChange(p.id, { traceColor: e.target.value })}
                                        className="w-10 h-10 p-1"
                                        />
                                        <span className="text-sm font-mono">{p.appearance.traceColor.toUpperCase()}</span>
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
                                        className="w-10 h-10 p-1"
                                        />
                                        <span className="text-sm font-mono">{p.appearance.pendulumColor.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            ))}
        </div>
      </ScrollArea>
  );
}
