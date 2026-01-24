#!/usr/bin/env python3
"""
Elitech Hub Website Server
This script serves the Elitech Hub website locally and provides deployment options.
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import socket
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with proper MIME types and error handling"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.log_date_time_string()}] {format % args}")


def get_local_ip():
    """Get the local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"


def check_port_available(port):
    """Check if a port is available"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) != 0


def find_available_port(start_port=8000):
    """Find an available port starting from start_port"""
    port = start_port
    while port < start_port + 100:
        if check_port_available(port):
            return port
        port += 1
    return None


def print_banner():
    """Print a nice banner"""
    banner = """
    ===============================================================

           ELITECH HUB WEBSITE SERVER
           Nigeria's #1 Cybersecurity Training

    ===============================================================
    """
    print(banner)


def print_deployment_info():
    """Print deployment options"""
    deployment_info = """
    ===============================================================
                      DEPLOYMENT OPTIONS
    ===============================================================

    To deploy this website online, you have several options:

    1. NETLIFY (Recommended - Free & Easy)
       - Go to https://www.netlify.com
       - Drag and drop the 'elitech-hub' folder
       - Get instant HTTPS URL
       - Custom domain support

    2. VERCEL (Free & Fast)
       - Install: npm i -g vercel
       - Run: vercel --prod
       - Automatic HTTPS and CDN

    3. GITHUB PAGES (Free)
       - Create a GitHub repository
       - Push your code
       - Enable GitHub Pages in settings

    4. FIREBASE HOSTING (Free tier)
       - Install: npm i -g firebase-tools
       - Run: firebase init hosting
       - Deploy: firebase deploy

    5. SURGE (Quick & Simple)
       - Install: npm i -g surge
       - Run: surge

    For production, I recommend Netlify or Vercel for best performance!
    """
    print(deployment_info)


def start_server():
    """Start the local development server"""
    global PORT

    os.chdir(DIRECTORY)

    print_banner()

    # Check if index.html exists
    if not os.path.exists('index.html'):
        print("[ERROR] index.html not found in the current directory!")
        print(f"Current directory: {os.getcwd()}")
        sys.exit(1)

    # Find available port
    if not check_port_available(PORT):
        print(f"[WARNING] Port {PORT} is busy, finding another port...")
        PORT = find_available_port(PORT)
        if PORT is None:
            print("[ERROR] Could not find an available port!")
            sys.exit(1)

    local_ip = get_local_ip()

    # Create server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print("[OK] Server started successfully!\n")
        print("Access your website at:")
        print(f"   - Local:   http://localhost:{PORT}")
        print(f"   - Network: http://{local_ip}:{PORT}")
        print("\nShare the Network URL with others on your network!")
        print("\nPress Ctrl+C to stop the server\n")
        print("=" * 60)

        # Open browser automatically
        try:
            webbrowser.open(f'http://localhost:{PORT}')
            print("Opening website in your default browser...")
        except:
            pass

        print("\nServer Logs:")
        print("=" * 60 + "\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n[STOPPED] Server stopped by user")
            print_deployment_info()
            sys.exit(0)


if __name__ == "__main__":
    try:
        start_server()
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        sys.exit(1)
