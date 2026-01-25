// Load Blog Posts Dynamically
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});

let allPosts = [];

async function loadBlogPosts() {
    const listContainer = document.getElementById('blog-list');

    try {
        // Fetch the index file
        const response = await fetch('data/blog_index.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load blog index');

        const data = await response.json();
        // Handle both array format and {posts: []} format
        allPosts = Array.isArray(data) ? data : (data.posts || []);

        // Initial render
        renderPosts(allPosts);

    } catch (error) {
        console.error('Error loading blogs:', error);
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--gray);">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <p>Failed to load content. Please check back later.</p>
            </div>
        `;
    }
}

function renderPosts(posts) {
    const listContainer = document.getElementById('blog-list');

    if (posts.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--gray);">
                <p>No posts found in this category.</p>
            </div>
        `;
        return;
    }

    const html = posts.map(post => {
        // Determine badge style
        let badgeHtml = '';
        if (post.category.toLowerCase().includes('scholarship')) {
            badgeHtml = '<span class="scholarship-badge">SCHOLARSHIP 🎓</span>';
        }

        return `
            <article class="post-card">
                <a href="blog-posts/${post.slug}.html" style="text-decoration: none; display: block; overflow: hidden;">
                    <img src="${post.image || 'assets/images/logo.png'}" alt="${post.title}" class="post-card-img" loading="lazy">
                </a>
                
                <div class="post-card-body">
                    <div class="post-meta">
                        <span class="post-tag">${post.category.toUpperCase()}</span>
                        <span>${post.readTime || '5 min read'}</span>
                    </div>
                    
                    <a href="blog-posts/${post.slug}.html" class="post-title">${post.title}</a>
                    
                    <p class="post-excerpt">
                        ${post.excerpt}
                    </p>
                    
                    <div class="post-footer">
                        <span style="font-size: 0.8rem; color: var(--gray);">${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <a href="blog-posts/${post.slug}.html" class="read-link">
                            Read Article <i class="fas fa-arrow-right" style="font-size: 0.8em; margin-left: 0.25rem;"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    listContainer.innerHTML = html;
}

// Filter Function
function filterPosts(category) {
    if (category === 'all') {
        renderPosts(allPosts);
    } else {
        const filtered = allPosts.filter(post =>
            post.category.toLowerCase().includes(category) ||
            post.tags?.some(tag => tag.toLowerCase().includes(category))
        );
        renderPosts(filtered);
    }
}
