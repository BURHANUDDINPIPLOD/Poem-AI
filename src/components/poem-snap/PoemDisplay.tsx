"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PoemDisplayProps {
  photoDataUri: string;
  poem: string;
}

export function PoemDisplay({ photoDataUri, poem }: PoemDisplayProps) {
  if (!photoDataUri || !poem) return null;

  return (
    <div className="mt-10 grid md:grid-cols-2 gap-8 items-start animate-in fade-in-0 duration-700">
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Your Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
            <Image
              src={photoDataUri}
              alt="Uploaded inspiration"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              data-ai-hint="uploaded photography"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Generated Poem</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="font-lora text-lg leading-relaxed whitespace-pre-line p-4 bg-primary/20 rounded-lg min-h-[200px] text-primary-foreground"
            aria-label="Generated poem"
          >
            {poem}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
