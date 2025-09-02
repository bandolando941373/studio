'use server';
/**
 * @fileOverview Identifies a rock from an image and provides information about it.
 *
 * - identifyRockFromImage - A function that handles the rock identification process.
 * - IdentifyRockFromImageInput - The input type for the identifyRockFromImage function.
 * - IdentifyRockFromImageOutput - The return type for the identifyRockFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyRockFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a rock or gem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyRockFromImageInput = z.infer<typeof IdentifyRockFromImageInputSchema>;

const IdentifyRockFromImageOutputSchema = z.object({
  identification: z.object({
    closestMatch: z.string().describe('The name of the closest matching rock or gem.'),
    similarityPercentage: z
      .number()
      .describe('The percentage of similarity to the closest match.'),
    information: z.string().describe('Detailed information about the identified rock.'),
  }),
});
export type IdentifyRockFromImageOutput = z.infer<typeof IdentifyRockFromImageOutputSchema>;

export async function identifyRockFromImage(
  input: IdentifyRockFromImageInput
): Promise<IdentifyRockFromImageOutput> {
  return identifyRockFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyRockFromImagePrompt',
  input: {schema: IdentifyRockFromImageInputSchema},
  output: {schema: IdentifyRockFromImageOutputSchema},
  prompt: `You are an expert geologist specializing in rock and gem identification.

You will analyze the provided image and identify the rock or gem.

Based on the image, determine the closest matching rock or gem from your extensive knowledge base.  Provide a percentage of similarity (confidence level).

Include detailed information about the identified rock, such as its composition, properties, and common uses.

Image: {{media url=photoDataUri}}
`,
});

const identifyRockFromImageFlow = ai.defineFlow(
  {
    name: 'identifyRockFromImageFlow',
    inputSchema: IdentifyRockFromImageInputSchema,
    outputSchema: IdentifyRockFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
