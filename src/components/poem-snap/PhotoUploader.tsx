"use client";

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generatePoemAction } from '@/actions/generatePoemAction';

interface PhotoUploaderProps {
  onPoemGenerated: (data: { poem: string; photoPreview: string }) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  initialPhotoPreview?: string | null;
}

const initialState = {
  poem: undefined,
  photoPreview: undefined,
  error: undefined,
  timestamp: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        "Generate Poem"
      )}
    </Button>
  );
}

export function PhotoUploader({ onPoemGenerated, onLoadingChange, onError, initialPhotoPreview }: PhotoUploaderProps) {
  const [state, formAction] = useFormState(generatePoemAction, initialState);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhotoPreview || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoDataUriRef = useRef<HTMLInputElement>(null);

  const { pending } = useFormStatus();

  useEffect(() => {
    onLoadingChange(pending);
  }, [pending, onLoadingChange]);

  useEffect(() => {
    if (state?.timestamp) { // Check timestamp to ensure this runs only on new state
      if (state.error) {
        onError(state.error);
      } else if (state.poem && state.photoPreview) {
        onPoemGenerated({ poem: state.poem, photoPreview: state.photoPreview });
        onError(null); // Clear previous errors
      }
    }
  }, [state, onPoemGenerated, onError]);
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onError('Please upload a valid image file (e.g., JPG, PNG, GIF).');
        setPhotoPreview(null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        if (photoDataUriRef.current) photoDataUriRef.current.value = "";
        return;
      }
      onError(null); // Clear error if a valid file type is selected
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPhotoPreview(dataUri);
        if (photoDataUriRef.current) {
          photoDataUriRef.current.value = dataUri;
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      setFileName(null);
      if (photoDataUriRef.current) {
         photoDataUriRef.current.value = "";
      }
    }
  };

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Upload Your Photo</CardTitle>
        <CardDescription>Let our AI craft a unique poem inspired by your image.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="photoFile" className="text-base">Choose an image file</Label>
            <div className="flex items-center gap-4">
              <Input
                id="photoFile"
                name="photoFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-sm text-foreground
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-primary file:text-primary-foreground
                           hover:file:bg-primary/90
                           cursor-pointer"
              />
            </div>
            {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
          </div>

          {photoPreview && (
            <div className="mt-4 p-4 border border-dashed rounded-lg bg-muted/50 animate-in fade-in duration-500">
              <p className="text-sm font-medium mb-2 text-center">Image Preview:</p>
              <div className="relative w-full aspect-video mx-auto max-w-md rounded-md overflow-hidden shadow-md">
                <Image
                  src={photoPreview}
                  alt="Photo preview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
            </div>
          )}
          
          <input type="hidden" name="photoDataUri" ref={photoDataUriRef} />

          {state?.error && !pending && (
            <Alert variant="destructive" className="animate-in fade-in duration-300">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end pt-2">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
