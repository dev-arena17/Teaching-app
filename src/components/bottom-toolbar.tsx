import { Button } from "@/components/ui/button";
import { Send, Pen } from "lucide-react";

export default function BottomToolbar() {
  return (
    <footer className="bg-background p-3 sticky bottom-0 z-10 border-t">
      <div className="flex justify-start items-center ml-2">
        <div className="bg-card py-1 px-2 rounded-full shadow-lg flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-12 w-12 text-primary hover:bg-accent rounded-full">
            <Send className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 bg-green-100 hover:bg-green-200 text-green-700 rounded-full">
            <Pen className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
