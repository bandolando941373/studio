'use server';

import { identifyRockFromImage } from '@/ai/flows/identify-rock-from-image';
import type { IdentifyRockFromImageOutput } from '@/ai/flows/identify-rock-from-image';

export async function identifyRock(
  photoDataUri: string
): Promise<{ success: true; data: IdentifyRockFromImageOutput } | { success: false; error: string }> {
  if (!photoDataUri) {
    return { success: false, error: 'Image data is missing.' };
  }

  try {
    const result = await identifyRockFromImage({ photoDataUri });
    if (!result || !result.identification) {
        return { success: false, error: 'Failed to identify the rock. The analysis returned no result.' };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during image analysis.';
    return { success: false, error: errorMessage };
  }
}
