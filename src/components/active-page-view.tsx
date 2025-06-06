
"use client";

import Image from 'next/image';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Page } from '@/lib/types';

interface ActivePageViewProps {
  page: Page;
  penColor: string;
  penStrokeWidth: number;
  activeToolId: string | null;
  onDrawingChange: (drawingData: any[]) => void; // For now, 'any[]', define properly later
  isPenActive: boolean;
  isHighlighterActive: boolean;
}

export default function ActivePageView({
  page,
  penColor,
  penStrokeWidth,
  activeToolId,
  onDrawingChange,
  isPenActive,
  isHighlighterActive
}: ActivePageViewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [paths, setPaths] = React.useState<any[]>(page.drawingData || []); // Load existing drawing data

  React.useEffect(() => {
    setPaths(page.drawingData || []); // Update paths when page changes
  }, [page.id, page.drawingData]);


  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions based on its parent to maintain aspect ratio
    const parent = canvas.parentElement;
    if (parent) {
        // Ensure canvas fills the card, which has aspect ratio
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }


    // Redraw paths
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    paths.forEach(pathObj => {
      context.beginPath();
      context.strokeStyle = pathObj.color;
      context.lineWidth = pathObj.strokeWidth;
      context.globalAlpha = pathObj.isHighlighter ? 0.3 : 1.0; // Highlighter effect
      pathObj.points.forEach((point: {x:number, y:number}, index: number) => {
        if (index === 0) {
          context.moveTo(point.x * canvas.width, point.y * canvas.height);
        } else {
          context.lineTo(point.x * canvas.width, point.y * canvas.height);
        }
      });
      context.stroke();
    });
    context.globalAlpha = 1.0; // Reset globalAlpha

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, page.id, penColor, penStrokeWidth]); // Redraw when paths, page, or pen settings change

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeToolId !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.type === 'mousedown' ? (event as React.MouseEvent).clientX : (event as React.TouchEvent).touches[0].clientX) - rect.left;
    const y = (event.type === 'mousedown' ? (event as React.MouseEvent).clientY : (event as React.TouchEvent).touches[0].clientY) - rect.top;
    
    // Normalize coordinates
    const normX = x / canvas.width;
    const normY = y / canvas.height;

    setIsDrawing(true);
    const newPath = {
      color: penColor,
      strokeWidth: penStrokeWidth,
      isHighlighter: isHighlighterActive,
      points: [{ x: normX, y: normY }]
    };
    setPaths(prevPaths => [...prevPaths, newPath]);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeToolId !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.type === 'mousemove' ? (event as React.MouseEvent).clientX : (event as React.TouchEvent).touches[0].clientX) - rect.left;
    const y = (event.type === 'mousemove' ? (event as React.MouseEvent).clientY : (event as React.TouchEvent).touches[0].clientY) - rect.top;

    const normX = x / canvas.width;
    const normY = y / canvas.height;

    setPaths(prevPaths => {
      const updatedPaths = [...prevPaths];
      const currentPath = updatedPaths[updatedPaths.length - 1];
      if (currentPath) {
        currentPath.points.push({ x: normX, y: normY });
      }
      return updatedPaths;
    });
  };

  const stopDrawing = () => {
    if (isDrawing) {
        setIsDrawing(false);
        onDrawingChange(paths); // Save the drawing data to the page
    }
  };


  if (!page) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a page to view.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start h-full">
      <Card className="overflow-hidden shadow-xl rounded-xl w-full max-w-3xl my-auto aspect-[16/10] bg-card relative">
        <CardContent className="p-0 relative h-full w-full">
          {page.type === 'blank' || !page.src ? (
            <div className="w-full h-full bg-white flex items-center justify-center">
              {/* Whiteboard area */}
            </div>
          ) : (
            <Image
              src={page.src}
              alt={page.alt}
              layout="fill"
              objectFit="contain"
              className="w-full h-full"
              data-ai-hint={page.hint}
              priority={true}
            />
          )}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing} // Stop drawing if mouse leaves canvas
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute top-0 left-0 w-full h-full touch-none" // touch-none to prevent page scroll on touch devices
            style={{ zIndex: 10 }} // Ensure canvas is on top
          />
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-sm font-semibold px-3 py-1 rounded-md z-20">
            {page.id}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
