/**
 * Search Component
 * Global search for courses and blog posts
 */

class ElitechSearch {
    constructor() {
        this.apiUrl = 'https://elitech-hub.vercel.app/api'; // Local testing
        this.isOpen = false;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.createSearchButton();
        this.createSearchModal();
        this.bindEvents();
    }

    createSearchButton() {
        // Check if search trigger already exists (added in HTML)
        if (document.querySelector('.search-trigger')) {
            return; // Button already exists in HTML
        }

        // Add search button to navbar (fallback)
        const navDesktop = document.querySelector('.nav-desktop');
        if (navDesktop) {
            const searchLi = document.createElement('li');
            searchLi.innerHTML = `
                <button class="search-trigger" aria-label="Search">
                    <i class="fas fa-search"></i>
                </button>
            `;
            navDesktop.insertBefore(searchLi, navDesktop.lastElementChild);
        }
    }

    createSearchModal() {
        const modal = document.createElement('div');
        modal.id = 'searchModal';
        modal.innerHTML = `
            <div class="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Search courses, blog posts..." autocomplete="off">
                        <kbd>ESC</kbd>
                    </div>
                    <button class="search-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="search-results" id="searchResults">
                    <div class="search-empty">
                        <i class="fas fa-search"></i>
                        <p>Start typing to search...</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #searchModal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            #searchModal.active { display: block; }
            .search-overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 10, 0.9);
                backdrop-filter: blur(10px);
            }
            .search-container {
                position: relative;
                max-width: 700px;
                margin: 10vh auto;
                background: white;
                border-radius: 1rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }
            .search-header {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #E5E7EB;
            }
            .search-input-wrapper {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0 1rem;
            }
            .search-input-wrapper i { color: #9CA3AF; font-size: 1.25rem; }
            .search-input-wrapper input {
                flex: 1;
                border: none;
                outline: none;
                font-size: 1.125rem;
                font-family: inherit;
            }
            .search-input-wrapper kbd {
                background: #F3F4F6;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                color: #6B7280;
            }
            .search-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                color: #6B7280;
                cursor: pointer;
                padding: 0.5rem;
            }
            .search-results {
                max-height: 60vh;
                overflow-y: auto;
                padding: 1rem;
            }
            .search-empty {
                text-align: center;
                padding: 3rem;
                color: #9CA3AF;
            }
            .search-empty i { font-size: 3rem; margin-bottom: 1rem; }
            .search-section {
                margin-bottom: 1.5rem;
            }
            .search-section-title {
                font-size: 0.75rem;
                font-weight: 700;
                color: #6B7280;
                text-transform: uppercase;
                margin-bottom: 0.75rem;
            }
            .search-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-radius: 0.5rem;
                text-decoration: none;
                color: inherit;
                transition: background 0.2s;
            }
            .search-item:hover { background: #F9FAFB; }
            .search-item-icon {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #c3151c, #991B1B);
                border-radius: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
            }
            .search-item-content { flex: 1; }
            .search-item-title {
                font-weight: 600;
                color: #0A0A0A;
                margin-bottom: 0.25rem;
            }
            .search-item-meta {
                font-size: 0.875rem;
                color: #6B7280;
            }
            .search-loading {
                text-align: center;
                padding: 2rem;
            }
            .search-no-results {
                text-align: center;
                padding: 2rem;
                color: #6B7280;
            }
            .search-trigger {
                background: none;
                border: none;
                color: inherit;
                font-size: 1rem;
                cursor: pointer;
                padding: 0.5rem;
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        // Open search
        document.querySelectorAll('.search-trigger').forEach(btn => {
            btn.addEventListener('click', () => this.open());
        });

        // Close search
        document.querySelector('.search-close')?.addEventListener('click', () => this.close());
        document.querySelector('.search-overlay')?.addEventListener('click', () => this.close());

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
            // Cmd/Ctrl + K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Search input
        const input = document.getElementById('searchInput');
        input?.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.search(e.target.value);
            }, 300);
        });
    }

    open() {
        const modal = document.getElementById('searchModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('searchInput')?.focus();
        this.isOpen = true;
    }

    close() {
        const modal = document.getElementById('searchModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
        document.getElementById('searchInput').value = '';
        this.showEmpty();
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    async search(query) {
        const resultsContainer = document.getElementById('searchResults');

        if (query.length < 2) {
            this.showEmpty();
            return;
        }

        resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';

        try {
            const response = await fetch(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.results.courses.length === 0 && data.results.blogs.length === 0) {
                resultsContainer.innerHTML = '<div class="search-no-results"><i class="fas fa-search"></i><p>No results found for "' + query + '"</p></div>';
                return;
            }

            let html = '';

            if (data.results.courses.length > 0) {
                html += `
                    <div class="search-section">
                        <div class="search-section-title">Courses</div>
                        ${data.results.courses.map(course => `
                            <a href="course.html?id=${course.id}" class="search-item">
                                <div class="search-item-icon"><i class="fas fa-graduation-cap"></i></div>
                                <div class="search-item-content">
                                    <div class="search-item-title">${course.title}</div>
                                    <div class="search-item-meta">${course.description?.substring(0, 80)}...</div>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                `;
            }

            if (data.results.blogs.length > 0) {
                html += `
                    <div class="search-section">
                        <div class="search-section-title">Blog Posts</div>
                        ${data.results.blogs.map(post => `
                            <a href="blog-posts/${post.slug}.html" class="search-item">
                                <div class="search-item-icon"><i class="fas fa-newspaper"></i></div>
                                <div class="search-item-content">
                                    <div class="search-item-title">${post.title}</div>
                                    <div class="search-item-meta">${post.category} • ${new Date(post.published_at).toLocaleDateString()}</div>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                `;
            }

            resultsContainer.innerHTML = html;
        } catch (err) {
            console.error('Search error:', err);
            resultsContainer.innerHTML = '<div class="search-no-results">Search is unavailable. Please try again later.</div>';
        }
    }

    showEmpty() {
        document.getElementById('searchResults').innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>Start typing to search...</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Search courses, blog posts, and more</p>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.elitechSearch = new ElitechSearch();
});
