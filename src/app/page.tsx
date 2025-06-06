
"use client";

import * as React from "react";
import PageHeader from '@/components/page-header';
import ActivePageView from '@/components/active-page-view';
import BottomToolbar from '@/components/bottom-toolbar';
import PageThumbnailSidebar from "@/components/page-thumbnail-sidebar";
import type { Page } from "@/lib/types";

export default function DocumentEditorPage() {
  const [pages, setPages] = React.useState<Page[]>([
    // Start with one blank page
    { id: '1', src: undefined, alt: 'Page 1', hint: 'blank page', type: 'blank' },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isThumbnailSidebarOpen, setIsThumbnailSidebarOpen] = React.useState(false);

  const handlePageSelect = (index: number) => {
    setCurrentPageIndex(index);
    setIsThumbnailSidebarOpen(false);
  };

  const handleAddBlankPage = () => {
    const newPageId = (pages.length + 1).toString();
    const newPage: Page = {
      id: newPageId,
      src: undefined, // Mark as blank
      alt: `Page ${newPageId}`,
      hint: 'blank page',
      type: 'blank',
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
    setIsThumbnailSidebarOpen(true);
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
    