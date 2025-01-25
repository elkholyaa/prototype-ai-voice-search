# Changelog

## [Unreleased]
### Added
- Room-specific filtering in search queries
  - Support for exact room count matching (e.g., "6 غرف", "٦ غرف")
  - Written number support (e.g., "ست غرف")
  - Integration with price and location filters
- Enhanced test suite for natural language search
  - Added colloquial Arabic expressions and dialects
  - Included common spelling mistakes
  - Added feature description variations
  - More flexible validation for semantic search
  - Tests for mixed formal/informal queries
  - Advanced dialect-specific test cases:
    - Gulf dialect with price negotiations
    - Egyptian dialect with family-focused queries
    - Levantine dialect with lifestyle preferences
    - Mixed dialect expressions
- Rate limiting for search API (10 requests/minute)
- LRU cache for search results with 5-minute TTL
- Zod input validation for search requests
- Swagger API documentation
- Enhanced error handling and response formatting

### Changed
- Updated property structure with separate city and district fields
- Standardized price formatting (English numerals with commas)
- Improved property listings with consistent formats
- Fixed empty query handling to return all properties
- Improved search result mapping
- Fixed image fallbacks
- Updated test validation to better match semantic search behavior
- Made search validation more flexible for real-world queries
- Improved natural language processing capabilities
- Refined semantic search implementation
- Enhanced Arabic query processing
- testing from hossam laptop
- Temporarily disabled AI-powered search functionality
- Switched to text-based search implementation
- Removed search result limits
- Updated location display format to "city، حي district"
- Added fallback handling for undefined values

### Upcoming
- Frontend integration with search API
  - Dynamic search results display
  - Loading states and error handling
  - Real-time search updates
- Testing and optimization
  - Integration tests for end-to-end flows
  - Performance benchmarking
  - Vector search optimization

## [0.2.0] - 2024-01-15
### Added
- Basic property listing functionality
- RTL support with Noto Kufi Arabic font
- Responsive design implementation
- Property filtering UI components
- NLP-based Arabic search functionality
- Support for compound Arabic features
- Feature matching with base feature extraction
- Case-insensitive text matching
- District-aware location search

### Changed
- Updated to Next.js 14
- Improved TypeScript configuration
- Enhanced styling with Tailwind CSS
- Optimized image loading with proper container styling
- Enhanced Arabic language support

### Fixed
- Image container height and positioning issues
- Grid layout responsiveness
- TypeScript strict mode compatibility
- Arabic text processing edge cases

## [0.1.0] - 2024-01-10
### Added
- Initial project setup
- Next.js with TypeScript configuration
- Tailwind CSS integration
- Basic project structure
- Development documentation
- RTL support for Arabic

### Changed
- Updated project structure for better organization
- Refined development guidelines 

### Preserved (Currently Disabled)
- OpenAI embeddings search
- API middleware
- Rate limiting 

## [2.1.0] - 2024-03-XX

### Added
- Verified natural language search capabilities
- Support for multiple location search
- Feature combination matching
- Price range understanding
- Comprehensive synonym handling

### Changed
- Updated property price ranges to realistic values
- Standardized property titles and descriptions
- Improved location display format
- Enhanced search scoring system for feature combinations

### Fixed
- Image placeholder issues
- Price formatting inconsistencies
- Location display redundancy 

## [Latest] - 2024-01-25
### Added
- Comprehensive documentation for Advanced Natural Language Searches
- Detailed test cases for complex property queries
- Multi-dialect support documentation
- Feature recognition and variation handling
- Price understanding with informal terms
- Performance metrics and optimization details

### Enhanced
- Search capabilities documentation with detailed examples
- README structure with clearer feature organization
- Technical documentation with implementation details
- Test case documentation with expected results

### Updated
- Property search interface documentation
- Query processing documentation
- Result validation criteria
- Performance considerations 