# PrintGenius

[![VS Code Extension](https://img.shields.io/visual-studio-marketplace/v/printgenius.printgenius)](https://marketplace.visualstudio.com/items?itemName=printgenius.printgenius)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Convert your code and markdown files into beautifully styled PDFs with syntax highlighting, headers, and footers. Perfect for sharing code snippets, documentation, or creating professional reports.

## Features

- **Beautiful Syntax Highlighting**: Code maintains its VS Code styling in the PDF using Highlight.js
- **Markdown Support**: Renders markdown files with full formatting and syntax highlighting
- **Professional Layout**: Clean header and footer with customizable logos, version numbers, and dates
- **Page Numbers**: Automatically adds page numbers to your PDFs
- **Customization Options**: Add your company logos, version numbers, and custom dates
- **Fast & Reliable**: Uses Puppeteer for high-quality PDF generation

## Installation

1. Open VS Code
2. Press `Ctrl+P` (or `Cmd+P` on macOS)
3. Type `ext install printgenius.printgenius`
4. Press Enter

## Usage

1. Open any code file or markdown document in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette
3. Type "PrintGenius: Convert to PDF" and press Enter
4. Optional: Enter version number and date when prompted
5. Optional: Select logo images for the header
6. Your PDF will be generated in the same directory as your source file

## Examples

### Code Files
- Converts any code file to PDF while preserving syntax highlighting
- Adds professional header with optional logos
- Includes footer with version, date, and page numbers

### Markdown Files
- Renders markdown with full formatting
- Code blocks maintain syntax highlighting
- Perfect for documentation and reports

## Configuration

PrintGenius works out of the box with no configuration needed. However, you can customize:

- Header logos (left and right)
- Version number in footer
- Date in footer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Bug Reports

Found a bug? Please open an issue on our [GitHub repository](https://github.com/printgenius/printgenius/issues).

---

Made with ❤️ by PrintGenius Team
