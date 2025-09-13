import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FractalParams } from "./choreograph-app";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RotateCw, Sparkles, Download, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type ControlProps = {
  form: UseFormReturn<Omit<FractalParams, 'controlPoints' | 'colorPalette'>>;
  onFormChange: (data: Partial<Omit<FractalParams, 'controlPoints' | 'colorPalette'>>) => void;
  onReset: () => void;
  onRandomize: () => void;
  onSaveImage: () => void;
  isRandomizing: boolean;
};

export function ChoreographControls({
  form,
  onFormChange,
  onReset,
  onRandomize,
  onSaveImage,
  isRandomizing,
}: ControlProps) {
  
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && name) {
        const fieldName = name as keyof Omit<FractalParams, 'controlPoints' | 'colorPalette'>;
        const singleValue = { [fieldName]: value[fieldName] };
        onFormChange(singleValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8 flex flex-col h-full">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-accent">Controls</h2>
          
          <FormField
            control={form.control}
            name="seed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seed</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="12345" {...field} onBlur={() => onFormChange(form.getValues())} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iterations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Iterations ({field.value})</FormLabel>
                <FormControl>
                    <Slider
                      min={1}
                      max={12}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="angle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Angle ({field.value}°)</FormLabel>
                <FormControl>
                    <Slider
                      min={0}
                      max={360}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scale ({field.value.toFixed(2)})</FormLabel>
                <FormControl>
                    <Slider
                      min={0.1}
                      max={1}
                      step={0.01}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-auto space-y-2 pt-6">
          <Button onClick={onRandomize} disabled={isRandomizing} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isRandomizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Randomize
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onReset} variant="outline" className="w-full">
              <RotateCw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={onSaveImage} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
