
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Page } from '@/lib/types';

interface ActivePageViewProps {
  page: Page;
}

export default function ActivePageView({ page }: ActivePageViewProps) {
  if (!page) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a page to view.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="overflow-hidden shadow-xl rounded-xl w-full max-w-3xl my-auto aspect-[16/10] bg-card"> {/* Enforce aspect ratio */}
        <CardContent className="p-0 relative h-full">
          {page.type === 'blank' || !page.src ? (
            <div className="w-full h-full bg-white flex items-center justify-center">
              {/* Optionally, add a subtle cue like "Blank Page" or an icon for blank pages */}
              {/* <p className="text-muted-foreground text-lg">Whiteboard</p> */}
            </div>
          ) : (
            <Image
              src={page.src}
              alt={page.alt}
              layout="fill" // Use layout fill to respect parent's aspect ratio
              objectFit="contain" // was object-contain, changed to cover for better fit
              className="w-full h-full" // Ensure image takes full space of its container
              data-ai-hint={page.hint}
              priority={true}
            />
          )}
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-sm font-semibold px-3 py-1 rounded-md">
            {page.id}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    