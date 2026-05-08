const fs = require('fs');

const file = 'article.html';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '<!-- Article Content -->';
const endMarker = '<!-- Footer -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = `<!-- Article Content -->
    
    <!-- Loading State -->
    <div id="article-loader" class="article-skeleton">
        <div class="spinner"></div>
        <p>Loading article...</p>
    </div>

    <!-- Error State -->
    <div id="article-error" class="article-error" style="display: none;">
        <i class="fas fa-exclamation-triangle"></i>
        <h2>Article not found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <a href="blog.html"><i class="fas fa-arrow-left"></i> Back to Blog</a>
    </div>

    <!-- Article Content wrapper (hidden until loaded) -->
    <div id="article-content" style="display: none;" class="fade-in">
        
        <!-- NEW HERO SECTION -->
        <section class="article-hero">
            <div class="hero-content-wrapper">
                <!-- Breadcrumb -->
                <a href="blog.html" class="breadcrumb">
                    <i class="fas fa-arrow-left"></i> All Posts
                </a><br>

                <!-- Category Badge -->
                <span class="post-category" id="article-category">Category</span>

                <!-- Title -->
                <h1 class="post-title" id="article-title">Loading Title...</h1>

                <!-- Post Meta -->
                <div class="post-meta">
                    <span id="article-author"><i class="fas fa-user-circle"></i> Author</span>
                    <span id="article-date"><i class="far fa-calendar-alt"></i> Date</span>
                    <span id="article-reading-time" class="reading-pill"><i class="far fa-clock"></i> 5 min read</span>
                    <span id="article-views"><i class="fas fa-eye"></i> 0 views</span>
                </div>
            </div>
        </section>

        <!-- LAYOUT CONTAINER -->
        <div class="article-layout">
            
            <!-- MAIN CONTENT COLUMN -->
            <main class="article-main">
                <!-- Featured Image overlaps into Hero via negative layout margin -->
                <img id="article-image" src="" alt="Featured Image" class="post-featured-image">

                <div class="post-content-inner">
                    <!-- Main Content Body -->
                    <div id="article-body" class="post-content">
                        <!-- Content injected here -->
                    </div>

                    <!-- ===== TELEGRAM CTA INLINE BANNER ===== -->
                    <div id="tg-inline-cta" style="margin: 3rem 0; background: linear-gradient(135deg, #0f172a 0%, #0e2a47 100%); border-radius: 1.25rem; padding: 2rem 2.5rem; display: flex; align-items: center; gap: 1.75rem; border: 1px solid rgba(0,136,204,0.25); box-shadow: 0 8px 32px rgba(0,136,204,0.12);">
                        <div style="flex-shrink:0; width:60px; height:60px; background:linear-gradient(135deg,#0088cc,#00bfff); border-radius:50%; display:flex; align-items:center; justify-content:center;">
                            <i class="fab fa-telegram-plane" style="color:white; font-size:1.6rem;"></i>
                        </div>
                        <div style="flex:1;">
                            <p style="margin:0 0 0.25rem; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#0088cc;">Free Community</p>
                            <h4 style="margin:0 0 0.35rem; color:white; font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:700;">Want more content like this?</h4>
                            <p style="margin:0; color:rgba(255,255,255,0.7); font-size:0.9rem; line-height:1.5;">Join 1,000+ cybersecurity learners on our free <strong style="color:white;">Cyber Pulse Telegram</strong> — daily threat intel, scholarships &amp; career tips.</p>
                        </div>
                        <a href="https://t.me/Elitechub" target="_blank" rel="noopener noreferrer" style="flex-shrink:0; display:inline-flex; align-items:center; gap:0.5rem; padding:0.75rem 1.5rem; background:linear-gradient(135deg,#0088cc,#00a8e8); border-radius:0.75rem; color:white; font-weight:700; font-size:0.9rem; text-decoration:none; white-space:nowrap; transition:all 0.3s; box-shadow:0 4px 15px rgba(0,136,204,0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,136,204,0.45)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(0,136,204,0.3)'">
                            <i class="fab fa-telegram-plane"></i> Join Free
                        </a>
                    </div>

                    <!-- Tags -->
                    <div class="post-tags" id="article-tags">
                        <!-- Tags injected here -->
                    </div>

                    <!-- Author Box -->
                    <div class="post-author" id="author-box">
                        <img src="assets/images/logo.png" alt="Author" id="author-avatar">
                        <div class="post-author-info">
                            <h4 id="author-name">Elitech Hub</h4>
                            <p id="author-bio">Expert insights on cybersecurity, career growth, and scholarship opportunities from the Elitech Hub team.</p>
                        </div>
                    </div>

                    <!-- CTA Section -->
                    <div class="post-cta">
                        <h3>Ready to start your cybersecurity career?</h3>
                        <p>Join our professional training program and build the skills employers are looking for.</p>
                        <a href="programs.html" class="btn"><i class="fas fa-rocket"></i> Explore Programs</a>
                    </div>

                    <!-- Related Posts -->
                    <div class="related-posts" id="related-posts" style="display: none;">
                        <h3><i class="fas fa-newspaper" style="color: #c3151c; margin-right: 0.5rem;"></i> Related Articles</h3>
                        <div class="related-grid" id="related-grid">
                            <!-- Related posts injected here -->
                        </div>
                    </div>
                </div>
            </main>

            <!-- SIDEBAR COLUMN -->
            <aside class="article-sidebar">
                <div class="sidebar-widget">
                    <h4>Share Article</h4>
                    <div class="share-buttons-vertical">
                        <a href="#" id="share-twitter" title="Share on Twitter" target="_blank" rel="noopener">
                            <i class="fab fa-x-twitter" style="color: #000000;"></i> Share on X
                        </a>
                        <a href="#" id="share-linkedin" title="Share on LinkedIn" target="_blank" rel="noopener">
                            <i class="fab fa-linkedin-in" style="color: #0A66C2;"></i> Share on LinkedIn
                        </a>
                        <a href="#" id="share-facebook" title="Share on Facebook" target="_blank" rel="noopener">
                            <i class="fab fa-facebook-f" style="color: #1877F2;"></i> Share on Facebook
                        </a>
                        <a href="#" id="share-whatsapp" title="Share on WhatsApp" target="_blank" rel="noopener">
                            <i class="fab fa-whatsapp" style="color: #25D366;"></i> Share via WhatsApp
                        </a>
                        <a href="#" id="share-copy" title="Copy Link" onclick="copyArticleLink(event)">
                            <i class="fas fa-link" style="color: #64748b;"></i> Copy Link
                        </a>
                    </div>
                </div>
                
                <div class="sidebar-widget">
                    <h4>Stay Updated</h4>
                    <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1rem;">Get the latest cybersecurity news and tips delivered to your inbox.</p>
                    <a href="https://t.me/Elitechub" target="_blank" style="display: block; text-align: center; background: #0088cc; color: white; padding: 0.75rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: transform 0.2s;"><i class="fab fa-telegram-plane"></i> Join Telegram</a>
                </div>
            </aside>

        </div>
    </div>

    `;

    const finalContent = content.substring(0, startIndex) + newContent + content.substring(endIndex);
    fs.writeFileSync(file, finalContent, 'utf8');
    console.log('Successfully updated article.html structure.');
} else {
    console.log('Could not find markers.');
}
