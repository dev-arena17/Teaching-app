
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input"; // Added Input
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose, // Added DialogClose
} from "@/components/ui/dialog"; // Added Dialog components
import { useToast } from "@/hooks/use-toast"; // Added useToast
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
  const [customColorInput, setCustomColorInput] = React.useState<string>(penColor);

  React.useEffect(() => {
    // Sync input with penColor when dialog opens or penColor changes externally
    setCustomColorInput(penColor);
  }, [penColor, isColorPickerDialogOpen]);

  const isValidHexColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleCustomColorApply = () => {
    if (isValidHexColor(customColorInput)) {
      setPenColor(customColorInput);
      setIsColorPickerDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Color",
        description: "Please enter a valid hex color code (e.g., #RRGGBB or #RGB).",
      });
    }
  };

  const handleDialogClose = () => {
    setIsColorPickerDialogOpen(false);
    setCustomColorInput(penColor); // Reset to current pen color on cancel/close
  }

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
            <Dialog open={isColorPickerDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    handleDialogClose();
                } else {
                    setIsColorPickerDialogOpen(true);
                }
            }}>
              <DialogTrigger asChild>
                 <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 flex items-center justify-center" aria-label="More colors">
                    <svg width="20" height="20" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{stopColor:'red',stopOpacity:1}} />
                            <stop offset="20%" style={{stopColor:'yellow',stopOpacity:1}} />
                            <stop offset="40%" style={{stopColor:'lime',stopOpacity:1}} />
                            <stop offset="60%" style={{stopColor:'cyan',stopOpacity:1}} />
                            <stop offset="80%" style={{stopColor:'blue',stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:'magenta',stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="url(#grad1)" />
                    </svg>
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[320px]">
                <DialogHeader>
                  <DialogTitle>Choose color</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-2">
                    <Input
                      id="customColor"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      className="col-span-2 h-8"
                      placeholder="#RRGGBB"
                    />
                    <div
                      className="h-8 w-8 rounded border border-border"
                      style={{ backgroundColor: isValidHexColor(customColorInput) ? customColorInput : 'transparent' }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={handleCustomColorApply}>OK</Button>
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
                    height: `${Math.min(width, 16)}px`,
                    width: `${Math.min(width, 16)}px`,
                    minHeight: '4px',
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
