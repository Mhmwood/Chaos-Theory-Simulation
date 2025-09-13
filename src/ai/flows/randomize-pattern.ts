// randomize-pattern.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a randomized fractal pattern.
 *
 * The flow takes no input and returns a set of randomized parameters suitable for generating a fractal pattern.
 * This leverages the GenAI to produce a new and unexpected pattern.
 *
 * @function randomizePattern - The main function to trigger the flow.
 * @typedef {RandomizePatternOutput} RandomizePatternOutput - The output type of the flow, containing the randomized parameters.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RandomizePatternOutputSchema = z.object({
  seed: z.number().describe('A seed value for the random number generator.'),
  scale: z.number().describe('The scale of the fractal pattern.'),
  iterations: z.number().describe('The number of iterations to perform when generating the fractal.'),
  angle: z.number().describe('The angle used in the fractal generation.'),
  colorPalette: z.array(z.string()).describe('An array of color hex codes to use for the fractal pattern.'),
});

export type RandomizePatternOutput = z.infer<typeof RandomizePatternOutputSchema>;

export async function randomizePattern(): Promise<RandomizePatternOutput> {
  return randomizePatternFlow();
}

const randomizePatternPrompt = ai.definePrompt({
  name: 'randomizePatternPrompt',
  output: {schema: RandomizePatternOutputSchema},
  prompt: `You are an expert fractal pattern generator.

  Generate a set of parameters that can be used to create a new and interesting fractal pattern.
  Return the parameters as a JSON object that conforms to the RandomizePatternOutputSchema schema.

  Be creative and generate unexpected results.
  The colorPalette should be a colorful selection of hex codes.
  Consider creating palettes from https://coolors.co/.
  Ensure all values are in reasonable ranges for fractal generation (e.g., iterations between 5 and 20, angle between 0 and 360).

  Example color palette: ["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"]`,
});

const randomizePatternFlow = ai.defineFlow({
  name: 'randomizePatternFlow',
  outputSchema: RandomizePatternOutputSchema,
}, async () => {
  const {output} = await randomizePatternPrompt({});
  return output!;
});
