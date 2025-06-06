
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
  onDrawingChange: (drawingData: any[]) => void;
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
  const transformContainerRef = React.useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [paths, setPaths] = React.useState<any[]>(page.drawingData || []);

  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const [lastPanPosition, setLastPanPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    setPaths(page.drawingData || []);
    // Reset zoom and pan when page changes
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [page.id, page.drawingData]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const parent = canvas.parentElement?.parentElement; // The CardContent
    if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach(pathObj => {
      context.beginPath();
      context.strokeStyle = pathObj.color;
      context.lineWidth = pathObj.strokeWidth; // This strokeWidth is already effectively "scaled" by the zoom on the container
      context.globalAlpha = pathObj.isHighlighter ? 0.3 : 1.0;
      pathObj.points.forEach((point: {x:number, y:number}, index: number) => {
        if (index === 0) {
          context.moveTo(point.x * canvas.width, point.y * canvas.height);
        } else {
          context.lineTo(point.x * canvas.width, point.y * canvas.height);
        }
      });
      context.stroke();
    });
    context.globalAlpha = 1.0;

  }, [paths, page.id, penColor, penStrokeWidth, zoom, offset]); // Redraw on zoom/pan as well if needed, though canvas content itself isn't scaled here

  const getPointerPosition = (event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    }
    return { clientX: event.clientX, clientY: event.clientY };
  };

  const startDrawing = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activeToolId === 'pen') {
      const { clientX, clientY } = getPointerPosition(event as React.MouseEvent); // Cast needed for getPointerPosition
      const rect = canvas.getBoundingClientRect(); // This rect is of the *scaled* canvas element

      // Adjust pointer position for current zoom and offset to get coordinates on the unscaled canvas
      const pointerXOnCanvasElement = clientX - rect.left;
      const pointerYOnCanvasElement = clientY - rect.top;

      const xOnUnscaledCanvas = pointerXOnCanvasElement / zoom;
      const yOnUnscaledCanvas = pointerYOnCanvasElement / zoom;
      
      const normX = xOnUnscaledCanvas / canvas.width;
      const normY = yOnUnscaledCanvas / canvas.height;

      setIsDrawing(true);
      const newPath = {
        color: penColor,
        strokeWidth: penStrokeWidth, // Store the logical stroke width
        isHighlighter: isHighlighterActive,
        points: [{ x: normX, y: normY }]
      };
      setPaths(prevPaths => [...prevPaths, newPath]);
    } else {
      // Start Panning
      const { clientX, clientY } = getPointerPosition(event as React.MouseEvent);
      setIsPanning(true);
      setLastPanPosition({ x: clientX, y: clientY });
    }
  };

  const draw = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDrawing && activeToolId === 'pen') {
      const { clientX, clientY } = getPointerPosition(event as React.MouseEvent);
      const rect = canvas.getBoundingClientRect();

      const pointerXOnCanvasElement = clientX - rect.left;
      const pointerYOnCanvasElement = clientY - rect.top;

      const xOnUnscaledCanvas = pointerXOnCanvasElement / zoom;
      const yOnUnscaledCanvas = pointerYOnCanvasElement / zoom;

      const normX = xOnUnscaledCanvas / canvas.width;
      const normY = yOnUnscaledCanvas / canvas.height;

      setPaths(prevPaths => {
        const updatedPaths = [...prevPaths];
        const currentPath = updatedPaths[updatedPaths.length - 1];
        if (currentPath) {
          currentPath.points.push({ x: normX, y: normY });
        }
        return updatedPaths;
      });
    } else if (isPanning) {
      const { clientX, clientY } = getPointerPosition(event as React.MouseEvent);
      const dx = clientX - lastPanPosition.x;
      const dy = clientY - lastPanPosition.y;
      setOffset(prevOffset => ({ x: prevOffset.x + dx, y: prevOffset.y + dy }));
      setLastPanPosition({ x: clientX, y: clientY });
    }
  };

  const stopDrawingOrPanning = () => {
    if (isDrawing) {
        setIsDrawing(false);
        onDrawingChange(paths);
    }
    if (isPanning) {
        setIsPanning(false);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const transformContainer = transformContainerRef.current;
    if (!transformContainer) return;

    const zoomFactor = 1.1;
    const newZoom = event.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    const clampedZoom = Math.max(0.2, Math.min(newZoom, 5)); // Clamp zoom level

    const rect = transformContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Mouse position relative to the container
    const mouseY = event.clientY - rect.top;

    // Calculate new offset to zoom towards the cursor
    // (offsetX - mouseX) is the vector from mouse to origin of content
    // This vector needs to be scaled by (newZoom / zoom)
    // Then add mouseX back to get new origin position relative to viewport
    const newOffsetX = mouseX - (mouseX - offset.x) * (clampedZoom / zoom);
    const newOffsetY = mouseY - (mouseY - offset.y) * (clampedZoom / zoom);
    
    setZoom(clampedZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a page to view.</p>
      </div>
    );
  }

  return (
    <div 
      className="flex justify-center items-start h-full overflow-hidden" // Added overflow-hidden
      onWheel={handleWheel} 
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawingOrPanning}
      onMouseLeave={stopDrawingOrPanning} // Stop panning if mouse leaves
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawingOrPanning}
    >
      <Card className="overflow-hidden shadow-xl rounded-xl w-full max-w-3xl my-auto aspect-[16/10] bg-card relative">
        <CardContent className="p-0 relative h-full w-full overflow-hidden"> {/* Added overflow-hidden here as well */}
          <div
            ref={transformContainerRef}
            className="h-full w-full origin-top-left" // origin-top-left is important for scale and translate
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              cursor: activeToolId === 'pen' ? 'crosshair' : (isPanning ? 'grabbing' : 'grab')
            }}
          >
            {page.type === 'blank' || !page.src ? (
              <div className="w-full h-full bg-white flex items-center justify-center">
                {/* Whiteboard area */}
              </div>
            ) : (
              <Image
                src={page.src}
                alt={page.alt}
                layout="fill"
                objectFit="contain" // 'contain' ensures the whole image is visible, 'cover' would fill and crop
                className="w-full h-full" // Ensure image fills the transformed container
                data-ai-hint={page.hint}
                priority={true}
                draggable={false} // Prevent browser's default image drag
              />
            )}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full touch-none"
              style={{ zIndex: 10 }} // Ensure canvas is on top
              // Event handlers are moved to the parent div for unified pan/draw logic
            />
          </div>
          {/* Removed the page ID display from here */}
        </CardContent>
      </Card>
    </div>
  );
}
