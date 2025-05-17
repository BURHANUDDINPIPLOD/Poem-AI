"use client";

import { useState, useEffect } from 'react';
import { PhotoUploader } from '@/components/poem-snap/PhotoUploader';
import { PoemDisplay } from '@/components/poem-snap/PoemDisplay';
import { ShareSaveActions } from '@/components/poem-snap/ShareSaveActions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface PoemData {
  poem: string;
  photoPreview: string;
}

export default function PoemSnapPage() {
  const [poemData, setPoemData] = useState<PoemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const handlePoemGenerated = (data: PoemData) => {
    setPoemData(data);
    setError(null); // Clear previous errors
    setIsLoading(false);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null); // Clear error when loading starts
      // Optionally clear previous poem data or show a specific loading state for the poem display
      // setPoemData(null); 
    }
  };
  
  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
    setIsLoading(false);
    if (errorMessage) {
      setPoemData(null); // Clear poem data on new error
    }
  };

  if (!clientReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
        <p className="mt-4 text-lg text-foreground">Loading PoemSnap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30 py-8 sm:py-12">
      <main className="container mx-auto max-w-3xl px-4">
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground via-purple-500 to-pink-500 font-lora">
            PoemSnap
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-muted-foreground">
            Transform your photos into captivating poetry with the magic of AI.
          </p>
        </header>

        <PhotoUploader 
          onPoemGenerated={handlePoemGenerated} 
          onLoadingChange={handleLoadingChange}
          onError={handleError}
          initialPhotoPreview={poemData?.photoPreview}
        />

        {isLoading && (
          <div className="mt-10 flex flex-col items-center justify-center text-center p-6 bg-card rounded-xl shadow-lg animate-pulse">
            <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Crafting your poem... please wait.
            </p>
            <p className="text-sm text-muted-foreground">This may take a few moments.</p>
          </div>
        )}

        {error && !isLoading && (
           <Alert variant="destructive" className="mt-10 animate-in fade-in duration-300">
            <AlertTitle className="font-semibold">An Error Occurred</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {poemData && !isLoading && !error && (
          <>
            <PoemDisplay photoDataUri={poemData.photoPreview} poem={poemData.poem} />
            <ShareSaveActions photoDataUri={poemData.photoPreview} poem={poemData.poem} />
          </>
        )}
      </main>
      <footer className="text-center mt-12 py-6 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Powered by AI &nbsp;&bull;&nbsp; Created with Next.js & ShadCN UI
        </p>
      </footer>
    </div>
  );
}
