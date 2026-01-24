#!/usr/bin/env python3
"""
Quick Deployment Script for Netlify
This script helps you deploy the Elitech Hub website to Netlify.
"""

import os
import sys
import json
import subprocess
import zipfile
from pathlib import Path

DIRECTORY = Path(__file__).parent


def print_banner():
    banner = """
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║        🚀  NETLIFY DEPLOYMENT HELPER  🚀                  ║
    ║        Deploy Elitech Hub to the Cloud                    ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    """
    print("\033[94m" + banner + "\033[0m")


def create_netlify_config():
    """Create netlify.toml configuration file"""
    config = """[build]
  publish = "."
  command = "echo 'No build command needed for static site'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
"""

    with open(DIRECTORY / "netlify.toml", "w") as f:
        f.write(config)
    print("\033[92m✅ Created netlify.toml configuration file\033[0m")


def create_deployment_zip():
    """Create a ZIP file ready for drag-and-drop deployment"""
    print("\n📦 Creating deployment package...")

    zip_path = DIRECTORY / "elitech-hub-deploy.zip"

    # Files to exclude
    exclude = {
        'serve_website.py',
        'deploy_to_netlify.py',
        'START_SERVER.bat',
        'elitech-hub-deploy.zip',
        '.git',
        '__pycache__',
        '*.pyc',
        '.DS_Store',
        'temp_hero_update.txt',
        '*.md'
    }

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DIRECTORY):
            # Filter out excluded directories
            dirs[:] = [d for d in dirs if d not in exclude]

            for file in files:
                if file in exclude or file.endswith('.md') or file.endswith('.bak'):
                    continue

                file_path = Path(root) / file
                arcname = file_path.relative_to(DIRECTORY)
                zipf.write(file_path, arcname)
                print(f"   Added: {arcname}")

    print(f"\n\033[92m✅ Deployment package created: {zip_path.name}\033[0m")
    return zip_path


def check_netlify_cli():
    """Check if Netlify CLI is installed"""
    try:
        result = subprocess.run(['netlify', '--version'],
                              capture_output=True,
                              text=True,
                              timeout=5)
        return result.returncode == 0
    except:
        return False


def deploy_with_cli():
    """Deploy using Netlify CLI"""
    print("\n🚀 Deploying to Netlify...")
    print("\nYou'll need to:")
    print("  1. Log in to Netlify (browser will open)")
    print("  2. Authorize the deployment")
    print("  3. Choose or create a site\n")

    try:
        os.chdir(DIRECTORY)
        subprocess.run(['netlify', 'deploy', '--prod'], check=True)
        print("\n\033[92m✅ Deployment successful!\033[0m")
    except subprocess.CalledProcessError:
        print("\n\033[91m❌ Deployment failed!\033[0m")
        return False
    except KeyboardInterrupt:
        print("\n\033[93m⚠️  Deployment cancelled by user\033[0m")
        return False
    return True


def print_manual_instructions(zip_path):
    """Print manual deployment instructions"""
    instructions = f"""
    ╔═══════════════════════════════════════════════════════════╗
    ║              MANUAL DEPLOYMENT INSTRUCTIONS               ║
    ╚═══════════════════════════════════════════════════════════╝

    📋 OPTION 1: Drag & Drop (Easiest)
    ─────────────────────────────────────────────────────────────
    1. Go to https://app.netlify.com/drop
    2. Drag and drop: {zip_path.name}
    3. Wait for deployment (usually ~30 seconds)
    4. Get your live URL!

    📋 OPTION 2: Netlify Dashboard
    ─────────────────────────────────────────────────────────────
    1. Go to https://app.netlify.com
    2. Click "Add new site" → "Deploy manually"
    3. Drag the entire 'elitech-hub' folder
    4. Your site will be live in seconds!

    📋 OPTION 3: Install Netlify CLI
    ─────────────────────────────────────────────────────────────
    1. Install Node.js from https://nodejs.org
    2. Run: npm install -g netlify-cli
    3. Run this script again
    4. Automated deployment!

    💡 TIPS:
    ─────────────────────────────────────────────────────────────
    • Free tier includes: HTTPS, CDN, Custom domain
    • You can update by dragging new files
    • Use "Site settings" to add custom domain
    • Enable "Branch deploys" for automatic updates

    🌐 After deployment, you'll get a URL like:
       https://elitech-hub-XXXXX.netlify.app

    """
    print("\033[96m" + instructions + "\033[0m")


def main():
    os.chdir(DIRECTORY)
    print_banner()

    # Create Netlify configuration
    create_netlify_config()

    # Check if Netlify CLI is installed
    has_netlify_cli = check_netlify_cli()

    if has_netlify_cli:
        print("\n\033[92m✅ Netlify CLI detected!\033[0m")
        print("\nHow would you like to deploy?")
        print("  1. Deploy with CLI (automated)")
        print("  2. Create ZIP for manual deployment")

        choice = input("\nEnter your choice (1 or 2): ").strip()

        if choice == "1":
            if deploy_with_cli():
                print("\n🎉 Your website is now live!")
                return
            else:
                print("\nFalling back to manual deployment...")

    # Create deployment package
    zip_path = create_deployment_zip()

    # Show manual instructions
    print_manual_instructions(zip_path)

    print("\n✨ Deployment package ready! Follow the instructions above.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n\033[93m⚠️  Deployment cancelled by user\033[0m")
        sys.exit(0)
    except Exception as e:
        print(f"\n\033[91m❌ Error: {str(e)}\033[0m")
        sys.exit(1)
