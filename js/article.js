// article.js - Premium Blog Article Renderer
// Handles fetching, rendering, sharing, related posts, and reading progress

/**
 * Turn post body into HTML. Writer posts use Quill HTML; imported / agent posts may use Markdown.
 */
function articleBodyToHtml(raw) {
    if (raw == null || typeof raw !== 'string') return '';
    const t = raw.trim();
    if (!t) return '';
    if (/<[a-z][\s\S]*>/i.test(t)) {
        return raw;
    }
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
        try {
            return marked.parse(raw, { breaks: true });
        } catch (e) {
            console.warn('Markdown parse failed:', e);
        }
    }
    const paras = raw.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    return paras.map(p => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    let articleId = params.get('id');
    let slug = params.get('slug');

    // Also handle path-based blog URLs like /blog-posts/my-post-slug.html
    if (!articleId && !slug) {
        const path = window.location.pathname;
        const blogPostMatch = path.match(/\/blog-posts\/(.+?)(?:\.html)?$/);
        if (blogPostMatch) {
            slug = blogPostMatch[1];
        }
    }

    if (!articleId && !slug) {
        window.location.href = 'blog.html';
        return;
    }

    try {
        const API_BASE = window.location.hostname === 'localhost'
            ? 'https://elitech-hub.vercel.app/api'
            : '/api';

        // Fetch the article
        const identifier = slug || articleId;
        const res = await fetch(`${API_BASE}/blog/${identifier}`);
        const data = await res.json();
        const post = data.post;

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

        // Set og:url and canonical to the clean blog-posts URL
        const canonicalUrl = `https://elitechub.com/blog-posts/${post.slug}.html`;
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
        else {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:url');
            m.setAttribute('content', canonicalUrl);
            document.head.appendChild(m);
        }
        // Canonical link
        let canonLink = document.querySelector('link[rel="canonical"]');
        if (!canonLink) {
            canonLink = document.createElement('link');
            canonLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonLink);
        }
        canonLink.setAttribute('href', canonicalUrl);

        // Twitter Card
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', post.title);
        else {
            const m = document.createElement('meta');
            m.setAttribute('name', 'twitter:title');
            m.setAttribute('content', post.title);
            document.head.appendChild(m);
        }
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.setAttribute('content', metaDesc);
        else {
            const m = document.createElement('meta');
            m.setAttribute('name', 'twitter:description');
            m.setAttribute('content', metaDesc);
            document.head.appendChild(m);
        }
        if (post.thumbnail) {
            const twImg = document.querySelector('meta[name="twitter:image"]');
            if (twImg) twImg.setAttribute('content', post.thumbnail);
            else {
                const m = document.createElement('meta');
                m.setAttribute('name', 'twitter:image');
                m.setAttribute('content', post.thumbnail);
                document.head.appendChild(m);
            }
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
        const viewsEl = document.getElementById('article-views');
        if (viewsEl) {
            viewsEl.style.display = 'inline-block';
            viewsEl.innerHTML = `<i class="fas fa-eye"></i> ${formatNumber(post.views || 0)} views`;
        }

        // Featured Image
        const imgEl = document.getElementById('article-image');
        if (post.thumbnail) {
            let src = post.thumbnail;
            let alt = post.title; // Default alt
            if (src.includes('#alt=')) {
                const parts = src.split('#alt=');
                src = parts[0];
                alt = decodeURIComponent(parts[1]) || post.title;
            }
            imgEl.src = src;
            imgEl.alt = alt;
            imgEl.onerror = () => { imgEl.style.display = 'none'; };
        } else {
            imgEl.style.display = 'none';
        }

        // Content (HTML from editor, or Markdown from imports / JSON pipeline)
        const rawBody = (post.content && String(post.content).trim()) || (post.excerpt && String(post.excerpt).trim()) || '';
        document.getElementById('article-body').innerHTML = articleBodyToHtml(rawBody);

        // Word Count and Reading Time
        const textContent = rawBody.replace(/<[^>]*>?/gm, ' ').replace(/[#*_`[\]]/g, ' ').trim();
        const words = textContent ? textContent.split(/\s+/).length : 0;
        const readTime = Math.max(1, Math.ceil(words / 200));
        
        const readTimeEl = document.getElementById('article-reading-time');
        if (readTimeEl) {
            readTimeEl.style.display = 'inline-flex';
            readTimeEl.innerHTML = `<i class="far fa-clock"></i> ${readTime} min read (${words} words)`;
        }

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
        
        // Edit Button Logic (if Admin or Writer)
        const adminToken = localStorage.getItem('elitech_admin_token');
        const writerToken = localStorage.getItem('elitech_writer_token');
        if (adminToken || writerToken) {
            const editBtn = document.createElement('a');
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
            editBtn.className = 'btn btn-secondary';
            editBtn.style.marginLeft = '1rem';
            editBtn.style.padding = '0.4rem 0.75rem';
            editBtn.style.fontSize = '0.85rem';
            editBtn.href = adminToken ? `admin.html` : `writer.html`;
            
            const metaDiv = document.querySelector('.post-meta');
            if (metaDiv) metaDiv.appendChild(editBtn);
        }

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
            const href = `article.html?slug=${post.slug || post.id}`;

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
