/**
 * PDF Generation Service
 * Generates professional academic PDFs from paper data using Puppeteer
 */

import puppeteer from 'puppeteer';
import { join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

// PDF output directory
const PDF_DIR = join(process.cwd(), 'public', 'pdfs');

// Ensure PDF directory exists
if (!existsSync(PDF_DIR)) {
    mkdirSync(PDF_DIR, { recursive: true });
}

/**
 * Generate a professional academic PDF from paper data
 * @param {Object} paper - Paper data object
 * @returns {Promise<string>} - Path to generated PDF
 */
export async function generatePaperPDF(paper) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set viewport for A4 paper
        await page.setViewport({ width: 794, height: 1123 });

        // Generate HTML content
        const html = generatePaperHTML(paper);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const filename = `${paper.slug || paper.id}.pdf`;
        const pdfPath = join(PDF_DIR, filename);

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '25mm',
                bottom: '25mm',
                left: '25mm',
                right: '25mm'
            },
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="font-size: 9px; color: #666; width: 100%; text-align: center; padding: 0 20mm;">
                    <span style="float: left;">Elitech Hub Research Repository</span>
                    <span style="float: right;">${paper.doi || ''}</span>
                </div>
            `,
            footerTemplate: `
                <div style="font-size: 9px; color: #666; width: 100%; text-align: center; padding: 0 20mm;">
                    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
                </div>
            `
        });

        await browser.close();
        return `/pdfs/${filename}`;

    } catch (error) {
        await browser.close();
        throw error;
    }
}

/**
 * Generate HTML template for the paper
 */
function generatePaperHTML(paper) {
    const authors = [];
    if (paper.researchers) {
        authors.push({
            name: paper.researchers.name,
            affiliation: paper.researchers.affiliation,
            orcid: paper.orcid
        });
    }
    if (paper.co_authors && Array.isArray(paper.co_authors)) {
        authors.push(...paper.co_authors);
    }

    const authorNames = authors.map(a => a.name).join(', ');
    const affiliations = [...new Set(authors.map(a => a.affiliation).filter(Boolean))];

    const pubDate = new Date(paper.published_at || paper.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const keywords = (paper.keywords || []).join(', ');
    const references = paper.references_json || [];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Arial&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
        }

        .paper-container {
            max-width: 100%;
            padding: 0;
        }

        /* Title Section */
        .title-section {
            text-align: center;
            margin-bottom: 24pt;
        }

        .paper-title {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 12pt;
            line-height: 1.3;
        }

        .authors {
            font-size: 12pt;
            margin-bottom: 6pt;
        }

        .affiliations {
            font-size: 10pt;
            font-style: italic;
            color: #333;
            margin-bottom: 6pt;
        }

        .pub-date {
            font-size: 10pt;
            color: #666;
        }

        /* DOI Box */
        .doi-box {
            background: #f5f5f5;
            border: 1px solid #ddd;
            padding: 8pt;
            margin: 16pt 0;
            font-size: 10pt;
        }

        .doi-box strong {
            color: #c3151c;
        }

        /* Abstract */
        .abstract-section {
            margin-bottom: 24pt;
        }

        .section-title {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8pt;
            padding-bottom: 4pt;
            border-bottom: 1px solid #000;
        }

        .abstract-text {
            text-align: justify;
            font-size: 11pt;
        }

        .keywords {
            margin-top: 12pt;
            font-size: 10pt;
        }

        .keywords strong {
            font-weight: bold;
        }

        /* Main Content */
        .main-content {
            text-align: justify;
            margin-bottom: 24pt;
        }

        .main-content p {
            text-indent: 0.5in;
            margin-bottom: 12pt;
        }

        .main-content h2 {
            font-size: 13pt;
            font-weight: bold;
            margin: 20pt 0 10pt;
            text-transform: uppercase;
        }

        .main-content h3 {
            font-size: 12pt;
            font-weight: bold;
            margin: 16pt 0 8pt;
        }

        /* References */
        .references-section {
            margin-top: 24pt;
        }

        .reference-list {
            font-size: 10pt;
        }

        .reference-item {
            margin-bottom: 8pt;
            padding-left: 24pt;
            text-indent: -24pt;
        }

        .reference-number {
            font-weight: bold;
        }

        /* License Footer */
        .license-footer {
            margin-top: 36pt;
            padding-top: 12pt;
            border-top: 1px solid #ddd;
            font-size: 9pt;
            color: #666;
            text-align: center;
        }

        .license-footer img {
            height: 16pt;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="paper-container">
        <!-- Title Section -->
        <div class="title-section">
            <h1 class="paper-title">${escapeHtml(paper.title)}</h1>
            <div class="authors">${escapeHtml(authorNames)}</div>
            <div class="affiliations">${affiliations.map(a => escapeHtml(a)).join('; ')}</div>
            <div class="pub-date">Published: ${pubDate}</div>
        </div>

        <!-- DOI Box -->
        ${paper.doi ? `
        <div class="doi-box">
            <strong>DOI:</strong> ${escapeHtml(paper.doi)} | 
            <strong>Journal:</strong> ${escapeHtml(paper.journal || 'Elitech Hub Research Repository')} |
            <strong>Category:</strong> ${escapeHtml(paper.category?.replace('-', ' ').toUpperCase() || 'Research')}
        </div>
        ` : ''}

        <!-- Abstract -->
        <div class="abstract-section">
            <h2 class="section-title">Abstract</h2>
            <p class="abstract-text">${escapeHtml(paper.abstract || '')}</p>
            ${keywords ? `<p class="keywords"><strong>Keywords:</strong> ${escapeHtml(keywords)}</p>` : ''}
        </div>

        <!-- Main Content -->
        <div class="main-content">
            ${formatContent(paper.description || '')}
        </div>

        <!-- References -->
        ${references.length > 0 ? `
        <div class="references-section">
            <h2 class="section-title">References</h2>
            <div class="reference-list">
                ${references.map((ref, i) => `
                    <div class="reference-item">
                        <span class="reference-number">[${i + 1}]</span> ${escapeHtml(ref)}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- License Footer -->
        <div class="license-footer">
            <p>This work is licensed under ${escapeHtml(paper.license || 'CC BY 4.0')}</p>
            <p>© ${new Date().getFullYear()} Elitech Hub Research Repository</p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Format content to proper HTML paragraphs
 */
function formatContent(content) {
    if (!content) return '';

    return content
        .split('\n\n')
        .filter(p => p.trim())
        .map(para => {
            // Check for headings
            if (para.startsWith('## ')) {
                return `<h2>${escapeHtml(para.slice(3))}</h2>`;
            }
            if (para.startsWith('### ')) {
                return `<h3>${escapeHtml(para.slice(4))}</h3>`;
            }
            return `<p>${escapeHtml(para)}</p>`;
        })
        .join('\n');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default { generatePaperPDF };
