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
- OpenAI embeddings-based semantic search
  - Precomputed property embeddings
  - Real-time query embedding generation
  - Cosine similarity matching
- Rate-limited and cached API
  - 10 requests per minute limit
  - 5-minute LRU cache for results
  - Zod input validation
  - Comprehensive error handling
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
- Comprehensive test coverage

## Tech Stack
- Next.js 14.0.4 (App Router)
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Radix UI Components
- OpenAI API
- Web Speech API (upcoming)
- Zod for validation
- LRU Cache for results

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key
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

## API Documentation
The search API is available at `/api/search` and accepts POST requests with the following format:

```typescript
{
  "query": "فيلا مع مسبح وحديقة في الرياض",
  "limit": 10 // optional, defaults to 10
}
```

Response format:
```typescript
{
  "results": [
    {
      "type": "فيلا",
      "city": "الرياض",
      "district": "حي النرجس",
      "rooms": 6,
      "features": ["مسبح", "حديقة"],
      "similarityScore": 0.92
    }
  ],
  "total": 1,
  "message": "Found 1 matching properties."
}
```

Rate limiting: 10 requests per minute per IP
Cache duration: 5 minutes

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

## Data Generation

### Property Data
Property data is pre-generated and stored in `src/data/static/properties.json`. To regenerate the data:

```bash
node src/data/generateStaticData.mjs
```

### OpenAI Embeddings
To enable semantic search, the application uses OpenAI's text-embedding-ada-002 model to generate embeddings for property descriptions. The embeddings are pre-generated and stored in the repository to avoid unnecessary API costs.

#### Embedding Data
- Location: `src/data/static/properties-with-embeddings.json`
- Size: ~4.4 MB for 150 properties
- Binary format: ~900 KB for optimized loading
- Generated once locally and committed to the repository
- No need to regenerate unless property data changes

#### Initial Generation
If you need to regenerate embeddings (usually not necessary):

1. Set up your OpenAI API key in `.env.local`:
```bash
OPENAI_API_KEY=your_openai_api_key
```

2. Run the generation script:
```bash
npm run embeddings       # Process only new properties
# or
npm run embeddings:force # Regenerate all embeddings
```

The script will:
- Show size and cost estimates before processing
- Generate embeddings in batches
- Save results in both JSON and binary formats
- Update metadata with processing details

Note: The embedding files are committed to the repository, so you typically don't need to run this script unless you're updating the property data.

[Rest of the content remains the same...] 