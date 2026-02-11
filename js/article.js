// article.js - Premium Blog Article Renderer
// Handles fetching, rendering, sharing, related posts, and reading progress

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const slug = params.get('slug');

    if (!articleId && !slug) {
        window.location.href = 'blog.html';
        return;
    }

    try {
        const API_BASE = window.location.hostname === 'localhost'
            ? 'https://elitech-hub.vercel.app/api'
            : '/api';

        // Fetch the article
        let post;
        if (slug) {
            const res = await fetch(`${API_BASE}/blog/${slug}`);
            const data = await res.json();
            post = data.post;
        } else {
            const res = await fetch(`${API_BASE}/blog`);
            const data = await res.json();
            post = data.posts.find(p => p.id == articleId);
        }

        if (!post) throw new Error('Post not found');

        // ===== RENDER ARTICLE =====
        document.getElementById('article-loader').style.display = 'none';
        const contentEl = document.getElementById('article-content');
        contentEl.style.display = 'block';

        // Page title & meta
        document.title = `${post.title} - Elitech Hub`;
        const metaDesc = post.excerpt || post.meta_description || '';
        document.getElementById('page-title').textContent = `${post.title} - Elitech Hub`;
        document.getElementById('meta-description').setAttribute('content', metaDesc);

        // Open Graph
        document.getElementById('og-title').setAttribute('content', post.title);
        document.getElementById('og-description').setAttribute('content', metaDesc);
        if (post.thumbnail) {
            document.getElementById('og-image').setAttribute('content', post.thumbnail);
        }

        // Category
        const category = post.category || 'Blog';
        document.getElementById('article-category').textContent = category.toUpperCase();

        // Title
        document.getElementById('article-title').textContent = post.title;

        // Author
        const authorName = post.author || post.author_name || 'Elitech Hub Team';
        document.getElementById('article-author').innerHTML = `<i class="fas fa-user-circle"></i> ${authorName}`;
        document.getElementById('author-name').textContent = authorName;

        // Date
        const publishedDate = post.published_at || post.created_at;
        if (publishedDate) {
            const dateObj = new Date(publishedDate);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('article-date').innerHTML =
                `<i class="far fa-calendar-alt"></i> ${dateObj.toLocaleDateString('en-US', options)}`;
        }

        // Views
        const views = post.views || 0;
        document.getElementById('article-views').innerHTML =
            `<i class="fas fa-eye"></i> ${formatNumber(views)} views`;

        // Featured Image
        const imgEl = document.getElementById('article-image');
        if (post.thumbnail) {
            imgEl.src = post.thumbnail;
            imgEl.alt = post.title;
            imgEl.onerror = () => { imgEl.style.display = 'none'; };
        } else {
            imgEl.style.display = 'none';
        }

        // Content
        const content = post.content || post.excerpt || '';
        document.getElementById('article-body').innerHTML = content;

        // Reading time
        const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        document.getElementById('article-reading-time').innerHTML =
            `<i class="far fa-clock"></i> ${readingTime} min read`;

        // Tags
        renderTags(post.tags);

        // Share links
        setupShareLinks(post.title);

        // Related posts
        loadRelatedPosts(post, API_BASE);

        // Reading progress bar
        setupReadingProgress();

        // Track view
        trackView(post.id, API_BASE);

    } catch (e) {
        console.error('Failed to load article:', e);
        document.getElementById('article-loader').style.display = 'none';
        document.getElementById('article-error').style.display = 'block';
    }
});

// ===== RENDER TAGS =====
function renderTags(tags) {
    const container = document.getElementById('article-tags');
    if (!tags || (Array.isArray(tags) && tags.length === 0)) {
        container.style.display = 'none';
        return;
    }

    // Handle both string and array formats
    let tagList = [];
    if (typeof tags === 'string') {
        tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
        tagList = tags;
    }

    if (tagList.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.innerHTML = tagList.map(tag =>
        `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag">
            <i class="fas fa-tag"></i> ${tag}
        </a>`
    ).join('');
}

// ===== SHARE LINKS =====
function setupShareLinks(title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    document.getElementById('share-twitter').href =
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    document.getElementById('share-linkedin').href =
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    document.getElementById('share-facebook').href =
        `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    document.getElementById('share-whatsapp').href =
        `https://wa.me/?text=${text}%20${url}`;
}

// ===== RELATED POSTS =====
async function loadRelatedPosts(currentPost, apiBase) {
    try {
        const res = await fetch(`${apiBase}/blog`);
        const data = await res.json();
        const posts = data.posts || [];

        // Filter: same category, exclude current, max 3
        const related = posts
            .filter(p => p.id !== currentPost.id)
            .filter(p => {
                if (currentPost.category) {
                    return (p.category || '').toLowerCase().includes(currentPost.category.toLowerCase());
                }
                return true;
            })
            .slice(0, 3);

        if (related.length === 0) return;

        const container = document.getElementById('related-posts');
        const grid = document.getElementById('related-grid');
        container.style.display = 'block';

        grid.innerHTML = related.map(post => {
            const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }) : '';
            const href = post.slug
                ? `article.html?slug=${post.slug}`
                : `article.html?id=${post.id}`;

            return `<a href="${href}" class="related-item">
                <div class="related-item-content">
                    <h4>${post.title}</h4>
                    <span><i class="far fa-calendar-alt"></i> ${date}</span>
                </div>
            </a>`;
        }).join('');

    } catch (e) {
        console.log('Could not load related posts:', e);
    }
}

// ===== READING PROGRESS =====
function setupReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    const article = document.getElementById('article-content');

    if (!article) return;

    window.addEventListener('scroll', () => {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        const start = articleTop;
        const end = articleTop + articleHeight - windowHeight;
        const progress = Math.min(100, Math.max(0, ((scrollTop - start) / (end - start)) * 100));

        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

// ===== VIEW TRACKING =====
async function trackView(postId, apiBase) {
    if (!postId) return;
    const sessionKey = `viewed_post_${postId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    try {
        await fetch(`${apiBase}/blog/track-view`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId })
        });
        sessionStorage.setItem(sessionKey, 'true');
    } catch (e) {
        // Silent fail — view tracking is non-critical
    }
}

// ===== UTILITIES =====
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}
