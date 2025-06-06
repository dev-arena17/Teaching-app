
"use client";

import * as React from "react";
import PageHeader from '@/components/page-header';
import ActivePageView from '@/components/active-page-view';
import BottomToolbar from '@/components/bottom-toolbar';
import PageThumbnailSidebar from "@/components/page-thumbnail-sidebar";
import PenSettingsToolbar from "@/components/pen-settings-toolbar"; // New import
import type { Page } from "@/lib/types";

// Define default pen settings
const DEFAULT_PEN_COLOR = "#EF4444"; // A nice red
const DEFAULT_STROKE_WIDTH = 8;
const PEN_COLORS = ["#000000", "#EF4444", "#3B82F6", "#22C55E", "#A855F7", "#EAB308"];
const STROKE_WIDTHS = [2, 4, 8, 12, 16];


export default function DocumentEditorPage() {
  const [pages, setPages] = React.useState<Page[]>([
    { id: '1', src: undefined, alt: 'Page 1', hint: 'blank page', type: 'blank', drawingData: [] },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isThumbnailSidebarOpen, setIsThumbnailSidebarOpen] = React.useState(false);

  // Pen tool state
  const [activeToolId, setActiveToolId] = React.useState<string | null>(null);
  const [isPenSettingsOpen, setIsPenSettingsOpen] = React.useState(false);
  const [penColor, setPenColor] = React.useState<string>(DEFAULT_PEN_COLOR);
  const [penStrokeWidth, setPenStrokeWidth] = React.useState<number>(DEFAULT_STROKE_WIDTH);
  const [activePenSubTool, setActivePenSubTool] = React.useState<'pen' | 'highlighter'>('pen');


  const handlePageSelect = (index: number) => {
    setCurrentPageIndex(index);
    setIsThumbnailSidebarOpen(false); // Close sidebar on page selection
  };

  const handleAddBlankPage = () => {
    const newPageId = (pages.length + 1).toString();
    const newPage: Page = {
      id: newPageId,
      src: undefined,
      alt: `Page ${newPageId}`,
      hint: 'blank page',
      type: 'blank',
      drawingData: [],
    };
    setPages(prevPages => {
      const updatedPages = [...prevPages, newPage];
      // Automatically switch to the new page
      setCurrentPageIndex(updatedPages.length - 1);
      return updatedPages;
    });
    setIsThumbnailSidebarOpen(true); // Keep sidebar open
  };

  const toggleThumbnailSidebar = () => {
    setIsThumbnailSidebarOpen(!isThumbnailSidebarOpen);
  };

  const handleDrawingChange = (drawingData: any[]) => { // 'any' for simplicity, define properly later
    setPages(prevPages => {
      const newPages = [...prevPages];
      if (newPages[currentPageIndex]) {
        newPages[currentPageIndex] = { ...newPages[currentPageIndex], drawingData };
      }
      return newPages;
    });
  };


  const currentPageData = pages[currentPageIndex];

  return (
    <div className="flex flex-col h-screen bg-background">
      <PageHeader
        currentPageNumber={currentPageIndex + 1}
        totalPages={pages.length}
        onToggleThumbnailSidebar={toggleThumbnailSidebar}
      />
      <div className="flex flex-1 overflow-hidden relative"> {/* Added relative for positioning PenSettingsToolbar */}
        <main className="flex-1 overflow-y-auto p-4 bg-muted">
          {currentPageData ? (
            <ActivePageView
              page={currentPageData}
              penColor={penColor}
              penStrokeWidth={penStrokeWidth}
              activeToolId={activeToolId}
              onDrawingChange={handleDrawingChange}
              isPenActive={activeToolId === 'pen' && activePenSubTool === 'pen'}
              isHighlighterActive={activeToolId === 'pen' && activePenSubTool === 'highlighter'}
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
          activePenSubTool={activePenSubTool}
          setActivePenSubTool={setActivePenSubTool}
          availableColors={PEN_COLORS}
          availableStrokeWidths={STROKE_WIDTHS}
          onClose={() => setIsPenSettingsOpen(false)}
        />
      )}

      <BottomToolbar
        onAddBlankPage={handleAddBlankPage}
        activeToolId={activeToolId}
        setActiveToolId={setActiveToolId}
        isPenSettingsOpen={isPenSettingsOpen}
        setIsPenSettingsOpen={setIsPenSettingsOpen}
      />
    </div>
  );
}
