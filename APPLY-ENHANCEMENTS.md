# Apply Enhancements to Remaining Pages

## ✅ Completed Pages:
- **index.html** - All enhancements applied
- **about.html** - All enhancements applied

## 🔄 To Apply to: programs.html, services.html, payment.html, blog.html

### Step-by-Step Enhancement Checklist:

---

## 1. Add Loader CSS Link

**Location:** `<head>` section after other CSS

```html
<link rel="stylesheet" href="css/loader.css">
```

---

## 2. Add Page Loader HTML

**Location:** Right after `<body>` tag

```html
<!-- Page Loader -->
<div class="page-loader" id="pageLoader">
    <div class="loader-particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
    </div>
    <div class="loader-content">
        <div class="loader-logo">
            <i class="fas fa-shield-halved"></i>
            <div class="loader-logo-text">
                <span>E</span><span>l</span><span>i</span><span>t</span><span>e</span><span>c</span><span>h</span>
                <span>H</span><span>u</span><span>b</span>
            </div>
        </div>
        <div class="loader-scanner">
            <div class="scanner-grid"></div>
            <div class="scanner-line"></div>
            <div class="scanner-text">INITIALIZING SECURITY PROTOCOLS...</div>
        </div>
        <div class="loader-bar-container">
            <div class="loader-bar"></div>
        </div>
        <div class="loader-text">Loading</div>
    </div>
</div>
```

---

## 3. Fix Hero Text Readability

**Location:** Inside the `<section class="hero">` tag

**Find:**
```html
<section class="hero" style="min-height: 60vh;">
    <div class="container">
```

**Replace with:**
```html
<section class="hero" style="min-height: 60vh;">
    <!-- Dark Overlay for Better Text Readability -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(10, 10, 10, 0.6) 100%); z-index: 0;"></div>

    <div class="container">
```

---

## 4. Add Certificate Badges

**Location:** After `</footer>` and before `<script src="js/main.js"></script>`

```html
<!-- Floating Certificate Badges -->
<div id="certificateBadges" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px;">
    <div class="cert-badge" onclick="openCertModal('cac')" style="background: white; border: 2px solid #DC2626; border-radius: 0.75rem; padding: 0.75rem 1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s; display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #DC2626, #991B1B); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
            <i class="fas fa-certificate"></i>
        </div>
        <div>
            <div style="font-weight: 700; font-size: 0.75rem; color: #0A0A0A;">CAC Registered</div>
            <div style="font-size: 0.625rem; color: #6B7280;">RC: 8693883</div>
        </div>
    </div>

    <div class="cert-badge" onclick="openCertModal('smedan')" style="background: white; border: 2px solid #008751; border-radius: 0.75rem; padding: 0.75rem 1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s; display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #008751, #006B3F); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
            <i class="fas fa-shield-alt"></i>
        </div>
        <div>
            <div style="font-weight: 700; font-size: 0.75rem; color: #0A0A0A;">SMEDAN Certified</div>
            <div style="font-size: 0.625rem; color: #6B7280;">Verified</div>
        </div>
    </div>
</div>

<!-- Certificate Modal -->
<div id="certModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 10000; align-items: center; justify-content: center;" onclick="closeCertModal()">
    <div style="position: relative; max-width: 90%; max-height: 90%; background: white; border-radius: 1rem; padding: 2rem;" onclick="event.stopPropagation()">
        <button onclick="closeCertModal()" style="position: absolute; top: 1rem; right: 1rem; background: #DC2626; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-times"></i>
        </button>
        <div id="certModalContent" style="text-align: center;"></div>
    </div>
</div>

<style>
    .cert-badge:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        #certificateBadges {
            bottom: 80px;
            right: 10px;
        }
        .cert-badge {
            font-size: 0.625rem !important;
        }
        .cert-badge > div:first-child {
            width: 30px !important;
            height: 30px !important;
            font-size: 0.75rem !important;
        }
    }
</style>
```

---

## 5. Add Scripts

**Location:** After `<script src="js/main.js"></script>` and before `</body>`

```html
<script>
    // Page Loader - Hide after page loads
    window.addEventListener('load', function() {
        const loader = document.getElementById('pageLoader');
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.addEventListener('DOMContentLoaded', function() {
        const sections = document.querySelectorAll('section:not(.hero)');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    });

    // Certificate Modal Functions
    function openCertModal(type) {
        const modal = document.getElementById('certModal');
        const content = document.getElementById('certModalContent');

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
    }

    function closeCertModal() {
        const modal = document.getElementById('certModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCertModal();
        }
    });
</script>
```

---

## Quick Summary:

✅ **about.html** - DONE
⏳ **programs.html** - Apply steps 1-5
⏳ **services.html** - Apply steps 1-5
⏳ **payment.html** - Apply steps 1-5
⏳ **blog.html** - Apply steps 1-5 + LinkedIn RSS (special handling)

All code snippets are ready to copy-paste!
