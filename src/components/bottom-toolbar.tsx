
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  PenTool,
  Shapes,
  Type,
  Sigma,
  Eraser,
  CopyPlus,
  Undo2,
  ImageUp,
  Video, // Changed from VideoUp
  Camera,
  FileUp,
  FilePlus2,
  Copy,
  Trash2,
} from "lucide-react";

export default function BottomToolbar() {
  const activeTool = "pen";
  const { toast } = useToast();

  const [isTakePhotoDialogOpen, setIsTakePhotoDialogOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const baseTools = [
    { id: "send", icon: Send, label: "Send" },
    { id: "pen", icon: PenTool, label: "Pen" },
    { id: "shapes", icon: Shapes, label: "Shapes" },
    { id: "type", icon: Type, label: "Text" },
    { id: "fx", icon: Sigma, label: "Function" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  const pageOperationTools = [
    { id: "undo", icon: Undo2, label: "Undo" },
  ];

  React.useEffect(() => {
    if (isTakePhotoDialogOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings.",
          });
          setIsTakePhotoDialogOpen(false); // Close dialog if permission denied
        }
      };
      getCameraPermission();
    } else {
      // Cleanup: stop camera stream when dialog is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      // No need to reset permission status here, it's handled by the initial state or error state
    }
  }, [isTakePhotoDialogOpen, toast]);

  const handleUploadImage = () => {
    console.log("Upload Image clicked");
    toast({ title: "Upload Image", description: "Functionality to upload image will be implemented here." });
  };

  const handleUploadVideo = () => {
    console.log("Upload Video clicked");
    toast({ title: "Upload Video", description: "Functionality to upload video will be implemented here." });
  };

  const handleImportFile = () => {
    console.log("Import File clicked");
    toast({ title: "Import File", description: "Functionality to import PDF/PPT will be implemented here." });
  };

  const handleAddBlankPage = () => {
    console.log("Add Blank Page clicked");
    toast({ title: "Add Blank Page", description: "Functionality to add a blank page will be implemented here." });
  };

  const handleCopyPage = () => {
    console.log("Copy Page clicked");
    toast({ title: "Copy Page", description: "Functionality to copy the current page will be implemented here." });
  };

  const handleDeletePage = () => {
    console.log("Delete Page clicked");
    toast({ title: "Delete Page", description: "Functionality to delete the current page will be implemented here." });
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && hasCameraPermission) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        console.log("Photo captured:", dataUrl.substring(0,50) + "..."); 
        toast({ title: "Photo Captured", description: "Photo captured successfully! (See console for Data URL)" });
        setIsTakePhotoDialogOpen(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Capture Failed",
        description: "Could not capture photo. Camera permission might be missing or video stream not available.",
      });
    }
  };


  return (
    <footer className="bg-background p-3 sticky bottom-0 z-10 border-t">
      <div className="flex justify-center items-center">
        <div className="bg-card py-1 px-2 rounded-full shadow-lg flex items-center gap-1">
          {baseTools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="icon"
              className={`h-10 w-10 rounded-full ${
                activeTool === tool.id
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-label={tool.label}
            >
              <tool.icon className="h-5 w-5" />
            </Button>
          ))}

          <Dialog open={isTakePhotoDialogOpen} onOpenChange={(open) => {
            setIsTakePhotoDialogOpen(open);
            if (!open) { // If dialog is closing, reset camera permission state for next open
                 if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach((track) => track.stop());
                    videoRef.current.srcObject = null;
                  }
                setHasCameraPermission(null);
            }
          }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                  aria-label="Add Content"
                >
                  <CopyPlus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="top" className="w-56 mb-2">
                <DropdownMenuItem onClick={handleUploadImage}>
                  <ImageUp className="mr-2 h-4 w-4" />
                  <span>Upload Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUploadVideo}>
                  <Video className="mr-2 h-4 w-4" /> {/* Changed from VideoUp */}
                  <span>Upload Video</span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={() => setHasCameraPermission(null)}> {/* Reset on open attempt */}
                    <Camera className="mr-2 h-4 w-4" />
                    <span>Take Photo</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem onClick={handleImportFile}>
                  <FileUp className="mr-2 h-4 w-4" />
                  <span>Import File (PDF/PPT)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAddBlankPage}>
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  <span>Add Blank Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyPage}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeletePage}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Page</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Take Photo</DialogTitle>
                <DialogDescription>
                  Position yourself in front of the camera and click capture.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access in your browser settings to use this feature.
                    </AlertDescription>
                  </Alert>
                )}
                 {hasCameraPermission === null && !videoRef.current?.srcObject && ( // Show only if camera is not already active
                  <div className="absolute inset-0 w-full aspect-video rounded-md bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Initializing camera...</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTakePhotoDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCapturePhoto} disabled={hasCameraPermission !== true}>
                  <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {pageOperationTools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-foreground/70 hover:bg-accent hover:text-accent-foreground"
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
