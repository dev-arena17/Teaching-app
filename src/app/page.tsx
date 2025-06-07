
"use client";

import * as React from "react";
import PageHeader from '@/components/page-header';
import ActivePageView from '@/components/active-page-view';
import BottomToolbar from '@/components/bottom-toolbar';
import PageThumbnailSidebar from "@/components/page-thumbnail-sidebar";
import PenSettingsToolbar from "@/components/pen-settings-toolbar";
import EraserSettingsToolbar from "@/components/eraser-settings-toolbar";
import type { Page } from "@/lib/types";

const DEFAULT_PEN_COLOR = "#EF4444";
const MIN_PEN_STROKE_WIDTH = 1;
const MAX_PEN_STROKE_WIDTH = 50;
const DEFAULT_PEN_STROKE_WIDTH = 5;
const PEN_COLORS = ["#000000", "#EF4444", "#3B82F6", "#22C55E", "#A855F7", "#EAB308"];

const MIN_ERASER_SIZE = 5;
const MAX_ERASER_SIZE = 100;
const DEFAULT_ERASER_SIZE = 20;


export default function DocumentEditorPage() {
  const [pages, setPages] = React.useState<Page[]>([
    { id: '1', src: undefined, alt: 'Page 1', hint: 'blank page', type: 'blank', drawingData: [] },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isThumbnailSidebarOpen, setIsThumbnailSidebarOpen] = React.useState(false);

  const [activeToolId, setActiveToolId] = React.useState<string | null>(null);

  const [isPenSettingsOpen, setIsPenSettingsOpen] = React.useState(false);
  const [penColor, setPenColor] = React.useState<string>(DEFAULT_PEN_COLOR);
  const [penStrokeWidth, setPenStrokeWidth] = React.useState<number>(DEFAULT_PEN_STROKE_WIDTH);
  const [activePenSubTool, setActivePenSubTool] = React.useState<'pen' | 'highlighter'>('pen');

  const [isEraserSettingsOpen, setIsEraserSettingsOpen] = React.useState(false);
  const [eraserSize, setEraserSize] = React.useState<number>(DEFAULT_ERASER_SIZE);


  const handlePageSelect = (index: number) => {
    setCurrentPageIndex(index);
    setIsThumbnailSidebarOpen(false);
  };

  const addNewPage = (newPage: Page, makeActive: boolean = true) => {
    setPages(prevPages => {
      const updatedPages = [...prevPages, newPage];
      if (makeActive) {
        setCurrentPageIndex(updatedPages.length - 1);
      }
      return updatedPages;
    });
    if (makeActive) {
        setIsThumbnailSidebarOpen(true);
    }
  };

  const handleAddBlankPage = () => {
    const newPageId = (Date.now()).toString();
    const newPage: Page = {
      id: newPageId,
      src: undefined,
      alt: `Page ${pages.length + 1}`,
      hint: 'blank page',
      type: 'blank',
      drawingData: [],
    };
    addNewPage(newPage);
  };

  const handleImageUploaded = (imageDataUrl: string, originalFileName?: string) => {
    const newPageId = (Date.now()).toString();
    const newPage: Page = {
      id: newPageId,
      src: imageDataUrl,
      alt: originalFileName || `Uploaded Image ${pages.length + 1}`,
      hint: 'uploaded image',
      type: 'image',
      drawingData: [],
    };
    addNewPage(newPage);
  };

  const handlePagesImported = (newPages: Page[]) => {
    if (newPages.length === 0) return;
    setPages(prevPages => {
      const updatedPages = [...prevPages, ...newPages];
      setCurrentPageIndex(prevPages.length); // Set current page to the first of the new pages
      return updatedPages;
    });
    setIsThumbnailSidebarOpen(true); // Open sidebar to show new pages
  };


  const toggleThumbnailSidebar = () => {
    setIsThumbnailSidebarOpen(!isThumbnailSidebarOpen);
  };

  const handleDrawingChange = (drawingData: any[]) => {
    setPages(prevPages => {
      const newPages = [...prevPages];
      if (newPages[currentPageIndex]) {
        newPages[currentPageIndex] = { ...newPages[currentPageIndex], drawingData };
      }
      return newPages;
    });
  };

  const handleEraseAll = () => {
    if (pages[currentPageIndex]) {
      handleDrawingChange([]);
    }
  };


  const currentPageData = pages[currentPageIndex];

  return (
    <div className="flex flex-col h-screen bg-background">
      <PageHeader
        currentPageNumber={currentPageIndex + 1}
        totalPages={pages.length}
        onToggleThumbnailSidebar={toggleThumbnailSidebar}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 bg-muted">
          {currentPageData ? (
            <ActivePageView
              page={currentPageData}
              penColor={penColor}
              penStrokeWidth={penStrokeWidth}
              eraserSize={eraserSize}
              activeToolId={activeToolId}
              onDrawingChange={handleDrawingChange}
              isPenActive={activeToolId === 'pen' && activePenSubTool === 'pen'}
              isHighlighterActive={activeToolId === 'pen' && activePenSubTool === 'highlighter'}
              isEraserActive={activeToolId === 'eraser'}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No page selected or pages list is empty.</p>
            </div>
          )}
        </main>
        <PageThumbnailSidebar
          isOpen={isThumbnailSidebarOpen}
          onOpenChange={setIsThumbnailSidebarOpen}
          pages={pages}
          currentPageIndex={currentPageIndex}
          onPageSelect={handlePageSelect}
          onAddBlankPage={handleAddBlankPage}
        />
      </div>

      {isPenSettingsOpen && activeToolId === 'pen' && (
        <PenSettingsToolbar
          penColor={penColor}
          setPenColor={setPenColor}
          penStrokeWidth={penStrokeWidth}
          setPenStrokeWidth={setPenStrokeWidth}
          minStrokeWidth={MIN_PEN_STROKE_WIDTH}
          maxStrokeWidth={MAX_PEN_STROKE_WIDTH}
          activePenSubTool={activePenSubTool}
          setActivePenSubTool={setActivePenSubTool}
          availableColors={PEN_COLORS}
          onClose={() => setIsPenSettingsOpen(false)}
        />
      )}

      {isEraserSettingsOpen && activeToolId === 'eraser' && (
        <EraserSettingsToolbar
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
          minEraserSize={MIN_ERASER_SIZE}
          maxEraserSize={MAX_ERASER_SIZE}
          onEraseAll={handleEraseAll}
          onClose={() => setIsEraserSettingsOpen(false)}
        />
      )}

      <BottomToolbar
        activeToolId={activeToolId}
        setActiveToolId={setActiveToolId}
        isPenSettingsOpen={isPenSettingsOpen}
        setIsPenSettingsOpen={setIsPenSettingsOpen}
        isEraserSettingsOpen={isEraserSettingsOpen}
        setIsEraserSettingsOpen={setIsEraserSettingsOpen}
        onImageUploaded={handleImageUploaded}
        onPagesImported={handlePagesImported}
      />
    </div>
  );
}
