import { Button } from "@/components/ui/button";
import { Send, PenTool, Shapes, Type, Sigma, Eraser, CopyPlus, Undo2 } from "lucide-react";

export default function BottomToolbar() {
  // In a real app, this would come from component state or props
  const activeTool = "pen"; 

  const tools = [
    { id: "send", icon: Send, label: "Send" },
    { id: "pen", icon: PenTool, label: "Pen" },
    { id: "shapes", icon: Shapes, label: "Shapes" },
    { id: "type", icon: Type, label: "Text" },
    { id: "fx", icon: Sigma, label: "Function" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "addpage", icon: CopyPlus, label: "Add Page" },
    { id: "undo", icon: Undo2, label: "Undo" },
  ];

  return (
    <footer className="bg-background p-3 sticky bottom-0 z-10 border-t">
      <div className="flex justify-center items-center">
        <div className="bg-card py-1 px-2 rounded-full shadow-lg flex items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="icon"
              className={`h-10 w-10 rounded-full ${
                activeTool === tool.id ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'
              }`}
              aria-label={tool.label}
            >
              <tool.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
