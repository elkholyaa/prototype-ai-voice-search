# AI Voice Search for Real Estate (Proof of Concept)

A simple property search prototype built with Next.js and Tailwind CSS. This prototype serves as a foundation for implementing voice search capabilities for real estate listings.

## Features
- Voice search in Arabic
- Real-time property filtering
- Responsive design with RTL support
- OpenAI-powered natural language understanding
- Property listing with images
- Search properties by title or location
- Responsive design
- TypeScript support
- Tailwind CSS styling

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

## Tech Stack
- Next.js 14 (App Router)
- TypeScript (strict mode enabled)
- Tailwind CSS + Shadcn UI
- OpenAI GPT-4
- Web Speech API

## Project Structure
```
src/
├── app/              # Next.js pages
├── components/       # UI components
├── lib/             # Core services
├── types/           # TypeScript types
└── data/            # Sample data
```

## Development Process
- Single task per iteration
- Mobile-first approach
- Server Components by default
- Error prevention focus
- Regular testing

## Browser Support
- Chrome 33+
- Edge 79+
- Safari 14.1+
- Firefox 85+

For more details:
- See [CHANGELOG.md](./CHANGELOG.md) for version history
- See [SESSION.md](./SESSION.md) for development status 