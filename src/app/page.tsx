import PageHeader from '@/components/page-header';
import ImageGrid from '@/components/image-grid';
import BottomToolbar from '@/components/bottom-toolbar';

export default function DocumentEditorPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <PageHeader />
      <ImageGrid />
      <BottomToolbar />
    </div>
  );
}
