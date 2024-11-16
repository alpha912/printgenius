# Change Log

All notable changes to the "PrintGenius" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - 2024

### Added
- Initial release of PrintGenius VS Code extension
- Core functionality for converting code and markdown files to PDF
- Features:
  - Markdown and code file support with syntax highlighting
  - Customizable header with optional logo images
  - Professional footer with version number and date
  - Automatic page numbering
  - Clean and modern HTML template
  - High-quality PDF generation using Puppeteer
  - Comprehensive error handling
- Documentation:
  - Detailed README with installation and usage instructions
  - Code of Conduct (Contributor Covenant v2.1)
  - MIT License
  - Contribution guidelines

### Technical Details
- Project structure:
  - Handlebars templates for HTML generation
  - TypeScript implementation
  - ESLint and TypeScript configuration
  - Mocha and Chai test suite
  - VS Code debugging setup
- Dependencies:
  - Highlight.js for syntax highlighting
  - Marked for markdown parsing
  - Puppeteer for PDF generation

### Development Process
1. Initial Extension Structure (6340592)
   - Basic VS Code extension setup
   - Development environment configuration
   - Test suite implementation

2. Core Functionality Implementation (d477534)
   - PDF generation features
   - Template system
   - Syntax highlighting integration
   - User customization options

3. Documentation and Polish (bf33cc7)
   - Enhanced README
   - Improved documentation structure
   - Added usage examples
   - Refined configuration options

## [Upcoming]
- Additional customization options
- Support for more file types
- Template customization
- Performance optimizations
- Enhanced error handling