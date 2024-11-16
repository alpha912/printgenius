import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import hljs from 'highlight.js';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

export function activate(context: vscode.ExtensionContext) {
  // Read Highlight.js CSS
  const hljsStylesPath = require.resolve('highlight.js/styles/default.css');
  const hljsStyles = fs.readFileSync(hljsStylesPath, 'utf-8');
  Handlebars.registerPartial('hljsStyles', hljsStyles);

  let disposable = vscode.commands.registerCommand('printgenius.convertToPdf', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('No active editor detected.');
      return;
    }

    const document = editor.document;
    const content = document.getText();
    const filePath = document.fileName;
    const fileExtension = path.extname(filePath);

    // Prompt for version and date
    const version = await vscode.window.showInputBox({
      prompt: 'Enter the version number (e.g., v2.0.4):',
      value: 'v1.0.0',
    });

    const date = await vscode.window.showInputBox({
      prompt: 'Enter the date (YYYY-MM-DD):',
      value: new Date().toISOString().split('T')[0],
    });

    // Prompt for logos
    const logoLeftUri = await vscode.window.showOpenDialog({
      canSelectMany: false,
      openLabel: 'Select Top Left Logo (optional)',
      filters: { Images: ['png', 'jpg', 'jpeg', 'gif', 'svg'] },
    });

    const logoRightUri = await vscode.window.showOpenDialog({
      canSelectMany: false,
      openLabel: 'Select Top Right Logo (optional)',
      filters: { Images: ['png', 'jpg', 'jpeg', 'gif', 'svg'] },
    });

    // Convert content to HTML
    let htmlContent = '';

    if (fileExtension === '.md') {
      // Markdown to HTML
      const renderer = new marked.Renderer();
      marked.setOptions({
        renderer
      });
      
      renderer.code = ({ text, lang, escaped }) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(text, { language: lang }).value;
        } else {
          return hljs.highlightAuto(text).value;
        }
      };
      
      htmlContent = await marked.parse(content);
    } else {
      // Code file to HTML with syntax highlighting
      const languageId = document.languageId;
      const highlightedCode = hljs.highlight(content, { language: languageId }).value;
      htmlContent = `<pre><code class="hljs ${languageId}">${highlightedCode}</code></pre>`;
    }

    // Prepare data for the template
    const templateData = {
      content: htmlContent,
      version: version,
      date: date,
      filePath: filePath,
      logoLeft: logoLeftUri ? logoLeftUri[0].fsPath : null,
      logoRight: logoRightUri ? logoRightUri[0].fsPath : null,
      hljsStyles: hljsStyles,
    };

    // Load and compile the Handlebars template
    const templatePath = path.join(context.extensionPath, 'resources', 'template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateHtml);
    const finalHtml = template(templateData);

    // Generate PDF using Puppeteer
    const outputPath = path.join(
      path.dirname(filePath),
      `${path.basename(filePath, fileExtension)}.pdf`
    );

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: { top: '50px', bottom: '70px', left: '50px', right: '50px' },
        displayHeaderFooter: false,
      });
      await browser.close();
      vscode.window.showInformationMessage(`PDF generated at ${outputPath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to generate PDF: ${error}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
