# Search System Documentation

## File Structure
```
src/
├── utils/
│   ├── embeddings.ts     # Core embedding and search functionality
│   ├── search.ts         # Search API and result types
│   └── api-middleware.ts # Rate limiting and error handling
├── data/
│   ├── static/
│   │   ├── embeddings.bin               # Binary embeddings storage
│   │   ├── properties-with-embeddings.json  # Property data
│   │   └── embedding-metadata.json      # Metadata for embeddings
│   └── generateEmbeddings.ts  # Script to generate embeddings
├── types/
│   └── index.ts          # Type definitions
└── app/
    └── api/
        └── search/
            └── route.ts   # Search API endpoint
```

## Core Files and Functions

### `src/utils/embeddings.ts`
Main search implementation file containing:
```typescript
// Core search functions
export async function findSimilarProperties()
function cosineSimilarity()
function extractExactCriteria()
function propertyMatchesCriteria()

// Embedding management
export async function loadEmbeddings()
```

### `src/utils/search.ts`
Search interface and API handlers:
```typescript
export interface SearchResult extends Property
export async function searchProperties()
export async function handleSearchRequest()
```

### `src/types/index.ts`
Type definitions:
```typescript
export interface Property
export interface PropertyWithEmbedding
```

### `src/app/api/search/route.ts`
API endpoint implementation:
```typescript
export async function POST(req: NextRequest)
const searchSchema = z.object({...})  // Request validation
```

### `src/data/generateEmbeddings.ts`
Embedding generation script:
```typescript
async function generateEmbedding()
function saveEmbeddingsAsBinary()
async function generateAllEmbeddings()
```

## Overview
The search system combines two approaches:
1. **Exact Criteria Matching**: Hard filters for specific requirements (rooms, price, location)
2. **Semantic Search**: AI-powered similarity matching using OpenAI embeddings

## Search Flow
1. Extract exact criteria from query
2. Filter properties based on exact criteria
3. Use embeddings to rank filtered results by semantic similarity

## Components

### 1. Exact Criteria Matching
Location: `src/utils/embeddings.ts -> extractExactCriteria()`

#### Property Types
Location: `src/utils/embeddings.ts`
```typescript
const propertyTypes = {
  'فيلا': ['فيلا', 'فلة', 'فله'],
  'شقة': ['شقة', 'شقه'],
  'قصر': ['قصر'],
  'دوبلكس': ['دوبلكس', 'دوبليكس']
}
```
- Handles common variations and misspellings
- Matches any variation to the standardized type

#### Location Matching
- **Cities**: الرياض, جدة, الدمام
- **Districts**: 
  ```typescript
  {
    'النرجس': ['النرجس', 'نرجس', 'الترجس', 'نارجس'],
    'الياسمين': ['الياسمين', 'ياسمين', 'الياسمبن'],
    'الملقا': ['الملقا', 'ملقا', 'الملقى', 'ملقى'],
    'العليا': ['العليا', 'عليا', 'العلية']
  }
  ```
- Supports prefixes: حي, في, ب, بحي, في حي, منطقة, منطقه

#### Room Counting
Patterns supported:
1. Direct numbers: "3 غرف"
2. Arabic numerals: "٣ غرف"
3. Written numbers: "ثلاث غرف"
4. Special cases: "غرفتين", "غرفتان"

#### Bathroom Counting
Similar to rooms, with patterns:
1. Direct numbers: "2 حمام"
2. Special case: "حمامين"
3. Written numbers with حمامات

#### Price Range Matching
Supports:
1. Maximum price: مايزيد عن, اقل من, تحت, حد اقصى
2. Minimum price: اكثر من, فوق, يزيد عن
3. Range: من X الى Y
4. Units: الف, مليون

### 2. Semantic Search (AI Component)

#### Embeddings Generation
- Model: text-embedding-ada-002 (OpenAI)
- Dimension: 1536
- Stored in binary format for efficiency

#### Property Description Embeddings
- Pre-computed for all properties
- Stored in: src/data/static/embeddings.bin
- Metadata in: embedding-metadata.json

#### Search Process
1. Convert user query to embedding vector
2. Compare with pre-filtered property embeddings
3. Use cosine similarity for ranking
4. Return top N results

## Implementation Details

### Type Definitions
Location: `src/types/index.ts`
```typescript
export interface Property {
  id: number;
  type: 'فيلا' | 'شقة' | 'قصر' | 'دوبلكس';
  title: string;
  description: string;
  price: number;
  location: string;
  features: string[];
  images: string[];
}

export interface PropertyWithEmbedding extends Property {
  embedding: number[];
}
```

### Key Functions

#### extractExactCriteria
Location: `src/utils/embeddings.ts`
```typescript
function extractExactCriteria(query: string): ExactCriteria
```
- Input: User's query string
- Output: ExactCriteria object
- Purpose: Parse query for exact requirements

#### propertyMatchesCriteria
Location: `src/utils/embeddings.ts`
```typescript
function propertyMatchesCriteria(property: Property, criteria: ExactCriteria): boolean
```
- Input: Property and ExactCriteria
- Output: Boolean
- Purpose: Check if property matches all specified criteria

#### findSimilarProperties
Location: `src/utils/embeddings.ts`
```typescript
export async function findSimilarProperties(
  query: string,
  limit: number = 10
): Promise<Array<Property & { similarityScore: number; city: string; district: string; rooms: number }>>
```
Process:
1. Extract criteria
2. Filter properties
3. Get query embedding
4. Calculate similarities
5. Sort and return results

#### API Handler
Location: `src/app/api/search/route.ts`
```typescript
export async function POST(req: NextRequest) {
  const { query, limit } = await validateRequest(req);
  return handleSearchRequest(query, limit);
}
```

## Performance Considerations

### Optimization Strategy
1. Filter first, then calculate similarities
2. Only compute embeddings for filtered subset
3. Binary storage format for embeddings

### Memory Usage
- Each embedding: 1536 dimensions * 4 bytes = 6.144 KB
- Total size depends on number of properties

## Testing

### Test Files
Location: `src/tests/`
```
tests/
├── search.test.ts     # Main search functionality tests
└── manual/
    └── frontend-tests.md  # Manual test cases
```

### Test Categories
1. Simple Searches
   - Empty queries
   - Basic property type searches
2. Natural Language Searches
   - Complex feature combinations
   - Room and bathroom specifications
3. Price-Based Searches
   - Range queries
   - Maximum/minimum price filters
4. Location-Based Searches
   - City + district combinations
   - District variations

### Validation Criteria
Each test validates:
1. Exact criteria matching
2. Semantic relevance
3. Result count and ordering
4. Feature presence

## Future Improvements
1. Expand AI usage to pattern matching
2. Add caching for common queries
3. Support more location variations
4. Add fuzzy matching for typos 