import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

export default class Md2PdfDoc {
    static _add_style() {
        if (document.getElementById('pdf_element_context_style')) 
            return 

        const styleTag = document.createElement('style');
        styleTag.id = 'pdf_element_context_style';
        styleTag.textContent = `
                #pdf_element_context {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                #pdf_element_context h1 {
                    font-size: 24px;
                    color: #2c3e50;
                }
                #pdf_element_context h2 {
                    font-size: 18px;
                }
                #pdf_element_context p {
                    margin-bottom: 12px;
                }
                #pdf_element_context code {
                    background: #f4f4f4;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                }
                #pdf_element_context pre {
                    background: #f4f4f4;
                    padding: 10px;
                    border-radius: 4px;
                }
                #pdf_element_context ul {
                    padding-left: 20px;
                    list-style-type: disc;
                }
                #pdf_element_context ol {
                    padding-left: 20px;
                    list-style-type: decimal;
                }
                #pdf_element_context blockquote {
                    border-left: 4px solid #0066cc;
                    padding-left: 10px;
                    color: #555;
                }
                #pdf_element_context table {
                    border-collapse: collapse;
                    width: 100%;
                    margin-bottom: 12px;
                }
                #pdf_element_context th, #pdf_element_context td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                #pdf_element_context th {
                    background-color: #f4f4f4;
                }
            `;
        document.head.appendChild(styleTag);
    }

    static _remove_style() {
        const styleTag = document.getElementById('pdf_element_context_style');
        if (styleTag) {
            styleTag.remove();
        }
    }

    static async DownloadPDF(markdownContent, fileName) {
        if (!markdownContent) {
            console.error('Nessun contenuto Markdown trovato');
            return;
        }

        Md2PdfDoc._add_style()
        const htmlContent = marked.parse(markdownContent);

        const element = document.createElement('div');
        element.id = 'pdf_element_context';
        element.innerHTML = htmlContent;

        const opt = {
            margin: 1,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'cm', format: 'A4', orientation: 'portrait' }
        };

        try {
            await html2pdf().from(element).set(opt).save()
        } catch (error) {
            console.error('Errore nella generazione del PDF:', error);
        } finally {
            Md2PdfDoc._remove_style()
        }
    }

    static async DownloadDOCX(markdownContent, fileName) {
        if (!markdownContent) {
            console.error('Nessun contenuto Markdown trovato');
            return;
        }

        const htmlContent = marked.parse(markdownContent);
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    .doc-content {
                        font-family: 'Times New Roman', serif;
                        line-height: 1.6;
                        color: #000;
                    }
                    .doc-content h1 { font-size: 26px; font-weight: bold; color: #2c3e50; }
                    .doc-content h2 { font-size: 20px; font-weight: bold; }
                    .doc-content p { margin-bottom: 12px; }
                    .doc-content code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; }
                    .doc-content pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
                    .doc-content ul { padding-left: 20px; list-style-type: disc; }
                    .doc-content ol { padding-left: 20px; list-style-type: decimal; }
                    .doc-content blockquote { border-left: 4px solid #0066cc; padding-left: 10px; color: #555; }
                    .doc-content table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
                    .doc-content th, .doc-content td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .doc-content th { background-color: #f4f4f4; }
                </style>
            </head>
            <body class="doc-content">
                ${htmlContent}
            </body>
            </html>
        `;

          try {
            const docxBlob = window.htmlDocx.asBlob(htmlTemplate)
            const url = URL.createObjectURL(docxBlob, fileName);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Errore nella conversione:', error);
        }
        
    }

}

window.Md2PdfDoc = Md2PdfDoc; // Expose the class globally if