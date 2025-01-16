# Changelog

## [Unreleased]

### Added
- Integrated NLP-based search functionality in the main page component
- Enhanced search capabilities to handle complex Arabic queries
- Added support for compound search terms (e.g., "فيلا مع مسبح في الرياض")
- Added intelligent feature extraction from search queries
- Added comprehensive test coverage for Arabic NLP and property search
- Added proper handling of compound Arabic features
- Added case-insensitive text matching across all searches
- Added 50 sample properties with detailed features and images
- Added improved feature matching logic for compound features (e.g., "مسبح للأطفال" matches "مسبح")
- Added base feature extraction for better matching accuracy

### Changed
- Reorganized project structure for better maintainability
  - Moved all source code under `/src` directory
  - Consolidated app directory to `/src/app`
  - Moved data files to `/src/data`
  - Organized types and utilities properly
- Updated import paths to use `@/` alias for better maintainability
- Removed redundant directories and files
  - Removed duplicate `/app` directory
  - Removed redundant `/data` directory
  - Cleaned up project root
- Fixed TypeScript configuration for proper path resolution
- Enhanced code organization following Next.js 13+ best practices
- Improved feature matching algorithm to prioritize base feature matches

### Fixed
- Fixed import paths to use proper `@/` alias
- Fixed TypeScript configuration for better path resolution
- Fixed project structure redundancy
- Fixed search functionality to properly handle Arabic language queries
- Fixed compound search terms processing
- Fixed feature matching logic to better handle compound features
- Fixed district extraction in location matching

## [0.2.1] - 2024-03-XX
### Fixed
- Image container height and positioning issues with Next.js Image component
- Optimized image loading with proper container styling
- Fixed grid layout responsiveness in development environment to match production behavior

## [0.2.0] - 2024-01-14
### Updated
- Upgraded to Next.js 14.0.4
- Upgraded to React 18.2.0
- Upgraded to TypeScript 5.3.3
- Upgraded to Tailwind CSS 3.4.1
- Updated all dependencies to latest stable versions
- Simplified project structure
- Enhanced Arabic support with Noto Kufi Arabic font

### Changed
- Moved to root-level file structure
- Updated browser compatibility requirements
- Improved RTL support
- Enhanced type definitions

## [0.1.0] - 2024-01-11
### Added
- Initial project setup with Next.js
- Basic voice input processing
- Property data structure
- RTL support for Arabic
- Basic UI components
- Development documentation

### Changed
- Updated project structure for better organization
- Refined development guidelines

### Fixed
- TypeScript strict mode compatibility issues
- Initial routing setup 