# AI Voice Search for Real Estate (Proof of Concept)

A simple property search prototype built with Next.js and Tailwind CSS. This prototype serves as a foundation for implementing voice search capabilities for real estate listings.

## Features
- Voice search in Arabic (upcoming)
- Intelligent NLP-based property search
  - Handles complex Arabic queries
  - Extracts property type, location, and features
  - Supports compound search terms
  - Advanced feature matching:
    - Base feature extraction (e.g., "مسبح" from "مسبح للأطفال")
    - Flexible matching for feature variations
    - Prioritized base feature matches
    - Support for compound Arabic features
- Real-time property filtering with case-insensitive matching
- Advanced Arabic NLP processing for compound features
- Responsive design with RTL support
- Property listing with optimized image loading
- Search properties by:
  - Natural language queries (e.g., "فيلا مع مسبح في الرياض")
  - Property type
  - Location (with district support)
  - Features (with compound feature support)
  - Price range
- Search properties by title, location, type, or features
- Comprehensive test coverage

## Upcoming Enhancements
- OpenAI embeddings-based semantic search
  - Enhanced natural language understanding
  - Improved semantic matching
  - Better handling of complex queries
- Voice command processing with Web Speech API
- Advanced filtering with vector similarity

## Tech Stack
- Next.js 14.0.4 (App Router)
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Radix UI Components
- OpenAI API (upcoming)
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
├── __tests__/              # Global test files
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── data/                  # Data files
│   └── properties.ts      # Property data
├── types/                 # TypeScript types
│   └── index.ts          # Shared type definitions
└── utils/                # Utility functions
    ├── __tests__/        # Utility-specific tests
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