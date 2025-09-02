"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, FileImage, Loader, AlertCircle, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { identifyRock } from '@/app/actions';
import type { IdentifyRockFromImageOutput } from '@/ai/flows/identify-rock-from-image';

export function RockIdentifier() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentifyRockFromImageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleIdentify = async () => {
    if (!file || !previewUrl) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please select an image file to identify.',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const response = await identifyRock(previewUrl as string);

    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
      toast({
        variant: 'destructive',
        title: 'Identification Failed',
        description: response.error,
      });
    }

    setLoading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Upload a Rock or Gem Image</CardTitle>
          <CardDescription>
            Let our AI geologist analyze your image and identify the specimen.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {previewUrl ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
              <Image src={previewUrl} alt="Image preview" fill style={{ objectFit: 'contain' }} data-ai-hint="rock gem" />
            </div>
          ) : (
            <div
              className="w-full aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/10 hover:border-primary transition-colors cursor-pointer"
              onClick={handleUploadClick}
            >
              <FileImage className="w-16 h-16 mb-4" />
              <p>Click to upload an image</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            {previewUrl && <Button variant="ghost" onClick={clearSelection}>Clear</Button>}
            <Button onClick={handleIdentify} disabled={!file || loading} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {loading ? (
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Analyzing...' : 'Identify'}
            </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !result && (
        <div className="flex flex-col items-center gap-4 text-center">
            <Loader className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-semibold">Our AI is examining your specimen... this may take a moment.</p>
        </div>
      )}

      {result && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">{result.identification.closestMatch}</CardTitle>
            <CardDescription>Here is the analysis of your uploaded image.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Similarity Match</h3>
                <span className="text-lg font-bold text-primary">
                  {Math.round(result.identification.similarityPercentage)}%
                </span>
              </div>
              <Progress value={result.identification.similarityPercentage} className="h-3" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Information</h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {result.identification.information}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
