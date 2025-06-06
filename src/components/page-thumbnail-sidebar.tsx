
"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Page } from "@/lib/types";

interface PageThumbnailItemProps {
  page: Page;
  index: number;
  currentPageIndex: number;
  onPageSelect: (index: number) => void;
}

const PageThumbnailItem: React.FC<PageThumbnailItemProps> = ({ page, index, currentPageIndex, onPageSelect }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  // Store measured dimensions in state to trigger canvas redraw
  const [measuredDimensions, setMeasuredDimensions] = React.useState<{width: number, height: number} | null>(null);

  // Measure the container
  React.useLayoutEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth > 0 && offsetHeight > 0) {
        setMeasuredDimensions({ width: offsetWidth, height: offsetHeight });
      }
    }
  }, []); // Runs once on mount, or if containerRef itself were to change

  // Draw on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !page.drawingData || page.drawingData.length === 0 || !measuredDimensions) {
      // If there's no drawing data or dimensions, ensure canvas is clear
      if (canvas && measuredDimensions) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, measuredDimensions.width, measuredDimensions.height);
        }
      }
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    const { width, height } = measuredDimensions;
    // Set canvas drawing surface size
    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);

    page.drawingData.forEach(pathObj => {
      context.beginPath();
      context.strokeStyle = pathObj.color;
      
      // Scale strokeWidth for thumbnail.
      // Assume main canvas reference width is roughly 800px for scaling.
      const mainCanvasReferenceWidth = 800; // This might need to be dynamic or a prop if main canvas size changes significantly
      const scaleFactor = width / mainCanvasReferenceWidth;
      context.lineWidth = Math.max(0.5, pathObj.strokeWidth * scaleFactor); // Ensure min line width
      context.globalAlpha = pathObj.isHighlighter ? 0.3 : 1.0;

      pathObj.points.forEach((point, pointIndex) => {
        // Points are normalized (0-1). Multiply by thumbnail canvas dimensions.
        const x = point.x * width;
        const y = point.y * height;
        if (pointIndex === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();
    });
    context.globalAlpha = 1.0; // Reset globalAlpha

  }, [page.drawingData, page.id, measuredDimensions]); // Redraw if drawing data, page, or dimensions change

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full h-auto p-2 border-2 rounded-lg flex flex-col items-center justify-center space-y-1",
        currentPageIndex === index
          ? "border-primary ring-2 ring-primary ring-offset-2"
          : "border-border hover:border-primary/70"
      )}
      onClick={() => onPageSelect(index)}
    >
      <div ref={containerRef} className="w-full aspect-[16/10] bg-muted rounded-md overflow-hidden relative">
        {page.type === 'blank' || !page.src ? (
          <div className="w-full h-full bg-white border border-dashed border-muted-foreground/50"></div>
        ) : (
          <Image
            src={page.src}
            alt={page.alt}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            data-ai-hint={page.hint}
            // Removed priority={true} as it's generally for LCP
          />
        )}
        {/* Canvas for drawing preview */}
        {(page.drawingData && page.drawingData.length > 0) && (
           <canvas
            ref={canvasRef}
            // width/height attributes are set in useEffect based on measuredDimensions
            className="absolute top-0 left-0 w-full h-full pointer-events-none" 
          />
        )}
         <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded-sm">
          {index + 1}
        </div>
      </div>
    </Button>
  );
};


interface PageThumbnailSidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pages: Page[];
  currentPageIndex: number;
  onPageSelect: (index: number) => void;
  onAddBlankPage: () => void;
}

export default function PageThumbnailSidebar({
  isOpen,
  onOpenChange,
  pages,
  currentPageIndex,
  onPageSelect,
  onAddBlankPage,
}: PageThumbnailSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 sm:w-80 p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle>Pages</SheetTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  onAddBlankPage();
                  onOpenChange(true); 
                }}
                aria-label="Add new page"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {pages.map((page, index) => (
              <PageThumbnailItem
                key={page.id} 
                page={page}
                index={index}
                currentPageIndex={currentPageIndex}
                onPageSelect={onPageSelect}
              />
            ))}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
                onAddBlankPage();
                onOpenChange(true); 
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Blank Page
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
    
