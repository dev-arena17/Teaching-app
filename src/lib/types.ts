
export interface Page {
  id: string;
  src?: string; // Optional if it's a truly blank page or generated content
  alt: string;
  hint: string;
  type: 'image' | 'video' | 'pdf_page' | 'blank' | 'text'; // Extend as needed
  drawingData?: DrawingPath[]; // Store drawing data for each page
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingPath {
  color: string;
  strokeWidth: number;
  points: DrawingPoint[];
  isHighlighter?: boolean;
}
