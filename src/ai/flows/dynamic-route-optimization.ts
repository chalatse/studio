'use server';

/**
 * @fileOverview This file defines a Genkit flow for dynamic route optimization.
 *
 * - optimizeRoute - A function that optimizes a route based on real-time traffic, road closures, and user preferences.
 * - OptimizeRouteInput - The input type for the optimizeRoute function.
 * - OptimizeRouteOutput - The return type for the optimizeRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteInputSchema = z.object({
  startLocation: z.string().describe('The starting location for the route.'),
  endLocation: z.string().describe('The destination location for the route.'),
  currentTrafficConditions: z.string().describe('Real-time traffic conditions along the route.'),
  roadClosures: z.string().describe('Information about any road closures along the route.'),
  userPreferences: z.string().describe('User preferences for the route, such as avoiding highways or tolls.'),
});
export type OptimizeRouteInput = z.infer<typeof OptimizeRouteInputSchema>;

const OptimizeRouteOutputSchema = z.object({
  optimizedRoute: z.string().describe('The optimized route, including turn-by-turn directions.'),
  estimatedTravelTime: z.string().describe('The estimated travel time for the optimized route.'),
  routeSummary: z.string().describe('A summary of the optimized route, including distance and major landmarks.'),
});
export type OptimizeRouteOutput = z.infer<typeof OptimizeRouteOutputSchema>;

export async function optimizeRoute(input: OptimizeRouteInput): Promise<OptimizeRouteOutput> {
  return optimizeRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRoutePrompt',
  input: {schema: OptimizeRouteInputSchema},
  output: {schema: OptimizeRouteOutputSchema},
  prompt: `You are a route optimization expert. Given the following information, provide an optimized route to the destination.

Start Location: {{{startLocation}}}
End Location: {{{endLocation}}}
Current Traffic Conditions: {{{currentTrafficConditions}}}
Road Closures: {{{roadClosures}}}
User Preferences: {{{userPreferences}}}

Provide the optimized route, estimated travel time, and a route summary.
`,
});

const optimizeRouteFlow = ai.defineFlow(
  {
    name: 'optimizeRouteFlow',
    inputSchema: OptimizeRouteInputSchema,
    outputSchema: OptimizeRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
