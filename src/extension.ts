import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { marked, Renderer, Tokens } from 'marked';
import hljs from 'highlight.js';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

// Initialize mermaid with default config
let mermaidAPI: any = null;

// Dynamic import of mermaid
const initMermaid = async () => {
    if (!mermaidAPI) {
        const mermaid = await import('mermaid');
        mermaidAPI = mermaid.default;
        mermaidAPI.initialize({ 
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'Segoe UI'
        });
    }
    return mermaidAPI;
};

// Create a Mermaid renderer
const renderMermaidDiagram = async (code: string): Promise<string> => {
    try {
        const mermaid = await initMermaid();
        const diagramId = 'mermaid-' + Math.random().toString(36).substring(7);
        const { svg } = await mermaid.render(diagramId, code);
        return `<div class="mermaid-diagram">${svg}</div>`;
    } catch (error: unknown) {
        console.error('Error rendering Mermaid diagram:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `<pre><code class="error">Error rendering diagram: ${errorMessage}</code></pre>`;
    }
};

interface ExtendedRenderer extends Renderer {
    mermaidDiagrams?: Map<string, string>;
}

// Async function to parse markdown with Mermaid diagrams
async function parseMarkdownWithMermaid(content: string): Promise<string> {
    // Create a custom renderer
    const renderer: ExtendedRenderer = new marked.Renderer();
    renderer.mermaidDiagrams = new Map<string, string>();

    // Override the code renderer with proper type signature
    const originalCode = renderer.code.bind(renderer);
    renderer.code = function({ text, lang, escaped }: Tokens.Code): string {
        if (lang === 'mermaid' && this.mermaidDiagrams) {
            const placeholder = `MERMAID_DIAGRAM_${Math.random().toString(36).substring(7)}`;
            this.mermaidDiagrams.set(placeholder, text);
            return placeholder;
        }
        
        // Handle other code blocks with syntax highlighting
        if (lang && hljs.getLanguage(lang)) {
            const highlighted = hljs.highlight(text, { language: lang }).value;
            return `<pre><code class="hljs ${lang}">${highlighted}</code></pre>`;
        }
        
        // Fallback to auto-detection
        const highlighted = hljs.highlightAuto(text).value;
        return `<pre><code class="hljs">${highlighted}</code></pre>`;
    };

    // First pass: Convert markdown to HTML with placeholders
    marked.setOptions({ renderer });
    const initialHtml = await marked.parse(content);
    
    // Second pass: Replace Mermaid placeholders with actual diagrams
    if (renderer.mermaidDiagrams.size > 0) {
        try {
            // First, render all diagrams
            const renderedDiagrams = await Promise.all(
                Array.from(renderer.mermaidDiagrams.entries()).map(async ([placeholder, code]) => {
                    const rendered = await renderMermaidDiagram(code);
                    return { placeholder, rendered };
                })
            );
            
            // Then, replace all placeholders with rendered diagrams
            let finalHtml = initialHtml;
            for (const { placeholder, rendered } of renderedDiagrams) {
                finalHtml = finalHtml.replace(placeholder, rendered);
            }
            return finalHtml;
        } catch (error) {
            console.error('Error rendering Mermaid diagrams:', error);
            return initialHtml; // Fallback to initial HTML if rendering fails
        }
    }
    
    return initialHtml;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('PrintGenius extension is now active!');
    
    try {
        // Register the command
        console.log('Registering PrintGenius command...');
        let disposable = vscode.commands.registerCommand('printgenius.convert', async (uri?: vscode.Uri) => {
            console.log('PrintGenius command triggered!');
            vscode.window.showInformationMessage('PrintGenius command triggered successfully!');
            
            try {
                // Get the document content either from URI (context menu) or active editor
                let document: vscode.TextDocument;
                if (uri) {
                    document = await vscode.workspace.openTextDocument(uri);
                } else {
                    const editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        vscode.window.showErrorMessage('No file selected.');
                        return;
                    }
                    document = editor.document;
                }

                const content = document.getText();
                const filePath = document.fileName;
                const fileExtension = path.extname(filePath);

                // Read Highlight.js CSS
                const hljsStylesPath = require.resolve('highlight.js/styles/default.css');
                const hljsStyles = fs.readFileSync(hljsStylesPath, 'utf-8');
                Handlebars.registerPartial('hljsStyles', hljsStyles);

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
                let htmlContent: string;

                // Handle different file types
                if (fileExtension === '.md') {
                    htmlContent = await parseMarkdownWithMermaid(content);
                } else {
                    // Try to detect the language for syntax highlighting
                    let language = document.languageId;
                    
                    // If VS Code doesn't recognize the language, try to detect it from the file extension
                    if (language === 'plaintext') {
                        const extensionMap: { [key: string]: string } = {
                            '.js': 'javascript',
                            '.ts': 'typescript',
                            '.py': 'python',
                            '.java': 'java',
                            '.cpp': 'cpp',
                            '.hpp': 'cpp',
                            '.c': 'c',
                            '.h': 'c',
                            '.cs': 'csharp',
                            '.css': 'css',
                            '.scss': 'scss',
                            '.less': 'less',
                            '.html': 'html',
                            '.xml': 'xml',
                            '.json': 'json',
                            '.yaml': 'yaml',
                            '.yml': 'yaml',
                            '.sh': 'bash',
                            '.bash': 'bash',
                            '.php': 'php',
                            '.rb': 'ruby',
                            '.rust': 'rust',
                            '.go': 'go',
                            '.sql': 'sql',
                            '.kt': 'kotlin',
                            '.swift': 'swift',
                            '.dart': 'dart',
                            '.r': 'r',
                            '.matlab': 'matlab'
                        };
                        language = extensionMap[fileExtension.toLowerCase()] || 'plaintext';
                    }

                    try {
                        // Try to highlight with detected language
                        let highlightedCode;
                        if (language !== 'plaintext' && hljs.getLanguage(language)) {
                            highlightedCode = hljs.highlight(content, { language }).value;
                        } else {
                            // Try auto-detection for unknown file types
                            const result = hljs.highlightAuto(content, Object.keys(hljs.listLanguages()));
                            if (result.relevance > 5) { // Only use auto-detection if confidence is high
                                highlightedCode = result.value;
                            } else {
                                // Fall back to plain text with special character escaping
                                highlightedCode = content
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/"/g, '&quot;')
                                    .replace(/'/g, '&#039;');
                            }
                        }

                        // Add line numbers
                        const lines = highlightedCode.split('\n');
                        const lineNumbers = lines.map((_, i) => `<span class="line-number">${i + 1}</span>`).join('\n');
                        
                        htmlContent = `
                            <div class="code-container">
                                <div class="line-numbers">
                                    ${lineNumbers}
                                </div>
                                <pre><code class="hljs ${language}">${highlightedCode}</code></pre>
                            </div>
                        `;
                    } catch (error) {
                        console.error('Error during syntax highlighting:', error);
                        // Fallback to plain text if highlighting fails
                        htmlContent = `<pre><code>${content
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#039;')}</code></pre>`;
                    }
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
                
                if (!fs.existsSync(templatePath)) {
                    throw new Error(`Template file not found at ${templatePath}`);
                }

                const templateHtml = fs.readFileSync(templatePath, 'utf-8');
                if (!templateHtml) {
                    throw new Error('Template file is empty');
                }

                const template = Handlebars.compile(templateHtml);
                const finalHtml = template(templateData);

                // Generate PDF using Puppeteer
                const outputPath = path.join(
                    path.dirname(filePath),
                    `${path.basename(filePath, fileExtension)}.pdf`
                );

                // Ensure the output directory exists
                const outputDir = path.dirname(outputPath);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                const browser = await puppeteer.launch({
                    headless: true  // Use boolean true for headless mode
                });
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
                console.error('PrintGenius command error:', error);
                vscode.window.showErrorMessage(`Failed to generate PDF: ${error}`);
            }
        });

        context.subscriptions.push(disposable);
        console.log('PrintGenius command registered successfully!');
        vscode.window.showInformationMessage('PrintGenius extension is ready!');
    } catch (error) {
        console.error('PrintGenius activation error:', error);
        vscode.window.showErrorMessage(`Failed to activate PrintGenius: ${error}`);
    }
}

export function deactivate() {
    console.log('PrintGenius extension is now deactivated!');
}
