import os

MAIN_JS_PATH = 'css/../js/main.js'

missing_code = """
/* ============================================
   15. PAGE LOADER & CERTIFICATE MODALS
   ============================================ */

// Page Loader - Hide after page loads (Fallback for all pages)
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
    }
});

// Certificate Modal Functions
window.openCertModal = function(type) {
    const modal = document.getElementById('certModal');
    const content = document.getElementById('certModalContent');
    if (!modal || !content) return;

    if (type === 'cac') {
        content.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #DC2626, #991B1B); padding: 2rem; border-radius: 1rem 1rem 0 0;">
                    <i class="fas fa-certificate" style="font-size: 4rem; color: white; margin-bottom: 1rem;"></i>
                    <h2 style="color: white; font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin: 0;">CAC Registration</h2>
                </div>
                <div style="padding: 2rem; background: #F9FAFB; border-radius: 0 0 1rem 1rem;">
                    <div style="background: white; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h3 style="font-family: 'Space Grotesk', sans-serif; color: #0A0A0A; margin-bottom: 1rem;">Elitech Hub Limited</h3>
                        <div style="display: grid; gap: 1rem; text-align: left;">
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Registration Number (RC)</div>
                                <div style="color: #DC2626; font-weight: 700; font-size: 1.5rem;">8693883</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Company Type</div>
                                <div style="color: #0A0A0A; font-weight: 600;">Limited by Shares</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Status</div>
                                <div style="color: #008751; font-weight: 600;"><i class="fas fa-check-circle"></i> Active & Registered</div>
                            </div>
                        </div>
                    </div>
                    <p style="color: #6B7280; font-size: 0.875rem;">Officially registered with the Corporate Affairs Commission (CAC) of Nigeria</p>
                </div>
            </div>
        `;
    } else if (type === 'smedan') {
        content.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #008751, #006B3F); padding: 2rem; border-radius: 1rem 1rem 0 0;">
                    <i class="fas fa-shield-alt" style="font-size: 4rem; color: white; margin-bottom: 1rem;"></i>
                    <h2 style="color: white; font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin: 0;">SMEDAN Certification</h2>
                </div>
                <div style="padding: 2rem; background: #F9FAFB; border-radius: 0 0 1rem 1rem;">
                    <div style="background: white; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h3 style="font-family: 'Space Grotesk', sans-serif; color: #0A0A0A; margin-bottom: 1rem;">Elitech Hub Limited</h3>
                        <div style="display: grid; gap: 1rem; text-align: left;">
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Certification</div>
                                <div style="color: #008751; font-weight: 700; font-size: 1.25rem;">SMEDAN Verified</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Category</div>
                                <div style="color: #0A0A0A; font-weight: 600;">Education & Training Services</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Status</div>
                                <div style="color: #008751; font-weight: 600;"><i class="fas fa-check-circle"></i> Verified & Certified</div>
                            </div>
                        </div>
                    </div>
                    <p style="color: #6B7280; font-size: 0.875rem;">Certified by the Small and Medium Enterprises Development Agency of Nigeria (SMEDAN)</p>
                </div>
            </div>
        `;
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeCertModal = function() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (typeof window.closeCertModal === 'function') {
            window.closeCertModal();
        }
    }
});
"""

def main():
    if not os.path.exists(MAIN_JS_PATH):
        print(f"Error: Could not find {MAIN_JS_PATH}")
        return

    with open(MAIN_JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    if "PAGE LOADER & CERTIFICATE MODALS" in content:
        print("Code already injected. Skipping.")
        return

    # Insert it right before the SW registration or at the end
    if "/* ============================================\n   14. SERVICE WORKER REGISTRATION" in content:
        content = content.replace("/* ============================================\n   14. SERVICE WORKER REGISTRATION", missing_code + "\n\n/* ============================================\n   14. SERVICE WORKER REGISTRATION")
    else:
        content += missing_code

    with open(MAIN_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Successfully injected missing code into main.js!")

if __name__ == '__main__':
    main()
