import os

snippet = """<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "411fc70a36974f2e86415d364ce0ff91"}'></script><!-- End Cloudflare Web Analytics -->"""

target_dir = r"c:\Users\lenovo\OneDrive\Desktop\elitech-hub"

count = 0
for root, dirs, files in os.walk(target_dir):
    # skip elitech-hub-next as it has its own layout.tsx
    if "elitech-hub-next" in root or "node_modules" in root or ".git" in root:
        continue
    for file in files:
        if file.endswith(".html"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            if "static.cloudflareinsights.com/beacon.min.js" not in content:
                # Add right before </head> or </body>. 
                if "</head>" in content:
                    content = content.replace("</head>", f"{snippet}\n</head>")
                elif "</body>" in content:
                    content = content.replace("</body>", f"{snippet}\n</body>")
                else:
                    content += "\n" + snippet
                
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                count += 1

print(f"Successfully injected Cloudflare Analytics script into {count} HTML files.")
