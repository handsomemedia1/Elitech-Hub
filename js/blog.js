// blog.js - Blog Functionality for Elitech Hub
// Handles article filtering, search, pagination, and dynamic content

class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 9;
        this.currentCategory = 'all';
        this.searchQuery = '';

        this.init();
    }

    async init() {
        await this.loadArticles();
        this.loadTrendingPost(); // Load trending separately
        this.setupEventListeners();
        this.initializeCategories();
        this.renderArticles();
        this.setupReadingProgress();
    }

    async loadTrendingPost() {
        try {
            const container = document.getElementById('trending-hero');
            if (!container) return;

            // Determine API URL based on environment
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'https://elitech-hub.vercel.app/api/blog/trending'
                : '/api/blog/trending';

            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch trending');

            const data = await response.json();
            const post = data.post;

            if (post) {
                // Update DOM
                container.querySelector('.trending-title').textContent = post.title;
                container.querySelector('.trending-excerpt').textContent = post.excerpt;

                const link = container.querySelector('.trending-link');
                link.href = `article.html?id=${post.id}`;
                link.innerHTML = `Read Full Article <i class="fas fa-arrow-right"></i>`;

                // Optional: Update background image or other styles if needed
                // container.style.backgroundImage = `url(${post.thumbnail})`; 
            }
        } catch (e) {
            console.error('Error loading trending post:', e);
            // Keep default/loading state or hide
        }
    }

    async loadArticles() {
        try {
            // Load from both sources in parallel
            const [apiArticles, staticArticles] = await Promise.all([
                this.loadFromAPI(),
                this.loadFromStaticIndex()
            ]);

            // Merge and deduplicate (API takes priority, then static)
            const articleMap = new Map();

            // Add static articles first (lower priority)
            staticArticles.forEach(article => {
                articleMap.set(article.slug, article);
            });

            // Add API articles (higher priority, overwrites duplicates)
            apiArticles.forEach(article => {
                articleMap.set(article.slug || article.id, article);
            });

            this.articles = Array.from(articleMap.values());

            // Sort by date (newest first)
            this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            console.log(`📚 Loaded ${apiArticles.length} from API, ${staticArticles.length} from static index`);
            console.log(`📚 Total unique articles: ${this.articles.length}`);

        } catch (e) {
            console.error('Error loading articles:', e);
            this.articles = [];
        }

        this.filteredArticles = [...this.articles];
    }

    async loadFromAPI() {
        try {
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'https://elitech-hub.vercel.app/api/blog'
                : '/api/blog';

            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('API fetch failed');

            const data = await response.json();

            if (data.posts && data.posts.length > 0) {
                return data.posts.map(post => ({
                    id: post.id,
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content || '',
                    category: post.category,
                    author: post.author || 'Elitech Hub',
                    date: post.published_at || post.date,
                    readTime: this.estimateReadingTime(post.content || ''),
                    image: post.thumbnail || 'assets/images/logo.png',
                    tags: post.tags || [post.category],
                    views: post.views || 0,
                    featured: post.featured || false,
                    slug: post.slug,
                    source: 'api'
                }));
            }
        } catch (e) {
            console.warn('⚠️ API fetch failed, using static only:', e.message);
        }
        return [];
    }

    async loadFromStaticIndex() {
        try {
            const response = await fetch('data/blog_index.json');
            if (!response.ok) throw new Error('Static index fetch failed');

            const data = await response.json();
            const posts = data.posts || data;

            if (posts && posts.length > 0) {
                return posts.map(post => ({
                    id: post.slug,
                    title: post.title,
                    excerpt: post.excerpt || '',
                    content: '',
                    category: post.category || 'general',
                    author: post.author || 'Elitech Hub',
                    date: post.date,
                    readTime: post.readTime || '3 min',
                    image: post.image || 'assets/images/logo.png',
                    tags: post.tags || [post.category],
                    views: 0,
                    featured: false,
                    slug: post.slug,
                    source: 'static'
                }));
            }
        } catch (e) {
            console.warn('⚠️ Static index fetch failed:', e.message);
        }
        return [];
    }

    estimateReadingTime(content) {
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        return `${readingTime} min`;
    }

    setupEventListeners() {
        // Category filters
        const categoryButtons = document.querySelectorAll('.category-link, .category-card');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.dataset.category || 'all';
                this.filterByCategory(category);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('blogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterArticles();
            });
        }

        // Pagination
        this.setupPagination();

        // Reading time calculator
        document.querySelectorAll('.article-content').forEach(article => {
            this.calculateReadingTime(article);
        });
    }

    initializeCategories() {
        const categories = this.getCategories();
        const categoryContainer = document.querySelector('.categories-grid, .categories-container');

        if (categoryContainer && !categoryContainer.hasChildNodes()) {
            categories.forEach(cat => {
                const count = this.articles.filter(a => a.category === cat.id).length;
                const categoryCard = this.createCategoryCard(cat, count);
                categoryContainer.appendChild(categoryCard);
            });
        }
    }

    getCategories() {
        return [
            { id: 'all', name: 'All Articles', icon: 'fa-th', color: '#1B365D' },
            { id: 'career', name: 'Career', icon: 'fa-briefcase', color: '#10B981' },
            { id: 'security', name: 'Security', icon: 'fa-shield-alt', color: '#C41E3A' },
            { id: 'tutorial', name: 'Tutorials', icon: 'fa-graduation-cap', color: '#F59E0B' },
            { id: 'tools', name: 'Tools', icon: 'fa-tools', color: '#6B46C1' },
            { id: 'industry', name: 'Industry', icon: 'fa-industry', color: '#3B82F6' },
            { id: 'education', name: 'Education', icon: 'fa-book', color: '#8B5CF6' }
        ];
    }

    createCategoryCard(category, count) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.category = category.id;
        card.style.setProperty('--category-color', category.color);

        card.innerHTML = `
            <div class="category-icon" style="background: ${category.color}">
                <i class="fas ${category.icon}"></i>
            </div>
            <div class="category-info">
                <h3 class="category-name">${category.name}</h3>
                <span class="category-count">${count} article${count !== 1 ? 's' : ''}</span>
            </div>
        `;

        return card;
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;

        // Update active state
        document.querySelectorAll('.category-link, .category-card').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll(`[data-category="${category}"]`).forEach(btn => {
            btn.classList.add('active');
        });

        this.filterArticles();
    }

    filterArticles() {
        let filtered = [...this.articles];

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(article => article.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(article => {
                const searchableText = `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase();
                return searchableText.includes(this.searchQuery);
            });
        }

        this.filteredArticles = filtered;
        this.currentPage = 1;
        this.renderArticles();
        this.updateSearchResults();
    }

    renderArticles() {
        const container = document.querySelector('.articles-grid, .articles-container, #blog-list');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        if (articlesToShow.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your filters or search query.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        articlesToShow.forEach(article => {
            const articleCard = this.createArticleCard(article);
            container.appendChild(articleCard);
        });

        this.updatePagination();
        this.animateArticles();
    }

    createArticleCard(article) {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.dataset.articleId = article.id;
        if (article.featured) card.classList.add('featured');

        // Use different URL based on source
        const articleUrl = article.source === 'static'
            ? `blog-posts/${article.slug}.html`
            : `article.html?id=${article.id}`;

        card.innerHTML = `
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy" 
                     onerror="this.src='assets/images/logo.png'">
                ${article.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
                <div class="article-overlay">
                    <a href="${articleUrl}" class="read-more-btn">
                        Read Article <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category ${article.category}">${this.getCategoryName(article.category)}</span>
                    <span class="article-date"><i class="far fa-calendar"></i> ${this.formatDate(article.date)}</span>
                </div>
                <h3 class="article-title">
                    <a href="${articleUrl}">${article.title}</a>
                </h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-footer">
                    <div class="author-info">
                        <img src="images/team/${this.getAuthorSlug(article.author)}.jpg" 
                             alt="${article.author}" 
                             class="author-avatar"
                             onerror="this.src='images/team/default-avatar.jpg'">
                        <span class="author-name">${article.author}</span>
                    </div>
                    <div class="article-stats">
                        <span><i class="far fa-clock"></i> ${article.readTime}</span>
                        <span><i class="far fa-eye"></i> ${this.formatNumber(article.views)}</span>
                    </div>
                </div>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
        `;

        return card;
    }

    getCategoryName(categoryId) {
        const category = this.getCategories().find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }

    getAuthorSlug(authorName) {
        return authorName.toLowerCase().replace(/\s+/g, '-');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    animateArticles() {
        const articles = document.querySelectorAll('.article-card');
        articles.forEach((article, index) => {
            article.style.opacity = '0';
            article.style.transform = 'translateY(20px)';

            setTimeout(() => {
                article.style.transition = 'all 0.5s ease';
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupPagination() {
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');

        if (prevButton) {
            prevButton.addEventListener('click', () => this.changePage('prev'));
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => this.changePage('next'));
        }
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);

        if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        } else if (direction === 'next' && this.currentPage < totalPages) {
            this.currentPage++;
        }

        this.renderArticles();
        this.scrollToTop();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        const paginationInfo = document.querySelector('.pagination-info');
        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');

        if (paginationInfo) {
            const startItem = (this.currentPage - 1) * this.articlesPerPage + 1;
            const endItem = Math.min(this.currentPage * this.articlesPerPage, this.filteredArticles.length);
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${this.filteredArticles.length} articles`;
        }

        if (prevButton) {
            prevButton.disabled = this.currentPage === 1;
        }

        if (nextButton) {
            nextButton.disabled = this.currentPage === totalPages;
        }

        // Update page numbers
        this.renderPageNumbers(totalPages);
    }

    renderPageNumbers(totalPages) {
        const container = document.querySelector('.pagination-numbers');
        if (!container) return;

        container.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'page-number';
            pageButton.textContent = i;

            if (i === this.currentPage) {
                pageButton.classList.add('active');
            }

            pageButton.addEventListener('click', () => {
                this.currentPage = i;
                this.renderArticles();
                this.scrollToTop();
            });

            container.appendChild(pageButton);
        }
    }

    updateSearchResults() {
        const resultsCount = document.querySelector('.search-results-count');
        if (resultsCount) {
            resultsCount.textContent = `${this.filteredArticles.length} article${this.filteredArticles.length !== 1 ? 's' : ''} found`;
        }
    }

    calculateReadingTime(element) {
        const text = element.textContent || element.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min

        const readTimeElement = element.querySelector('.reading-time');
        if (readTimeElement) {
            readTimeElement.textContent = `${readingTime} min read`;
        }
    }

    setupReadingProgress() {
        const progressBar = document.getElementById('readingProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const article = document.querySelector('.article-content, .blog-post-content');
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight;
            const articleBottom = articleTop + articleHeight;

            if (scrollPosition > articleTop && window.scrollY < articleBottom) {
                const progress = ((scrollPosition - articleTop) / articleHeight) * 100;
                progressBar.style.width = Math.min(progress, 100) + '%';
            }
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Public API methods
    getArticle(id) {
        return this.articles.find(article => article.id === parseInt(id));
    }

    getFeaturedArticles() {
        return this.articles.filter(article => article.featured);
    }

    getRelatedArticles(articleId, limit = 3) {
        const article = this.getArticle(articleId);
        if (!article) return [];

        return this.articles
            .filter(a => a.id !== articleId && a.category === article.category)
            .slice(0, limit);
    }

    incrementViews(articleId) {
        const article = this.getArticle(articleId);
        if (article) {
            article.views++;
            // In production, this would sync with backend
        }
    }
}

// Social sharing functionality
class SocialShare {
    static share(platform, url, title) {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }

    static copyLink(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy link', 'error');
        });
    }

    static showNotification(message, type) {
        // Integration with main notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize blog on page load
let blogManager;

document.addEventListener('DOMContentLoaded', function () {
    // Initialize blog manager - include #blog-list and .blog-grid-layout to match blog.html
    if (document.querySelector('.articles-grid, .blog-section, .article-content, #blog-list, .blog-grid-layout')) {
        blogManager = new BlogManager();
    }

    // Setup social share buttons
    document.querySelectorAll('[data-share]').forEach(button => {
        button.addEventListener('click', function () {
            const platform = this.dataset.share;
            const url = window.location.href;
            const title = document.title;
            SocialShare.share(platform, url, title);
        });
    });

    // Copy link button
    const copyLinkBtn = document.getElementById('copyLink');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            SocialShare.copyLink(window.location.href);
        });
    }

    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // In production, this would submit to backend
            console.log('Newsletter subscription:', email);
            SocialShare.showNotification('Successfully subscribed to newsletter!', 'success');
            this.reset();
        });
    }
});

// Global filterPosts function for inline onclick handlers in blog.html
function filterPosts(category) {
    if (blogManager) {
        blogManager.filterByCategory(category);
    }
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogManager, SocialShare, filterPosts };
}
