import re

content = open('index.html', encoding='utf-8').read()

# Find all external links
external = re.findall(r'href="(https?://[^"]+)"', content)
unique = sorted(set(external))

print(f"=== External links found ({len(unique)}) ===")
for link in unique:
    print(link)

# Check for Telegram specifically
telegram = [l for l in unique if 't.me' in l or 'telegram' in l.lower()]
print(f"\n=== Telegram links ({len(telegram)}) ===")
for t in telegram:
    print(t)

# Check for nofollow / noopener attributes near links
nofollow_count = content.lower().count('rel="nofollow"')
noopener_count = content.lower().count('noopener')
print(f"\n=== Link attributes ===")
print(f'rel="nofollow" occurrences: {nofollow_count}')
print(f'"noopener" occurrences: {noopener_count}')
