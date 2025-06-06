import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings, ClipboardList, Users, Video } from "lucide-react";

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
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <ClipboardList className="h-5 w-5 text-foreground/80" />
          </Button>
        </div>
      </div>
      <div className="text-lg font-semibold text-foreground">10/49</div>
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
