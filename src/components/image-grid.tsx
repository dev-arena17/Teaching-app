import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const pages = [
  { id: 1, src: 'https://placehold.co/600x400.png', alt: 'Page 1 content', hint: 'lecture notes' },
  { id: 2, src: 'https://placehold.co/600x400.png', alt: 'Page 2 content', hint: 'study material' },
  { id: 3, src: 'https://placehold.co/600x400.png', alt: 'Page 3 content', hint: 'diagrams chemistry' },
  { id: 4, src: 'https://placehold.co/600x400.png', alt: 'Page 4 content', hint: 'formulas physics' },
  { id: 5, src: 'https://placehold.co/600x400.png', alt: 'Page 5 content', hint: 'equations math' },
];

export default function ImageGrid() {
  return (
    <main className="flex-1 overflow-y-auto p-4 bg-slate-200">
      <div className="space-y-4 max-w-2xl mx-auto">
        {pages.map((page) => (
          <Card key={page.id} className="overflow-hidden shadow-lg rounded-xl">
            <CardContent className="p-0 relative">
              <Image
                src={page.src}
                alt={page.alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint={page.hint}
              />
              <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-sm font-semibold px-3 py-1 rounded-md">
                {page.id}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
