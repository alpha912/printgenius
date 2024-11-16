# Change Log

All notable changes to the "PrintGenius" extension are documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - 2024-01-16

This is the initial release of PrintGenius VS Code extension, providing core functionality for converting code and Markdown files into high-quality PDFs.

### Added

#### Core Features
- **Markdown and Code File Support**
  - Conversion of Markdown (.md) and code files to PDF
  - Syntax highlighting powered by Highlight.js
  - Integration with Marked for Markdown parsing
- **Professional PDF Output**
  - Customizable header with optional logo
  - Professional footer with version number and date
  - Automatic page numbering
  - Clean and modern HTML template (Handlebars-based)
  - High-quality PDF generation via Puppeteer
- **Error Handling**
  - Comprehensive error feedback
  - User-friendly error messages

#### Technical Foundation (6340592)
- Initial extension scaffolding
- Development environment setup:
  - TypeScript and ESLint configuration
  - Webpack bundling
  - Mocha and Chai test suite
  - VS Code debugging setup

#### Core Implementation (d477534)
- PDF conversion engine
- Template system integration
- Syntax highlighting system
- Header/footer customization
- Markdown processing pipeline

#### Documentation and Legal
- MIT License (7165fee)
- Enhanced documentation (bf33cc7):
  - Comprehensive README
  - Feature descriptions
  - Installation guide
  - Configuration options
  - VS Code Marketplace badges
- Project guidelines (da3bfb9):
  - Code of Conduct (Contributor Covenant v2.1)
  - Contribution guidelines
  - Changelog

### Technical Stack
- VS Code Extension API
- TypeScript
- Highlight.js for syntax highlighting
- Marked for Markdown parsing
- Puppeteer for PDF generation
- Handlebars for templating
- Webpack for bundling

### Known Issues
- None reported in initial release

## [Upcoming]
Planned improvements:
- Enhanced customization options
- Support for additional file types
- Template customization features
- Performance optimizations
- User-requested features