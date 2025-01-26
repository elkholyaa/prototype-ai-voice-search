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
export interface Property {
  id: string;
  type: 'فيلا' | 'شقة' | 'قصر' | 'دوبلكس';
  title: string;
  description: string;
  price: number;
  city: string;
  district: string;
  features: string[];
  images: string[];
}

export interface PropertyWithEmbedding extends Property {
  embedding: number[];
}
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
1. Extract exact criteria from query (type, location, rooms, price)
2. Filter properties based on exact criteria
3. Apply room-specific filtering when specified
4. Use embeddings to rank filtered results by semantic similarity

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
- **Cities and Districts**: Direct matching with standardized fields
  ```typescript
  interface LocationCriteria {
    city?: string;    // e.g., الرياض, جدة, الدمام
    district?: string; // e.g., النرجس, الياسمين, الملقا
  }
  ```
- District variations supported:
  ```typescript
  {
    'النرجس': ['النرجس', 'نرجس', 'الترجس', 'نارجس'],
    'الياسمين': ['الياسمين', 'ياسمين', 'الياسمبن'],
    'الملقا': ['الملقا', 'ملقا', 'الملقى', 'ملقى'],
    'العليا': ['العليا', 'عليا', 'العلية']
  }
  ```
- Supports location prefixes: حي, في, ب, بحي, في حي, منطقة, منطقه
- Direct city and district search in property filtering
- Empty query handling returns all properties
- Improved search result mapping with separate city and district fields

#### Room Counting
Location: `src/utils/search.ts`
```typescript
const roomVariations = {
  '6 غرف': ['6 غرف', '٦ غرف', 'ست غرف', 'ستة غرف', 'ست غرف نوم', 'ستة غرف نوم'],
  '4 غرف': ['4 غرف', '٤ غرف', 'اربع غرف', 'أربع غرف', 'اربعة غرف', 'أربعة غرف']
}
```

Patterns supported:
1. Direct numbers: "6 غرف", "4 غرف"
2. Arabic numerals: "٦ غرف", "٤ غرف"
3. Written numbers: "ست غرف", "اربع غرف"
4. With نوم: "ست غرف نوم", "اربع غرف نوم"
5. Variations in spelling: "ستة", "اربعة", "أربع"

Implementation details:
- Exact matching against room variations
- Integration with price and location filters
- Support for multiple room formats in the same query
- Validation of room counts against property data

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
  id: string;
  type: 'فيلا' | 'شقة' | 'قصر' | 'دوبلكس';
  title: string;
  description: string;
  price: number;
  city: string;
  district: string;
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

# Search Implementation Changes

## Changes Made
- Disabled API middleware temporarily
- Commented out AI embeddings-based search
- Switched to local text-based search implementation
- Removed redundant POST export
- Using direct search function without middleware wrapper

## How to Revert
1. Uncomment the API middleware import and usage:
   ```typescript
   import { withApiMiddleware } from '@/utils/api-middleware';
   ```
2. Uncomment the embeddings search:
   ```typescript
   import { findSimilarProperties } from '@/utils/embeddings';
   ```
3. Replace `searchProperties` with `findSimilarProperties`
4. Restore the middleware wrapper:
   ```typescript
   const handler = withApiMiddleware({
     POST: handlePost,
   });
   export const POST = handler.POST;
   ```

## Files Affected
- src/app/api/search/route.ts
- src/utils/search.ts (using existing implementation) 

## Temporary Implementation (2024 Updates)

### Current Search Flow
While maintaining the original AI-powered search system (currently commented out), we've added a simpler text-based search:

1. Original AI Search (Temporarily Disabled):
   - Embedding generation
   - Semantic similarity
   - API middleware
   - Result limits

2. Current Text-Based Search:
   - Simple string matching
   - Scoring system:
     - Title match: 0.5 points
     - Type match: 0.3 points
     - Location match: 0.3 points
     - Features match: 0.2 points
   - No result limits
   - Direct property matching

### Location Display Updates
Format standardized to: "city، حي district"
Example: "الرياض، حي النرجس"
Fallback: "غير محدد" for undefined values

### Files Modified (Not Replaced)
1. src/app/api/search/route.ts
   - API middleware commented out
   - Removed result limits
   - Using direct search function

2. src/utils/search.ts
   - Added text-based search
   - Updated location formatting
   - Added undefined handling

### How to Switch Back
The original implementation remains in the codebase (commented out) for easy reversion.
See the original documentation above for full AI search implementation details. 

# Search Implementation Documentation

## History & Updates

### Initial Implementation (Previous)
- Basic text matching
- Simple property type and location filtering
- Price filtering in thousands (1000 = 1M SAR)
- Location format: "فيلا في النرجس"

### Current Implementation (Latest)
- Enhanced natural language search
- Improved feature combination matching
- Standardized price format (actual values in SAR)
- Location format: "الرياض - حي النرجس"
- Proper price formatting with English numerals and commas
- Consistent property titles without room counts
- Complete descriptions for AI embeddings (currently inactive)

## Search Features

### Verified Search Capabilities
![Verified Search Test](../images/tests/search-test-pass-2024-03.png)
- Natural language query processing
- Multiple location search (e.g., "النرجس او الياسمين")
- Feature combinations (e.g., "مسبح ومجلس")
- Price range understanding (e.g., "ما تطلع فوق ٣ مليون ونص")
- Dialect/typo handling:
  - Property types: فيلا، فله، فلة، فيلة، فلل
  - Locations: النرجس، نرجس، الترجس
  - Features: مسبح، حمام سباحة، حمام السباحة

### Property Types
- فيلا (Villa): 2,500,000 - 4,000,000 SAR
- شقة (Apartment): 750,000 - 1,500,000 SAR
- دوبلكس (Duplex): 1,800,000 - 3,000,000 SAR
- قصر (Palace): 6,000,000 - 8,000,000 SAR

### Location Support
- City and district matching
- Standardized format: "{city} - حي {district}"
- Common districts: النرجس، الملقا
- Major cities: الرياض، جدة، مكة، الدمام

### Feature Matching
- Room counts
- Amenities (مسبح، مجلس، etc.)
- Bonus scoring for feature combinations
- Special features (تكييف مركزي، مدخل خاص، etc.)

### Price Ranges
- All prices in SAR
- Formatted with English numerals
- Comma-separated thousands
- Example: 2,500,000 ريال

## Technical Notes
- Search results include similarity scores
- Property descriptions maintain all fields for future AI embeddings
- Fallback images implemented for missing property images 

## Advanced Natural Language Searches

### Test Cases and Validation
The search system includes comprehensive test cases for natural language queries, ensuring consistent results across different phrasings. Examples include:

#### Property Type and Location
```typescript
// Duplex in Jeddah with specific features
{
  query1: "عاوز دوبلكس فى جدههناا فيها 6 غرف لاى @@ اقل من 2 مليون وحوش كبير",
  query2: "محتاجين دبلوكس ف مدينه جده يكون سته غرف نوم و#سعره معقول تحت ٢ مليوون ريال سعودى && يكون معاه حديقه واسعه",
  expectedResults: {
    type: "دوبلكس",
    city: "جدة",
    features: ["6 غرف", "حديقة"],
    maxPrice: 2000000
  }
}
```

### Search Capabilities
The natural language search system supports:

1. **Dialect Variations**
   - Gulf dialect (ابغى, ودي)
   - Egyptian dialect (عاوز, عايز)
   - Levantine dialect (بدي)
   - Mixed dialect expressions

2. **Number Formats**
   - Arabic numerals (٦ غرف)
   - English numerals (6 غرف)
   - Written numbers (ست غرف)
   - Price variations (مليونين, ٢ مليون)

3. **Feature Recognition**
   - Base features (مسبح, حديقة)
   - Compound features (مسبح كبير, حديقة واسعة)
   - Feature variations (حوش = حديقة)
   - Location-specific terms

4. **Price Understanding**
   - Exact amounts (2 مليون)
   - Range expressions (اقل من مليونين)
   - Informal terms (مليون ونص)
   - Currency variations (ريال, SAR)

### Implementation Details

#### Query Processing
```typescript
interface ProcessedQuery {
  type?: string;
  city?: string;
  district?: string;
  features: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  rooms?: number;
}
```

The search system processes queries through multiple stages:
1. Dialect normalization
2. Feature extraction
3. Price parsing
4. Location identification
5. Room count extraction

#### Result Validation
Each search result is validated against:
- Property type match
- Location accuracy
- Feature presence
- Price constraints
- Room count match

### Performance Considerations
- Caching: 5-minute LRU cache for frequent queries
- Rate limiting: 10 requests per minute
- Response time: Average < 200ms
- Result limit: Default 10, configurable up to 50 

## Structured Query Display

### Overview
The search system now displays a structured representation of the user's query under the search box. This helps users understand how their natural language query is being interpreted.

### Features
- Color-coded display
  - Field labels in red (e.g., النوع, الحي, ميزة)
  - Values in blue (e.g., فيلا, النرجس, 6 غرف)
- Supports multiple text variations
  - Arabic numerals (٢, ٣)
  - Different spellings (فيلا/فله, دوبلكس/دبلوكس)
  - Various price phrases (اقل من, تحت, ما تطلع فوق)
- RTL text display
- Dash-separated components for clarity

### Example Queries
```typescript
Input: "ابي فله في النرجس، يكون عندها مسبح ومجلس واسع وما يزيد سعرها عن ٣ مليون و٦ غرف"
Output: النوع: فيلا - الحي: النرجس - ميزة: 6 غرف - ميزة: مسبح - ميزة: مجلس - الحد الأقصى للسعر: 3 مليون
```

### Implementation
The structured query is generated by:
1. Parsing the input query for key components
2. Identifying property type, location, features, and price limits
3. Formatting with color-coded spans
4. Joining components with dash separators 