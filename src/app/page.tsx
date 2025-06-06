
"use client";

import * as React from "react";
import PageHeader from '@/components/page-header';
import ActivePageView from '@/components/active-page-view'; // Renamed from ImageGrid
import BottomToolbar from '@/components/bottom-toolbar';
import PageThumbnailSidebar from "@/components/page-thumbnail-sidebar"; // New component
import type { Page } from "@/lib/types"; // Will create this type definition

export default function DocumentEditorPage() {
  const [pages, setPages] = React.useState<Page[]>([
    { id: '1', src: 'https://placehold.co/800x600.png', alt: 'Page 1', hint: 'document page', type: 'image' },
    { id: '2', src: 'https://placehold.co/800x600.png', alt: 'Page 2', hint: 'notes', type: 'image' },
    { id: '3', src: 'https://placehold.co/800x600.png', alt: 'Page 3', hint: 'diagram', type: 'image' },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isThumbnailSidebarOpen, setIsThumbnailSidebarOpen] = React.useState(false);

  const handlePageSelect = (index: number) => {
    setCurrentPageIndex(index);
    setIsThumbnailSidebarOpen(false); // Close sidebar on selection
  };

  const handleAddBlankPage = () => {
    const newPageId = (pages.length + 1).toString();
    const newPage: Page = {
      id: newPageId,
      // For a true blank page, src might be undefined or a special marker
      src: `https://placehold.co/800x600.png?text=Blank+Page+${newPageId}`,
      alt: `Page ${newPageId}`,
      hint: 'blank page',
      type: 'image', // Or 'blank'
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length); // Select the new page
    setIsThumbnailSidebarOpen(true); // Keep sidebar open or open if closed
  };

  const toggleThumbnailSidebar = () => {
    setIsThumbnailSidebarOpen(!isThumbnailSidebarOpen);
  };

  const currentPageData = pages[currentPageIndex];

  return (
    <div className="flex flex-col h-screen bg-background">
      <PageHeader
        currentPageNumber={currentPageIndex + 1}
        totalPages={pages.length}
        onToggleThumbnailSidebar={toggleThumbnailSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 bg-muted">
          {currentPageData ? (
            <ActivePageView page={currentPageData} />
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
      <BottomToolbar onAddBlankPage={handleAddBlankPage} />
    </div>
  );
}
