"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Settings, ClipboardList, Users, Video } from "lucide-react";

export default function PageHeader() {
  const [currentPage, setCurrentPage] = React.useState(10);
  const totalPages = 49;
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
    setIsPopoverOpen(false); // Close popover on selection
  };

  return (
    <header className="bg-background shadow-sm p-3 flex items-center justify-between sticky top-0 z-10 border-b">
      <div className="flex items-center gap-2">
        <div className="bg-card p-1.5 rounded-xl shadow-md flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <ChevronLeft className="h-5 w-5 text-foreground/80" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <Settings className="h-5 w-5 text-foreground/80" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <ClipboardList className="h-5 w-5 text-foreground/80" />
          </Button>
        </div>
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold text-foreground p-1 h-auto hover:bg-accent"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            {currentPage}/{totalPages}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0">
          <ScrollArea className="h-72">
            <div className="p-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant="ghost"
                    className={`w-full justify-start p-2 text-sm h-auto ${
                      pageNumber === currentPage
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/80"
                    }`}
                    onClick={() => handlePageSelect(pageNumber)}
                  >
                    Page {pageNumber}
                  </Button>
                )
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <div className="bg-card p-1.5 rounded-xl shadow-md flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <Users className="h-5 w-5 text-foreground/80" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <Video className="h-5 w-5 text-foreground/80" />
          </Button>
        </div>
      </div>
    </header>
  );
}
