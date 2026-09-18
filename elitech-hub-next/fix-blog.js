const fs = require('fs');
const path = 'src/app/blog/[slug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<div className={styles.articleAuthor}>
            {post.writers?.is_public && post.writers?.slug ? (
              <Link href={\`/authors/\${post.writers.slug}\`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                <div className={styles.authorAvatar} style={{ overflow: 'hidden' }}>
                  {post.writers.avatar_url ? (
                    <img src={post.writers.avatar_url} alt={post.writers.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getAuthorInitials(post.writers.display_name || post.author)
                  )}
                </div>
                <div>
                  <div className={styles.authorName}>{post.writers.display_name || post.author}</div>
                  <div className={styles.authorRole}>
                    {post.writers.professional_title || 'Elitech Hub Writer'}
                  </div>
                </div>
              </Link>
            ) : (
              <>
                <div className={styles.authorAvatar}>{getAuthorInitials(post.author)}</div>
                <div>
                  <div className={styles.authorName}>{post.author}</div>
                  <div className={styles.authorRole}>
                    {post.author?.toLowerCase().includes('elijah') ? 'Founder & Lead Instructor' : 'Elitech Hub Writer'}
                  </div>
                </div>
              </>
            )}
          </div>`;

// We will replace the above block with a clean version.
// Wait, the file currently has actual backticks, not backslashed backticks.
const currentTarget = content.substring(content.indexOf('<div className={styles.articleAuthor}>'), content.indexOf('</section>'));
console.log('Current block:', currentTarget.substring(0, 100));

// Let's just do a clean regex replacement for the articleAuthor block
const newBlock = `<div className={styles.articleAuthor}>
            {post.writers?.is_public && post.writers?.slug ? (
              <Link href={\`/authors/\${post.writers.slug}\`} className="flex items-center gap-4 hover:opacity-80 transition" style={{ textDecoration: 'none' }}>
                <div className={styles.authorAvatar} style={{ overflow: 'hidden' }}>
                  {post.writers.avatar_url ? (
                    <img src={post.writers.avatar_url} alt={post.writers.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getAuthorInitials(post.writers.display_name || post.author)
                  )}
                </div>
                <div>
                  <div className={styles.authorName}>{post.writers.display_name || post.author}</div>
                  <div className={styles.authorRole}>
                    {post.writers.professional_title || 'Elitech Hub Writer'}
                  </div>
                </div>
              </Link>
            ) : (
              <>
                <div className={styles.authorAvatar}>{getAuthorInitials(post.author)}</div>
                <div>
                  <div className={styles.authorName}>{post.author}</div>
                  <div className={styles.authorRole}>
                    {post.author?.toLowerCase().includes('elijah') ? 'Founder & Lead Instructor' : 'Elitech Hub Writer'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>`;

// Replace from articleAuthor down to the closing of heroImageInner (the two divs)
const startIndex = content.indexOf('<div className={styles.articleAuthor}>');
if (startIndex !== -1) {
  const endIndex = content.indexOf('</section>', startIndex);
  if (endIndex !== -1) {
    content = content.substring(0, startIndex) + newBlock + '\n      ' + content.substring(endIndex);
    fs.writeFileSync(path, content);
    console.log('Successfully patched blog post page.');
  } else {
    console.log('Could not find </section>');
  }
} else {
  console.log('Could not find articleAuthor block');
}
