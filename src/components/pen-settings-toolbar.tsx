
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Highlighter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PenSettingsToolbarProps {
  penColor: string;
  setPenColor: (color: string) => void;
  penStrokeWidth: number;
  setPenStrokeWidth: (width: number) => void;
  activePenSubTool: 'pen' | 'highlighter';
  setActivePenSubTool: (tool: 'pen' | 'highlighter') => void;
  availableColors: string[];
  availableStrokeWidths: number[];
  onClose: () => void;
}

// Color Conversion Utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (result) {
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
  }
  const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex.trim());
  if (shortResult) {
    return {
        r: parseInt(shortResult[1] + shortResult[1], 16),
        g: parseInt(shortResult[2] + shortResult[2], 16),
        b: parseInt(shortResult[3] + shortResult[3], 16),
    }
  }
  return null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  s /= 100; v /= 100; 
  let r = 0, g = 0, b = 0;
  const i = Math.floor((h / 360) * 6);
  const f = (h / 360) * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};


export default function PenSettingsToolbar({
  penColor,
  setPenColor,
  penStrokeWidth,
  setPenStrokeWidth,
  activePenSubTool,
  setActivePenSubTool,
  availableColors,
  availableStrokeWidths,
  onClose,
}: PenSettingsToolbarProps) {
  const { toast } = useToast();
  const [isColorPickerDialogOpen, setIsColorPickerDialogOpen] = React.useState(false);
  
  const [initialColorDialog, setInitialColorDialog] = React.useState(penColor);
  const [currentHue, setCurrentHue] = React.useState(0);
  const [currentSaturation, setCurrentSaturation] = React.useState(100);
  const [currentValue, setCurrentValue] = React.useState(100);
  const [currentHexInput, setCurrentHexInput] = React.useState(penColor);

  const svPickerRef = React.useRef<HTMLDivElement>(null);
  const hueSliderRef = React.useRef<HTMLDivElement>(null);

  // Sync HSV from penColor when dialog opens
  React.useEffect(() => {
    if (isColorPickerDialogOpen) {
      setInitialColorDialog(penColor);
      setCurrentHexInput(penColor);
      const rgb = hexToRgb(penColor);
      if (rgb) {
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setCurrentHue(hsv.h);
        setCurrentSaturation(hsv.s);
        setCurrentValue(hsv.v);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isColorPickerDialogOpen]); // penColor intentionally omitted to not reset dialog on external penColor change while open

  // Sync Hex from HSV
  React.useEffect(() => {
    const rgb = hsvToRgb(currentHue, currentSaturation, currentValue);
    setCurrentHexInput(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [currentHue, currentSaturation, currentValue]);


  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setCurrentHexInput(newHex);
    const rgb = hexToRgb(newHex);
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setCurrentHue(hsv.h);
      setCurrentSaturation(hsv.s);
      setCurrentValue(hsv.v);
    }
  };

  const updateSvFromEvent = (e: MouseEvent | React.MouseEvent<HTMLDivElement>, rect: DOMRect) => {
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    setCurrentSaturation(Math.round((x / rect.width) * 100));
    setCurrentValue(Math.round(100 - (y / rect.height) * 100));
  };
  
  const handleSvPickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!svPickerRef.current) return;
    const rect = svPickerRef.current.getBoundingClientRect();
    updateSvFromEvent(e, rect);

    const onMouseMove = (moveEvent: MouseEvent) => updateSvFromEvent(moveEvent, rect);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };


  const updateHueFromEvent = (e: MouseEvent | React.MouseEvent<HTMLDivElement>, rect: DOMRect) => {
    let y = e.clientY - rect.top;
    y = Math.max(0, Math.min(y, rect.height));
    setCurrentHue(Math.round((y / rect.height) * 360));
  };

  const handleHueSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    updateHueFromEvent(e, rect);

    const onMouseMove = (moveEvent: MouseEvent) => updateHueFromEvent(moveEvent, rect);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };


  const isValidHexColor = (color: string): boolean => {
    return hexToRgb(color) !== null;
  };

  const handleCustomColorApply = () => {
    if (isValidHexColor(currentHexInput)) {
      setPenColor(currentHexInput);
      setIsColorPickerDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Color",
        description: "Please enter a valid hex color code (e.g., #RRGGBB or #RGB).",
      });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset to initial state of dialog if cancelled
      const rgb = hexToRgb(initialColorDialog);
      if (rgb) {
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setCurrentHue(hsv.h);
        setCurrentSaturation(hsv.s);
        setCurrentValue(hsv.v);
        setCurrentHexInput(initialColorDialog);
      }
    }
    setIsColorPickerDialogOpen(open);
  }

  const svPickerWidth = svPickerRef.current?.offsetWidth || 150;
  const svPickerHeight = svPickerRef.current?.offsetHeight || 150;
  const hueSliderHeight = hueSliderRef.current?.offsetHeight || 150;

  const svHandleX = (currentSaturation / 100) * svPickerWidth;
  const svHandleY = (1 - currentValue / 100) * svPickerHeight;
  const hueHandleY = (currentHue / 360) * hueSliderHeight;

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-sm px-4 sm:max-w-md">
      <Card className="shadow-2xl rounded-xl">
        <CardContent className="p-3 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Button
                variant={activePenSubTool === 'pen' ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-lg"
                onClick={() => setActivePenSubTool('pen')}
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant={activePenSubTool === 'highlighter' ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-lg"
                onClick={() => setActivePenSubTool('highlighter')}
              >
                <Highlighter className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          <div className="flex justify-around items-center gap-1">
            {availableColors.map((color) => (
              <Button
                key={color}
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full border-2",
                  penColor === color ? "ring-2 ring-offset-2 ring-primary" : "hover:ring-1 hover:ring-muted-foreground"
                )}
                style={{ backgroundColor: color }}
                onClick={() => setPenColor(color)}
                aria-label={`Set pen color to ${color}`}
              />
            ))}
            <Dialog open={isColorPickerDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                 <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 flex items-center justify-center" aria-label="More colors">
                    <svg width="20" height="20" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="grad1_pen_settings" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{stopColor:'red',stopOpacity:1}} />
                            <stop offset="20%" style={{stopColor:'yellow',stopOpacity:1}} />
                            <stop offset="40%" style={{stopColor:'lime',stopOpacity:1}} />
                            <stop offset="60%" style={{stopColor:'cyan',stopOpacity:1}} />
                            <stop offset="80%" style={{stopColor:'blue',stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:'magenta',stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="url(#grad1_pen_settings)" />
                    </svg>
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[300px]">
                <DialogHeader>
                  <DialogTitle>Choose color</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex space-x-3">
                    {/* SV Picker */}
                    <div
                      ref={svPickerRef}
                      className="relative w-[150px] h-[150px] cursor-crosshair rounded-sm overflow-hidden border"
                      style={{ backgroundColor: `hsl(${currentHue}, 100%, 50%)` }}
                      onMouseDown={handleSvPickerMouseDown}
                    >
                      <div className="absolute inset-0 w-full h-full" style={{ background: 'linear-gradient(to right, white, transparent)' }} />
                      <div className="absolute inset-0 w-full h-full" style={{ background: 'linear-gradient(to top, black, transparent)' }} />
                      <div
                        className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ 
                            left: `${Math.min(svPickerWidth, Math.max(0,svHandleX))}px`, 
                            top: `${Math.min(svPickerHeight, Math.max(0, svHandleY))}px`, 
                            backgroundColor: currentHexInput 
                        }}
                      />
                    </div>
                    {/* Hue Slider */}
                    <div
                      ref={hueSliderRef}
                      className="relative w-[20px] h-[150px] cursor-pointer rounded-sm overflow-hidden border"
                      style={{ background: 'linear-gradient(to bottom, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)' }}
                      onMouseDown={handleHueSliderMouseDown}
                    >
                       <div
                        className="absolute w-full h-1.5 border-y border-gray-600 bg-white/50 shadow-md transform -translate-y-1/2 pointer-events-none"
                        style={{ 
                            left: 0, 
                            top: `${Math.min(hueSliderHeight, Math.max(0,hueHandleY))}px`
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded border" style={{ backgroundColor: currentHexInput }} />
                    <div className="w-10 h-10 rounded border" style={{ backgroundColor: initialColorDialog }} />
                    <Input
                      id="customColorHex"
                      value={currentHexInput}
                      onChange={handleHexInputChange}
                      className="h-10 flex-1"
                      placeholder="#RRGGBB"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={handleCustomColorApply} className="bg-green-600 hover:bg-green-700 text-white">OK</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          <div className="flex justify-around items-center gap-2">
            {availableStrokeWidths.map((width) => (
              <Button
                key={width}
                variant="ghost"
                className={cn(
                  "h-10 w-10 p-0 flex items-center justify-center rounded-lg",
                  penStrokeWidth === width ? "bg-accent" : ""
                )}
                onClick={() => setPenStrokeWidth(width)}
                aria-label={`Set stroke width to ${width}`}
              >
                <div
                  className="bg-foreground rounded-full"
                  style={{
                    height: `${Math.min(Math.max(width, 2), 16)}px`, // Ensure reasonable size
                    width: `${Math.min(Math.max(width, 2), 16)}px`,
                    minHeight: '4px', // Keep a minimum visible size
                    minWidth: '4px',
                  }}
                />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

