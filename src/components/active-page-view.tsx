
"use client";

import Image from 'next/image';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Page, DrawingPath, DrawingPoint } from '@/lib/types';

interface ActivePageViewProps {
  page: Page;
  penColor: string;
  penStrokeWidth: number;
  eraserSize: number; // New prop for eraser size
  activeToolId: string | null;
  onDrawingChange: (drawingData: DrawingPath[]) => void;
  isPenActive: boolean;
  isHighlighterActive: boolean;
  isEraserActive: boolean; // New prop
}

export default function ActivePageView({
  page,
  penColor,
  penStrokeWidth,
  eraserSize,
  activeToolId,
  onDrawingChange,
  isPenActive,
  isHighlighterActive,
  isEraserActive,
}: ActivePageViewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const transformContainerRef = React.useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = React.useState(false); // Combined state for drawing/erasing
  const [paths, setPaths] = React.useState<DrawingPath[]>(page.drawingData || []);

  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const [lastPanPosition, setLastPanPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    setPaths(page.drawingData || []);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [page.id, page.drawingData]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const parent = canvas.parentElement?.parentElement;
    if (parent) {
        // Set canvas physical dimensions once based on parent (unscaled)
        // This ensures drawing resolution remains consistent
        if (canvas.width !== parent.offsetWidth || canvas.height !== parent.offsetHeight) {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach(pathObj => {
      context.beginPath();
      context.strokeStyle = pathObj.color;
      context.lineWidth = pathObj.strokeWidth; // Logical stroke width
      context.globalAlpha = pathObj.isHighlighter ? 0.3 : 1.0;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      pathObj.points.forEach((point: DrawingPoint, index: number) => {
        // Denormalize points for rendering on the fixed-size canvas
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        if (index === 0) {
          context.moveTo(x,y);
        } else {
          context.lineTo(x,y);
        }
      });
      context.stroke();
    });
    context.globalAlpha = 1.0;

  }, [paths, page.id]); // Removed dependencies that don't affect canvas redrawing directly

  const getPointerPositionOnCanvas = (event: React.MouseEvent | React.TouchEvent): DrawingPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas || !transformContainerRef.current) return null;

    const { clientX, clientY } = getPointerPosition(event as React.MouseEvent); // Native clientX/Y
    const canvasRect = canvas.getBoundingClientRect(); // This is the *visual* rect of the canvas on screen

    // Pointer position relative to the visual canvas element
    const pointerXOnVisualCanvas = clientX - canvasRect.left;
    const pointerYOnVisualCanvas = clientY - canvasRect.top;
    
    // To get position on the logical, unscaled canvas, we divide by zoom
    // The canvas itself is not scaled, its parent is. So these coordinates are relative to the 0,0 of the canvas element itself.
    const logicalX = pointerXOnVisualCanvas / zoom;
    const logicalY = pointerYOnVisualCanvas / zoom;

    // Normalize coordinates (0-1 range) based on logical canvas dimensions
    const normX = logicalX / canvas.width;
    const normY = logicalY / canvas.height;

    return { x: normX, y: normY };
  };
  
  const getPointerPosition = (event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event && event.touches.length > 0) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    }
    return { clientX: (event as React.MouseEvent).clientX, clientY: (event as React.MouseEvent).clientY };
  };


  const startInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isPenActive || isHighlighterActive || isEraserActive) {
      const pos = getPointerPositionOnCanvas(event as React.MouseEvent);
      if (!pos) return;

      setIsInteracting(true);
      if (isPenActive || isHighlighterActive) {
        const newPath: DrawingPath = {
          color: penColor,
          strokeWidth: penStrokeWidth,
          isHighlighter: isHighlighterActive,
          points: [pos]
        };
        setPaths(prevPaths => [...prevPaths, newPath]);
      } else if (isEraserActive) {
        // Eraser starts modifying paths in the 'interact' function
        interact(event as React.MouseEvent);
      }
    } else { // Start Panning
      const { clientX, clientY } = getPointerPosition(event as React.MouseEvent);
      setIsPanning(true);
      setLastPanPosition({ x: clientX, y: clientY });
    }
  };

  const interact = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isInteracting) return;
    if (isPanning) { // Handle Panning
        const { clientX, clientY } = getPointerPosition(event as React.MouseEvent);
        const dx = clientX - lastPanPosition.x;
        const dy = clientY - lastPanPosition.y;
        setOffset(prevOffset => ({ x: prevOffset.x + dx, y: prevOffset.y + dy }));
        setLastPanPosition({ x: clientX, y: clientY });
        return;
    }


    const pos = getPointerPositionOnCanvas(event as React.MouseEvent);
    if (!pos) return;

    if (isPenActive || isHighlighterActive) {
      setPaths(prevPaths => {
        const updatedPaths = [...prevPaths];
        const currentPath = updatedPaths[updatedPaths.length - 1];
        if (currentPath) {
          currentPath.points.push(pos);
        }
        return updatedPaths;
      });
    } else if (isEraserActive) {
      setPaths(prevPaths => {
        const canvas = canvasRef.current;
        if (!canvas) return prevPaths;

        // Eraser size in normalized terms (relative to canvas width for simplicity)
        // This makes the eraser effect scale with zoom.
        const normalizedEraserRadius = (eraserSize / 2) / canvas.width;

        return prevPaths.filter(pathObj => {
          for (const point of pathObj.points) {
            const distance = Math.sqrt(Math.pow(point.x - pos.x, 2) + Math.pow(point.y - pos.y, 2));
            if (distance < normalizedEraserRadius + (pathObj.strokeWidth / (2 * canvas.width)) ) { // consider path stroke width too
              return false; // Remove this path
            }
          }
          return true; // Keep this path
        });
      });
    }
  };

  const stopInteraction = () => {
    if (isInteracting) {
        setIsInteracting(false);
        if (isPenActive || isHighlighterActive || isEraserActive) {
            onDrawingChange(paths); // Persist changes
        }
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
    const clampedZoom = Math.max(0.2, Math.min(newZoom, 5));

    const rect = transformContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

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
  
  let cursorStyle = 'grab';
  if (isPanning) cursorStyle = 'grabbing';
  else if (isPenActive || isHighlighterActive) cursorStyle = 'crosshair';
  else if (isEraserActive) cursorStyle = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${eraserSize * zoom}" height="${eraserSize * zoom}" viewBox="0 0 ${eraserSize} ${eraserSize}"><circle cx="${eraserSize/2}" cy="${eraserSize/2}" r="${eraserSize/2 -1}" fill="rgba(255,255,255,0.5)" stroke="black" stroke-width="1"/></svg>') ${eraserSize*zoom/2} ${eraserSize*zoom/2}, auto`;


  return (
    <div 
      className="flex justify-center items-start h-full overflow-hidden"
      onWheel={handleWheel} 
      onMouseDown={startInteraction}
      onMouseMove={interact}
      onMouseUp={stopInteraction}
      onMouseLeave={stopInteraction}
      onTouchStart={startInteraction}
      onTouchMove={interact}
      onTouchEnd={stopInteraction}
      style={{ cursor: cursorStyle }}
    >
      <Card className="overflow-hidden shadow-xl rounded-xl w-full max-w-3xl my-auto aspect-[16/10] bg-card relative">
        <CardContent className="p-0 relative h-full w-full overflow-hidden">
          <div
            ref={transformContainerRef}
            className="h-full w-full origin-top-left"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              // Cursor style is now on the parent div
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
                objectFit="contain"
                className="w-full h-full"
                data-ai-hint={page.hint}
                priority={true}
                draggable={false}
              />
            )}
            {/* Canvas is NOT scaled directly. Its parent is. Canvas draws at its native resolution. */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full touch-none"
              style={{ zIndex: 10 }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
