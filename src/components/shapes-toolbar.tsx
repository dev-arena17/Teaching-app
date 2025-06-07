
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Minus, // Line
  ArrowUpRight, // Arrow
  Circle, // Circle & Ellipse (can use same for UI)
  RectangleHorizontal, // Rectangle
  Triangle,
  Square, // Placeholder for Cube Frame / simpler Cube representation
  Database, // Placeholder for Cylinder
  Diamond,
  Pentagon,
  Hexagon,
  Octagon,
  Star,
  Globe2, // Sphere
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom SVG Icons
const PyramidIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2L2 22H22L12 2Z" />
    <path d="M12 22V2" />
    <path d="M2 22L12 12L22 22" />
     <path d="M2 22L12 12" />
     <path d="M22 22L12 12" />
     <path d="M12 2L7 12h10L12 2" />
  </svg>
);

const TrapezoidIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 20H2L6 4H18L22 20Z" />
  </svg>
);


interface ShapesToolbarProps {
  selectedShapeType: string | null;
  setSelectedShapeType: (shapeType: string | null) => void;
  onClose: () => void;
}

const shapeList = [
  { id: "line", icon: Minus, label: "Line" },
  { id: "arrow", icon: ArrowUpRight, label: "Arrow" },
  { id: "ellipse", icon: Circle, label: "Oval" }, // Using Circle icon for Oval/Ellipse
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
  { id: "cube", icon: Square, label: "Cube" }, // Using Square as a base for Cube
  { id: "cylinder", icon: Database, label: "Cylinder" }, // Using Database as placeholder
  { id: "diamond", icon: Diamond, label: "Diamond" },
  { id: "pentagon", icon: Pentagon, label: "Pentagon" },
  { id: "hexagon", icon: Hexagon, label: "Hexagon" },
  { id: "octagon", icon: Octagon, label: "Octagon" },
  { id: "star", icon: Star, label: "Star" },
  { id: "sphere", icon: Globe2, label: "Sphere" },
  { id: "pyramid", icon: PyramidIcon, label: "Pyramid" },
  { id: "trapezoid", icon: TrapezoidIcon, label: "Trapezoid" },
];

export default function ShapesToolbar({
  selectedShapeType,
  setSelectedShapeType,
  onClose,
}: ShapesToolbarProps) {
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4 sm:max-w-lg">
      <Card className="shadow-2xl rounded-xl">
        <CardContent className="p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-foreground">Shapes</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 p-2">
            {shapeList.map((shape) => (
              <Button
                key={shape.id}
                variant={selectedShapeType === shape.id ? "secondary" : "outline"}
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-lg flex flex-col items-center justify-center", // Adjusted for icon + label
                  selectedShapeType === shape.id && "ring-2 ring-primary ring-offset-1"
                )}
                onClick={() => {
                  setSelectedShapeType(shape.id);
                  // Potentially onClose(); if selecting a shape should close the toolbar
                }}
                title={shape.label}
              >
                <shape.icon className="h-6 w-6" />
                {/* <span className="text-xs mt-1">{shape.label}</span> */}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
