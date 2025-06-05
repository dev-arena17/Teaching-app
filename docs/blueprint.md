# **App Name**: LiveSketch Studio

## Core Features:

- Real-Time Whiteboard: Real-time whiteboard canvas using react-native-skia (Expo) or Fabric.js (Next.js).
- Handwriting Input: Handwriting input via touch, recording strokes as SVG paths.
- AI Handwriting Rendering: AI-enhanced handwriting rendering using MyTextInStyle via HuggingFace to mimic different handwriting styles as a tool.
- Text Size Control: Control text size, allowing scaling from 1px to 100px or more, implemented on the client side.
- Handwriting Style Transfer: AI to style text in a user's or someone else's handwriting style.
- Messy Writing Cleanup: Support for messy or large writing resized/neatened by the AI service.
- Live Collaboration: Live collaboration using Supabase or Firebase Realtime DB for room sessions and updates.

## Style Guidelines:

- Primary color: HSL(210, 70%, 50%) – A vibrant blue (#3399FF) evokes collaboration and innovation.
- Background color: HSL(210, 20%, 95%) – A light, desaturated blue (#F0F8FF) provides a clean, non-distracting canvas.
- Accent color: HSL(180, 60%, 40%) – A contrasting teal (#33CCCC) highlights interactive elements and calls to action.
- Headline font: 'Space Grotesk' (sans-serif) for a techy, clean feel; body font: 'Inter' (sans-serif) for longer text.
- Code font: 'Source Code Pro' (monospace) for displaying code snippets, separate from body/headline fonts. Note: currently only Google Fonts are supported.
- Use simple, geometric icons for tools and actions on the whiteboard.
- Clean and intuitive layout with a focus on the whiteboard area. Minimal UI elements to reduce distractions.