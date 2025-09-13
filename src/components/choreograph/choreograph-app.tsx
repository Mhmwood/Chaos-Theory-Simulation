"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/choreograph/header";
import { ChoreographControls } from "@/components/choreograph/controls";
import { ChoreographCanvas, type Point } from "@/components/choreograph/canvas";
import { randomizeFractalAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

// A simple pseudo-random number generator for deterministic results from a seed
const mulberry32 = (a: number) => {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export const fractalParamsSchema = z.object({
  seed: z.coerce.number().min(0),
  iterations: z.coerce.number().min(1).max(12),
  angle: z.coerce.number().min(0).max(360),
  scale: z.coerce.number().min(0.1).max(1),
  controlPoints: z.array(z.object({ x: z.number(), y: z.number() })),
  colorPalette: z.array(z.string()),
});

export type FractalParams = z.infer<typeof fractalParamsSchema>;

const DEFAULT_PARAMS: FractalParams = {
  seed: 12345,
  iterations: 8,
  angle: 30,
  scale: 0.75,
  controlPoints: [
    { x: 0.4, y: 0.4 },
    { x: 0.6, y: 0.4 },
  ],
  colorPalette: ["#BE29EC", "#29A6EC", "#e9c46a", "#f4a261", "#e76f51"],
};

const BUTTERFLY_EFFECT_DELTA = 0.00001;

export function ChoreographApp() {
  const [params, setParams] = useState<FractalParams>(DEFAULT_PARAMS);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const ghostCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const form = useForm<Omit<FractalParams, 'controlPoints' | 'colorPalette'>>({
    resolver: zodResolver(fractalParamsSchema.omit({ controlPoints: true, colorPalette: true })),
    defaultValues: {
      seed: DEFAULT_PARAMS.seed,
      iterations: DEFAULT_PARAMS.iterations,
      angle: DEFAULT_PARAMS.angle,
      scale: DEFAULT_PARAMS.scale,
    },
    mode: "onBlur",
  });
  
  const ghostParams = useMemo<FractalParams>(() => ({
    ...params,
    seed: params.seed + BUTTERFLY_EFFECT_DELTA,
  }), [params]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
       if (type === 'change') {
        const validatedValues = fractalParamsSchema.omit({ controlPoints: true, colorPalette: true }).safeParse(value);
        if(validatedValues.success) {
            handleParamsChange(validatedValues.data);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);


  const handleParamsChange = (newValues: Partial<Omit<FractalParams, 'controlPoints' | 'colorPalette'>>) => {
    setParams(prev => ({...prev, ...newValues}));
  };

  const handleReset = () => {
    form.reset({
      seed: DEFAULT_PARAMS.seed,
      iterations: DEFAULT_PARAMS.iterations,
      angle: DEFAULT_PARAMS.angle,
      scale: DEFAULT_PARAMS.scale,
    });
    setParams(DEFAULT_PARAMS);
    toast({ title: "Pattern Reset", description: "The pattern has been reset to its default state." });
  };

  const handleRandomize = async () => {
    setIsRandomizing(true);
    try {
      const result = await randomizeFractalAction();
      if (result) {
        const random = mulberry32(result.seed);
        const newControlPoints = [
          { x: 0.2 + random() * 0.6, y: 0.2 + random() * 0.6 },
          { x: 0.2 + random() * 0.6, y: 0.2 + random() * 0.6 },
        ];
        
        const newParams: FractalParams = { ...result, controlPoints: newControlPoints };
        
        form.reset({
          seed: newParams.seed,
          iterations: newParams.iterations,
          angle: newParams.angle,
          scale: newParams.scale,
        });
        setParams(newParams);
        toast({ title: "Pattern Randomized!", description: "A new fractal pattern has been generated." });
      } else {
        throw new Error("AI did not return a result.");
      }
    } catch (error) {
      console.error("Randomization failed:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not generate a new pattern." });
    } finally {
      setIsRandomizing(false);
    }
  };

  const handleSaveImage = () => {
    const canvas = mainCanvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `choreograph-seed-${params.seed}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: "Image Saved", description: "The image has been downloaded." });
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4 p-4 min-h-0">
        <aside className="bg-card border rounded-lg p-4 flex flex-col gap-6 overflow-y-auto">
          <ChoreographControls
            form={form}
            onFormChange={handleParamsChange}
            onReset={handleReset}
            onRandomize={handleRandomize}
            onSaveImage={handleSaveImage}
            isRandomizing={isRandomizing}
          />
        </aside>
        <div className="grid md:grid-cols-2 gap-4 min-h-0">
            <section className="bg-card border rounded-lg overflow-hidden relative">
                <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-sm text-foreground">
                    Original
                </div>
                <ChoreographCanvas
                    ref={mainCanvasRef}
                    params={params}
                    onControlPointsChange={(newPoints: Point[]) => setParams(prev => ({ ...prev, controlPoints: newPoints }))}
                    interactive={true}
                />
            </section>
            <section className="bg-card border rounded-lg overflow-hidden relative">
                <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-md text-sm text-foreground z-10">
                   Ghost (Seed +{BUTTERFLY_EFFECT_DELTA})
                </div>
                <ChoreographCanvas
                    ref={ghostCanvasRef}
                    params={ghostParams}
                    onControlPointsChange={() => {}} // No-op
                    interactive={false}
                />
            </section>
        </div>
      </main>
    </div>
  );
}
