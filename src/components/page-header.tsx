import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Settings } from "lucide-react";

export default function PageHeader() {
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
        </div>
        <Button variant="ghost" size="icon" className="h-11 w-11 bg-card p-1.5 rounded-xl shadow-md hover:bg-accent">
          <ChevronRight className="h-5 w-5 text-foreground/80" />
        </Button>
      </div>
      <div className="text-lg font-semibold text-foreground">Pages: 49</div>
      <Button variant="ghost" size="icon" className="h-11 w-11 bg-card p-1.5 rounded-xl shadow-md hover:bg-accent">
        <Plus className="h-6 w-6 text-foreground/80" />
      </Button>
    </header>
  );
}
