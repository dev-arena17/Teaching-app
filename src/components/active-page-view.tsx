
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
      <Card className="overflow-hidden shadow-xl rounded-xl w-full max-w-3xl my-auto">
        <CardContent className="p-0 relative">
          <Image
            src={page.src || `https://placehold.co/800x600.png?text=Page+${page.id}`}
            alt={page.alt}
            width={800} // Fixed width for the main view, adjust as needed
            height={600} // Fixed height for the main view, adjust as needed
            className="w-full h-auto object-contain" // object-contain to see whole image
            data-ai-hint={page.hint}
            priority={true} // Prioritize loading the current page image
          />
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-sm font-semibold px-3 py-1 rounded-md">
            {page.id}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
