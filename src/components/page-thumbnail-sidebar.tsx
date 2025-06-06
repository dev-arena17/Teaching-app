
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
            <SheetClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => {
                  onAddBlankPage();
                  // The SheetClose mechanism will still handle closing the sheet
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {pages.map((page, index) => (
              <Button
                key={page.id}
                variant="outline"
                className={cn(
                  "w-full h-auto p-2 border-2 rounded-lg flex flex-col items-center justify-center space-y-1",
                  currentPageIndex === index
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-border hover:border-primary/70"
                )}
                onClick={() => onPageSelect(index)}
              >
                <div className="w-full aspect-[16/10] bg-muted rounded-md overflow-hidden relative">
                  <Image
                    src={page.src || `https://placehold.co/160x100.png?text=Page+${page.id}`}
                    alt={page.alt}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    data-ai-hint={page.hint}
                  />
                   <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded-sm">
                    {index + 1}
                  </div>
                </div>
                {/* <span className="text-xs text-muted-foreground">Page {index + 1}</span> */}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={onAddBlankPage}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Blank Page
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
