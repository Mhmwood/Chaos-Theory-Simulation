"use server";

import { randomizePattern, type RandomizePatternOutput } from "@/ai/flows/randomize-pattern";

export async function randomizeFractalAction(): Promise<RandomizePatternOutput | null> {
  try {
    const result = await randomizePattern();
    return result;
  } catch (error) {
    console.error("Error in randomizeFractalAction:", error);
    // In a real app, you might want to throw a more specific error
    // or return a value indicating failure.
    return null;
  }
}
