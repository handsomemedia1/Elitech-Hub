// research.js - Research Functionality for Elitech Hub
// Handles research filtering, search, and dynamic content

class ResearchManager {
    constructor() {
        this.papers = [];
        this.filteredPapers = [];
        this.currentCategory = 'all';

        this.init();
    }

    async init() {
        await this.loadResearch();
        this.setupEventListeners();
        this.renderResearch();
    }

    async loadResearch() {
        try {
            // Determine API URL based on environment
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3001/api/research'
                : '/api/research';

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch research');
            }

            const data = await response.json();

            if (data.research && data.research.length > 0) {
                this.papers = data.research;
                console.log(`🔬 Loaded ${this.papers.length} research items from backend`);
            } else {
                this.papers = [];
                console.log('ℹ️ No research items found in backend');
            }
        } catch (e) {
            console.error('Error loading research:', e);
            this.papers = [];
        }

        this.filteredPapers = [...this.papers];
    }

    setupEventListeners() {
        // You can add category filters here if you implement buttons in HTML
        // For now, we assume basic loading
    }

    renderResearch() {
        const container = document.getElementById('research-container');
        if (!container) return;

        if (this.filteredPapers.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                    <i class="fas fa-flask" style="font-size: 3rem; color: #E5E7EB; margin-bottom: 1rem;"></i>
                    <h3 style="color: #6B7280;">No research projects found</h3>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        this.filteredPapers.forEach(paper => {
            const card = this.createResearchCard(paper);
            container.appendChild(card);
        });
    }

    createResearchCard(paper) {
        const card = document.createElement('article');
        // Match existing styling
        card.style.cssText = `background: white; border: 1px solid #E5E7EB; border-radius: 1rem; overflow: hidden; transition: all 0.3s;`;

        // Determine styling based on status/type
        let icon = 'fa-flask';
        let bgGradient = 'linear-gradient(135deg, #008751, #006B3F)'; // Default Green
        let statusColor = '#008751';
        let statusBg = '#D1FAE5';

        if (paper.status === 'published' || paper.published) {
            icon = 'fa-check-circle';
            // Custom styling for production ready?
        } else if (paper.status === 'draft') {
            statusColor = '#F59E0B';
            statusBg = '#FEF3C7';
            bgGradient = 'linear-gradient(135deg, #F59E0B, #D97706)';
        }

        // Logic to try and match the "Production Ready" red style if detected (e.g. based on category)
        if (paper.category === 'fraud-detection' || paper.title.includes('PSEDS')) {
            bgGradient = 'linear-gradient(135deg, #DC2626, #991B1B)';
            icon = 'fa-shield-alt';
        }

        card.innerHTML = `
            <div style="height: 200px; background: ${bgGradient}; display: flex; align-items: center; justify-content: center;">
                <i class="fas ${icon}" style="font-size: 4rem; color: white; opacity: 0.3;"></i>
            </div>
            <div style="padding: 2rem;">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <span style="padding: 0.25rem 0.75rem; background: ${statusBg}; color: ${statusColor}; border-radius: 2rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                        ${paper.status || 'Active'}
                    </span>
                    <span style="padding: 0.25rem 0.75rem; background: #DBEAFE; color: #06B6D4; border-radius: 2rem; font-size: 0.75rem; font-weight: 600;">
                        ${paper.category || 'Research'}
                    </span>
                </div>
                <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #111;">
                    ${paper.title}
                </h3>
                <p style="color: #6B7280; line-height: 1.6; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    ${paper.description || paper.abstract || 'No description available.'}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: ${statusColor}; font-size: 0.875rem; font-weight: 600;">
                        <i class="fas ${icon}"></i> ${paper.status === 'published' ? 'Deployed & Operational' : 'Research Phase'}
                    </span>
                    <a href="research-paper.html?id=${paper.slug || paper.id}" style="color: #DC2626; font-weight: 600; text-decoration: none;">
                        View Project →
                    </a>
                </div>
            </div>
        `;

        return card;
    }
}

// Initialize
let researchManager;
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('research-container')) {
        researchManager = new ResearchManager();
    }
});
