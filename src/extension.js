"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const marked_1 = require("marked");
const highlight_js_1 = __importDefault(require("highlight.js"));
const Handlebars = __importStar(require("handlebars"));
const puppeteer = __importStar(require("puppeteer"));
function activate(context) {
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
            const renderer = new marked_1.marked.Renderer();
            marked_1.marked.setOptions({
                renderer
            });
            renderer.code = ({ text, lang, escaped }) => {
                if (lang && highlight_js_1.default.getLanguage(lang)) {
                    return highlight_js_1.default.highlight(text, { language: lang }).value;
                }
                else {
                    return highlight_js_1.default.highlightAuto(text).value;
                }
            };
            htmlContent = await marked_1.marked.parse(content);
        }
        else {
            // Code file to HTML with syntax highlighting
            const languageId = document.languageId;
            const highlightedCode = highlight_js_1.default.highlight(content, { language: languageId }).value;
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
        const outputPath = path.join(path.dirname(filePath), `${path.basename(filePath, fileExtension)}.pdf`);
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
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to generate PDF: ${error}`);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map