# Contributing to PrintGenius

Thank you for your interest in contributing to PrintGenius! We aim to make code and documentation sharing easier through beautiful PDF exports, and we welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community

## How to Contribute

### Reporting Bugs

1. **Check Existing Issues**: Before creating a new issue, please search existing ones to avoid duplicates
2. **Create a Clear Report**: When creating a new issue, include:
   - A clear, descriptive title
   - Steps to reproduce the issue
   - Expected behavior
   - Actual behavior
   - VS Code version
   - PrintGenius version
   - Sample code or markdown file (if relevant)

### Suggesting Enhancements

1. **Use the Feature Request Template**: When suggesting new features, include:
   - Clear use case and motivation
   - Proposed solution
   - Alternative solutions considered
   - Additional context or screenshots

### Pull Requests

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Branch**: Make your changes in a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Follow Code Style**:
   - Use TypeScript for new code
   - Follow existing code formatting
   - Add comments for complex logic
   - Update documentation as needed

4. **Test Your Changes**:
   - Run existing tests: `npm test`
   - Add new tests for new features
   - Test with different file types (code, markdown)
   - Verify PDF output quality

5. **Commit Guidelines**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     ```
     feat: Add new template option
     fix: Resolve PDF generation error
     docs: Update installation instructions
     ```

6. **Submit Pull Request**:
   - Provide a clear description of changes
   - Link related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

## Development Setup

1. **Prerequisites**:
   - Node.js (Latest LTS version)
   - VS Code
   - Git

2. **Installation**:
   ```bash
   git clone https://github.com/alpha912/printgenius.git
   cd printgenius
   npm install
   ```

3. **Running Locally**:
   - Press F5 in VS Code to start debugging
   - Use "Extension Development Host" to test changes

## Project Structure

- `src/`: TypeScript source files
  - `extension.ts`: Main extension code
- `resources/`: Templates and styles
  - `template.html`: PDF generation template
  - `hljsStyles.hbs`: Syntax highlighting styles
- `test/`: Test files
- `docs/`: Documentation

## Need Help?

- **Questions**: Open a [Discussion](https://github.com/alpha912/printgenius/discussions)
- **Documentation**: Check our [Wiki](https://github.com/alpha912/printgenius/wiki)
- **Issues**: Search [existing issues](https://github.com/alpha912/printgenius/issues)

## License

By contributing to PrintGenius, you agree that your contributions will be licensed under the MIT License.