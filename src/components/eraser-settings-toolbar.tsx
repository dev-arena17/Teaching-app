
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Trash2, X, Circle } from "lucide-react"; // Using Circle for size preview

interface EraserSettingsToolbarProps {
  eraserSize: number;
  setEraserSize: (size: number) => void;
  minEraserSize: number;
  maxEraserSize: number;
  onEraseAll: () => void;
  onClose: () => void;
}

export default function EraserSettingsToolbar({
  eraserSize,
  setEraserSize,
  minEraserSize,
  maxEraserSize,
  onEraseAll,
  onClose,
}: EraserSettingsToolbarProps) {
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-sm px-4 sm:max-w-md">
      <Card className="shadow-2xl rounded-xl">
        <CardContent className="p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-foreground">Eraser Options</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          <div className="flex items-center gap-3 px-2">
            <Circle className="h-5 w-5 text-foreground/70" />
            <Slider
              value={[eraserSize]}
              onValueChange={(value) => setEraserSize(value[0])}
              min={minEraserSize}
              max={maxEraserSize}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-foreground/70 w-8 text-right">{eraserSize}</span>
          </div>

          <Separator />

          <Button variant="outline" onClick={onEraseAll} className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Erase All Drawings on Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
