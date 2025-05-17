"use client";

import { Download, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareSaveActionsProps {
  photoDataUri: string;
  poem: string;
}

export function ShareSaveActions({ photoDataUri, poem }: ShareSaveActionsProps) {
  const { toast } = useToast();

  if (!photoDataUri || !poem) return null;

  const handleSavePoem = () => {
    const blob = new Blob([poem], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'poem.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Poem Saved", description: "The poem has been downloaded as poem.txt." });
  };

  const handleSaveImage = () => {
    const link = document.createElement('a');
    link.href = photoDataUri;
    // Extract extension or default to png
    const mimeType = photoDataUri.substring(photoDataUri.indexOf(':') + 1, photoDataUri.indexOf(';'));
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `photo.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Image Saved", description: `The image has been downloaded as photo.${extension}.` });
  };

  const handleShare = async () => {
    const shareText = `Check out this poem I generated with PoemSnap!\n\n${poem}`;
    if (navigator.share) {
      try {
        // Convert data URI to Blob to File
        const response = await fetch(photoDataUri);
        const blob = await mimeTypeToBlob(photoDataUri, (await response.blob()).type);
        const mimeType = photoDataUri.substring(photoDataUri.indexOf(':') + 1, photoDataUri.indexOf(';'));
        const extension = mimeType.split('/')[1] || 'png';
        const file = new File([blob], `poem_snap_image.${extension}`, { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
           await navigator.share({
            title: 'PoemSnap Creation',
            text: shareText,
            files: [file],
          });
          toast({ title: "Shared!", description: "Your creation has been shared."});
        } else {
          // Fallback if files cannot be shared, share text only
          await navigator.share({
            title: 'PoemSnap Creation',
            text: shareText,
          });
          toast({ title: "Shared!", description: "Poem text shared. Image sharing not fully supported on this browser/app."});
        }
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copy poem if sharing file fails or is cancelled
        copyPoemToClipboard();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyPoemToClipboard();
    }
  };
  
  const mimeTypeToBlob = async (dataURI: string, fallbackMimeType: string = 'application/octet-stream') => {
    const parts = dataURI.split(',');
    const meta = parts[0];
    const body = parts[1];
  
    let mimeType = fallbackMimeType;
    if (meta.includes(';base64')) {
      const mimePart = meta.split(':')[1].split(';')[0];
      if (mimePart) {
        mimeType = mimePart;
      }
    }
    
    const byteString = atob(body);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  }

  const copyPoemToClipboard = () => {
    navigator.clipboard.writeText(poem)
      .then(() => {
        toast({ title: "Poem Copied", description: "The poem has been copied to your clipboard." });
      })
      .catch(err => {
        console.error('Failed to copy poem: ', err);
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy poem to clipboard." });
      });
  };


  return (
    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in-0 duration-700">
      <Button onClick={handleSavePoem} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Save Poem
      </Button>
      <Button onClick={handleSaveImage} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Save Image
      </Button>
      <Button onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share Creation
      </Button>
       <Button onClick={copyPoemToClipboard} variant="ghost" size="icon" aria-label="Copy poem to clipboard">
        <Copy className="h-5 w-5" />
      </Button>
    </div>
  );
}
