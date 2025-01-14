# AI Voice Search for Real Estate (Proof of Concept)

A simple property search prototype built with Next.js and Tailwind CSS. This prototype serves as a foundation for implementing voice search capabilities for real estate listings.

## Features
- Voice search in Arabic
- Real-time property filtering
- Responsive design with RTL support
- OpenAI-powered natural language understanding
- Property listing with images
- Search properties by title or location

## Tech Stack
- Next.js 14.0.4 (App Router)
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Radix UI Components
- OpenAI GPT-4 (upcoming)
- Web Speech API (upcoming)

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
# .env.local
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

3. Run development server:
```bash
npm run dev
```

## Project Structure
```
/
├── app/              # Next.js app directory
│   ├── page.tsx     # Main page
│   ├── layout.tsx   # Root layout
│   └── globals.css  # Global styles
├── data/            # Sample property data
├── public/          # Static assets
├── types.ts         # TypeScript types
└── utils.ts         # Utility functions
```

## Development Process
- Mobile-first approach
- Server Components by default
- Error prevention focus
- Regular testing

## Browser Support
- Chrome 100+
- Edge 100+
- Safari 15+
- Firefox 100+

For more details:
- See [CHANGELOG.md](./CHANGELOG.md) for version history
- See [SESSION.md](./SESSION.md) for development status 