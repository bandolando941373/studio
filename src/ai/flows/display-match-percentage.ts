'use server';

/**
 * @fileOverview Calculates and returns the match percentage for a rock identification.
 *
 * - displayMatchPercentage - A function that calculates the match percentage.
 * - DisplayMatchPercentageInput - The input type for the displayMatchPercentage function.
 * - DisplayMatchPercentageOutput - The return type for the displayMatchPercentage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayMatchPercentageInputSchema = z.object({
  imageAnalysis: z
    .string()
    .describe('The analysis of the uploaded image, containing identified traits.'),
  rockDatabase: z
    .string()
    .describe('A stringified JSON array representing the database of known rocks and their traits.'),
  identifiedRock: z.string().describe('The identified rock from the image.'),
});
export type DisplayMatchPercentageInput = z.infer<typeof DisplayMatchPercentageInputSchema>;

const DisplayMatchPercentageOutputSchema = z.object({
  matchPercentage: z
    .number()
    .describe(
      'The percentage indicating the confidence level of the rock identification.'
    ),
});
export type DisplayMatchPercentageOutput = z.infer<typeof DisplayMatchPercentageOutputSchema>;

export async function displayMatchPercentage(
  input: DisplayMatchPercentageInput
): Promise<DisplayMatchPercentageOutput> {
  return displayMatchPercentageFlow(input);
}

const displayMatchPercentagePrompt = ai.definePrompt({
  name: 'displayMatchPercentagePrompt',
  input: {schema: DisplayMatchPercentageInputSchema},
  output: {schema: DisplayMatchPercentageOutputSchema},
  prompt: `Given the image analysis: """{{imageAnalysis}}""", 
and the identified rock: """{{identifiedRock}}""",
and the rock database: """{{rockDatabase}}""",

calculate and return a match percentage that indicates the confidence level of the rock identification as a number between 0 and 100.
Consider the similarity of traits identified in the image analysis with the traits listed in the rock database for the identified rock.

Return ONLY the match percentage as a number with no other explanation or characters.
`,
});

const displayMatchPercentageFlow = ai.defineFlow(
  {
    name: 'displayMatchPercentageFlow',
    inputSchema: DisplayMatchPercentageInputSchema,
    outputSchema: DisplayMatchPercentageOutputSchema,
  },
  async input => {
    const {output} = await displayMatchPercentagePrompt(input);
    return output!;
  }
);
