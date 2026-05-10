import re

# Check across ALL public HTML pages
import os

pages = [f for f in os.listdir('.') if f.endswith('.html') and not f.endswith('.bak')]

all_external = []
telegram_links = []
social_links = []

for page in pages:
    try:
        content = open(page, encoding='utf-8').read()
        links = re.findall(r'href="(https?://[^"]+)"', content)
        for link in links:
            all_external.append((page, link))
            if 't.me' in link or 'telegram' in link.lower():
                telegram_links.append((page, link))
            if any(s in link for s in ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'whatsapp', 'wa.me']):
                social_links.append((page, link))
    except:
        pass

print("=== TELEGRAM LINKS (across all pages) ===")
for page, link in set(telegram_links):
    print(f"  [{page}] {link}")

print("\n=== SOCIAL MEDIA LINKS (across all pages) ===")
for page, link in sorted(set(social_links)):
    print(f"  [{page}] {link}")

print(f"\n=== TOTAL external links across {len(pages)} pages: {len(set(l for _,l in all_external))} unique ===")
