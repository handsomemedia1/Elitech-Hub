document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const slug = params.get('slug'); // Support slug too

    if (!articleId && !slug) {
        window.location.href = 'blog.html';
        return;
    }

    try {
        const identifier = articleId || slug; // Backend likely handles slug in logic or we adjust endpoint
        // Adjust endpoint based on what we have. Our backend supports /:slug. 
        // If we have ID, we might need to filter list or update backend to support ID lookup on same endpoint 
        // OR filtering. Ideally backend has /api/blog/:idOrSlug

        let url;
        if (articleId) {
            // Currently backend routes might only strictly support slug on /:slug if not UUID. 
            // Let's assume we filter the list if ID is passed, OR we fetch all and find (inefficient but works for small app)
            // Better: Update backend to support ID lookup. 
            // For now, let's try to fetch by slug if possible, else fetch list.
            // Actually, simplest is to assume /api/blog/:id works if backend updated, or just fetch list and find.
            // Let's rely on the list fetch for ID since backend showed /:slug.
            url = window.location.hostname === 'localhost' ? 'http://localhost:3001/api/blog' : '/api/blog';
        } else {
            url = window.location.hostname === 'localhost' ? `http://localhost:3001/api/blog/${slug}` : `/api/blog/${slug}`;
        }

        // FETCH CONTENT
        let post;
        if (slug) {
            const res = await fetch(url);
            const data = await res.json();
            post = data.post;
        } else {
            // Find by ID from list
            const res = await fetch(url); // fetches list
            const data = await res.json();
            // Assuming data.posts array
            post = data.posts.find(p => p.id == articleId);
        }

        if (!post) throw new Error('Post not found');

        // RENDER
        document.getElementById('article-loader').style.display = 'none';
        document.getElementById('article-content').style.display = 'block';

        document.title = `${post.title} - Elitech Hub`;
        document.getElementById('article-title').textContent = post.title;
        document.getElementById('article-category').textContent = post.category || 'Blog';
        document.getElementById('article-date').textContent = new Date(post.published_at).toLocaleDateString();
        document.getElementById('article-author').innerHTML = `<i class="fas fa-user-circle"></i> ${post.author || 'Team'}`;
        document.getElementById('article-views').innerHTML = `<i class="fas fa-eye"></i> ${post.views || 0} views`;

        if (post.thumbnail) {
            document.getElementById('article-image').src = post.thumbnail;
        } else {
            document.getElementById('article-image').style.display = 'none';
        }

        // Handle content (HTML or text)
        document.getElementById('article-body').innerHTML = post.content || post.excerpt;

        // TRACK VIEW
        // We only track if we haven't tracked this session to avoid spamming
        const sessionKey = `viewed_post_${post.id}`;
        if (!sessionStorage.getItem(sessionKey)) {
            const trackUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001/api/blog/track-view' : '/api/blog/track-view';
            await fetch(trackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: post.id })
            });
            sessionStorage.setItem(sessionKey, 'true');
        }

    } catch (e) {
        console.error(e);
        document.getElementById('article-loader').innerHTML = `<p class="error">Failed to load article. <a href="blog.html">Go back</a></p>`;
    }
});
