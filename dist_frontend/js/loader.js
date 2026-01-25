// ============================================
// ELITECH HUB - PROFESSIONAL LOADER
// Handles page load animation and progress
// ============================================

class ProfessionalLoader {
    constructor() {
        this.loader = document.getElementById('professionalLoader');
        this.progressBar = document.getElementById('progressBar');
        this.progressIndicator = this.progressBar?.querySelector('.progress-indicator');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.loadingStatus = document.getElementById('loadingStatus');
        
        this.progress = 0;
        this.progressInterval = null; // Store interval reference
        this.statusMessages = [
            'Initializing Security Protocols...',
            'Loading Cybersecurity Framework...',
            'Establishing Secure Connection...',
            'Configuring Defense Systems...',
            'Activating Threat Detection...',
            'Finalizing Setup...'
        ];
        this.currentMessageIndex = 0;
        
        this.init();
    }
    
    init() {
        // Enable console debugging only during local development
        this.debug = ['localhost', '127.0.0.1'].includes(location.hostname) || location.hostname === '';
        if (this.debug) console.log('ProfessionalLoader: init() — debug enabled');

        // Start loading animation
        this.startLoading();
        
        // Update progress periodically
        this.startProgressAnimation();
        
        // Track actual page load
        this.trackPageLoad();
    }
    
    startLoading() {
        // Set initial state
        if (this.progressIndicator) {
            this.progressIndicator.style.width = '0%';
        }
        
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';
    }
    
    startProgressAnimation() {
        // Animate progress bar smoothly
        this.progressInterval = setInterval(() => {
            if (this.progress < 90) {
                // Increment progress
                const increment = Math.random() * 15 + 5; // 5-20%
                this.progress = Math.min(this.progress + increment, 90);
                
                this.setProgress(this.progress);
                
                // Update status message
                const messageIndex = Math.floor(this.progress / (90 / this.statusMessages.length));
                if (messageIndex !== this.currentMessageIndex && messageIndex < this.statusMessages.length) {
                    this.currentMessageIndex = messageIndex;
                    this.updateStatus(this.statusMessages[messageIndex]);
                }
            } else {
                // Stop the interval once we reach 90%
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                    this.progressInterval = null;
                }
            }
        }, 400);
    }
    
    trackPageLoad() {
        // Listen for window load event
        window.addEventListener('load', () => {
            if (this.debug) console.log('ProfessionalLoader: window load event fired');
            this.completeLoading();
        });
        
        // Fallback: complete after maximum time (5 seconds)
        setTimeout(() => {
            if (this.progress < 100) {
                if (this.debug) console.log('ProfessionalLoader: fallback timeout reached');
                this.completeLoading();
            }
        }, 5000);
    }
    
    
    setProgress(percent) {
        const roundedPercent = Math.round(percent);
        
        if (this.progressIndicator) {
            this.progressIndicator.style.width = `${roundedPercent}%`;
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${roundedPercent}%`;
        }

        if (this.debug) console.debug('ProfessionalLoader: progress =>', roundedPercent + '%');
    }
    
    updateStatus(message) {
        if (this.loadingStatus) {
            // Fade out
            this.loadingStatus.style.opacity = '0';
            
            setTimeout(() => {
                this.loadingStatus.textContent = message;
                // Fade in
                this.loadingStatus.style.opacity = '1';
            }, 300);
        }
    }
    
    completeLoading() {
        // Clear the progress interval to stop it
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        // Set progress to 100%
        this.progress = 100;
        this.setProgress(100);
        this.updateStatus('Welcome to Elitech Hub!');

        if (this.debug) console.log('ProfessionalLoader: completeLoading() — completed');
        
        // Wait a moment before hiding loader
        setTimeout(() => {
            this.hideLoader();
        }, 800);
    }
    
    hideLoader() {
        if (!this.loader) return;
        
        // Fade out and remove from DOM
        this.loader.style.transition = 'opacity 0.5s ease';
        this.loader.style.opacity = '0';
        
        setTimeout(() => {
            // Complete removal
            this.loader.style.display = 'none';
            this.loader.style.visibility = 'hidden';
            this.loader.style.pointerEvents = 'none';
            
            // Re-enable scrolling explicitly
            document.body.style.overflow = 'visible';
            document.documentElement.style.overflow = 'visible';
            
            // Force layout recalculation
            void document.body.offsetHeight;
            
            // Trigger page enter animation
            this.triggerPageEnterAnimation();
        }, 500);
    }
    
    triggerPageEnterAnimation() {
        // Add animation class to body
        document.body.classList.add('page-loaded');
        
        // Animate hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('fade-in-up');
        }
        
        // Stagger animate other sections
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('fade-in');
            }, index * 100);
        });
    }
}

// Initialize loader when DOM is ready (wrapped and idempotent)
(() => {
    let loaderInitialized = false;

    function initLoader() {
        if (loaderInitialized) return;
        loaderInitialized = true;

        // Create the loader only if the markup exists
        if (document.getElementById('professionalLoader')) {
            new ProfessionalLoader();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader);
    } else {
        initLoader();
    }
})();

// ============================================
// SMOOTH SCROLL PROGRESS BAR
// ============================================

function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    initScrollProgress();
});

// ============================================
// EXPORT FOR MODULE USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfessionalLoader, initScrollProgress };
}