# AI Voice Search for Real Estate (Proof of Concept)

A simple property search prototype built with Next.js and Tailwind CSS. This prototype serves as a foundation for implementing voice search capabilities for real estate listings.

## Features
- Voice search in Arabic (upcoming)
- Real-time property filtering with case-insensitive matching
- Advanced Arabic NLP processing for compound features
- Responsive design with RTL support
- OpenAI-powered natural language understanding (upcoming)
- Property listing with optimized image loading
- Search properties by title, location, type, or features
- Comprehensive test coverage

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
The project follows Next.js 13+ best practices with all source code under the `/src` directory:

```
/src
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── data/                  # Data files
│   └── properties.ts      # Property data
├── types/                 # TypeScript types
│   └── index.ts          # Shared type definitions
└── utils/                # Utility functions
    └── format.ts         # Formatting utilities
```

Root directory contains:
- Configuration files (tsconfig.json, next.config.mjs, etc.)
- Documentation (README.md, CHANGELOG.md, SESSION.md)
- Package management (package.json, package-lock.json)
- Static assets (public/)

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