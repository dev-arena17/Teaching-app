
export interface Page {
  id: string;
  src?: string; // Optional if it's a truly blank page or generated content
  alt: string;
  hint: string;
  type: 'image' | 'video' | 'pdf_page' | 'blank' | 'text'; // Extend as needed
  // Add other page-specific properties here, e.g., content for text type
}
