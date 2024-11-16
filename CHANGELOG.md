# Change Log

All notable changes to the "PrintGenius" extension are documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - 2024-01-16

### Added
- Initial VS Code extension structure (6340592)
  - Basic extension scaffolding
  - Development environment setup:
    - package.json and tsconfig.json configuration
    - ESLint and TypeScript setup
    - Webpack bundling process
    - Test suite with Mocha and Chai
    - VS Code debugging configuration
  - Basic 'helloWorld' command implementation

- Core PDF conversion functionality (d477534)
  - Support for markdown and code files
  - Syntax highlighting using Highlight.js
  - Customizable PDF output:
    - Header with optional logo images
    - Footer with version and date
    - Automatic page numbering
  - HTML template system:
    - resources/template.html for layout
    - resources/hljsStyles.hbs for syntax highlighting
  - Integration with:
    - Marked for markdown parsing
    - Puppeteer for PDF generation
  - Comprehensive error handling

- Project licensing and documentation
  - MIT License added (7165fee)
  - Enhanced documentation (bf33cc7):
    - Improved README structure
    - Clear feature descriptions
    - Installation and usage guides
    - Configuration options
    - VS Code Marketplace badges
    - Professional formatting

- Initial release preparation (da3bfb9)
  - Code of Conduct (Contributor Covenant v2.1)
  - Contribution guidelines
  - Comprehensive changelog
  - Final documentation updates

### Technical Stack
- VS Code Extension API
- TypeScript
- Highlight.js for syntax highlighting
- Marked for markdown parsing
- Puppeteer for PDF generation
- Handlebars for templating

### Known Issues
- None reported in initial release

## [Upcoming]
Planned features and improvements:
- Additional customization options
- Support for more file types
- Template customization
- Performance optimizations
- Enhanced error handling
- User-requested features