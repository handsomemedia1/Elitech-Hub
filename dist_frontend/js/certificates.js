/* ============================================
   ELITECH HUB - CERTIFICATES MODAL
   Reusable certificate display system
   ============================================ */

(function() {
    'use strict';

    // Certificate Modal HTML Templates
    const certificates = {
        cac: `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark)); padding: 2rem; border-radius: 1rem 1rem 0 0;">
                    <i class="fas fa-certificate" style="font-size: 4rem; color: white; margin-bottom: 1rem;"></i>
                    <h2 style="color: white; font-family: 'Montserrat', sans-serif; font-size: 2rem; margin: 0;">CAC Registration Certificate</h2>
                </div>
                <div style="padding: 2rem; background: #F9FAFB; border-radius: 0 0 1rem 1rem;">
                    <div style="background: white; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem; text-align: center; cursor: zoom-in;" onclick="window.open('assets/images/CAC.png', '_blank')">
                        <img src="assets/images/CAC.png" alt="CAC Registration Certificate" style="max-width: 100%; height: auto; width: 100%; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); display: block;">
                        <p style="margin-top: 0.75rem; color: #6B7280; font-size: 0.875rem;"><i class="fas fa-search-plus"></i> Click to view full size</p>
                    </div>
                    <div style="background: white; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <div style="display: grid; gap: 1rem; text-align: left;">
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Registration Number</div>
                                <div style="color: var(--primary-color); font-weight: 700; font-size: 1.25rem;">RC: 8693883</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Company Name</div>
                                <div style="color: #0A0A0A; font-weight: 700; font-size: 1.125rem;">Elitech Hub Limited</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Status</div>
                                <div style="color: var(--success-color); font-weight: 700; font-size: 1.125rem;">✓ Active & Verified</div>
                            </div>
                        </div>
                    </div>
                    <p style="color: #6B7280; font-size: 0.875rem; text-align: center;">Officially registered with the Corporate Affairs Commission (CAC) of Nigeria</p>
                </div>
            </div>
        `,
        smedan: `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, var(--success-color), #1e7e4f); padding: 2rem; border-radius: 1rem 1rem 0 0;">
                    <i class="fas fa-shield-alt" style="font-size: 4rem; color: white; margin-bottom: 1rem;"></i>
                    <h2 style="color: white; font-family: 'Montserrat', sans-serif; font-size: 2rem; margin: 0;">SMEDAN Certification</h2>
                </div>
                <div style="padding: 2rem; background: #F9FAFB; border-radius: 0 0 1rem 1rem;">
                    <div style="background: white; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem; text-align: center; cursor: zoom-in;" onclick="window.open('assets/images/SMEDAN.png', '_blank')">
                        <img src="assets/images/SMEDAN.png" alt="SMEDAN Certification" style="max-width: 100%; height: auto; width: 100%; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); display: block;">
                        <p style="margin-top: 0.75rem; color: #6B7280; font-size: 0.875rem;"><i class="fas fa-search-plus"></i> Click to view full size</p>
                    </div>
                    <div style="background: white; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                        <div style="display: grid; gap: 1rem; text-align: left;">
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Certification</div>
                                <div style="color: var(--success-color); font-weight: 700; font-size: 1.25rem;">SMEDAN Verified</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Category</div>
                                <div style="color: #0A0A0A; font-weight: 700; font-size: 1.125rem;">Training & Certification</div>
                            </div>
                            <div>
                                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 0.25rem;">Status</div>
                                <div style="color: var(--success-color); font-weight: 700; font-size: 1.125rem;">✓ Certified</div>
                            </div>
                        </div>
                    </div>
                    <p style="color: #6B7280; font-size: 0.875rem; text-align: center;">Certified by the Small and Medium Enterprises Development Agency of Nigeria (SMEDAN)</p>
                </div>
            </div>
        `
    };

    // Create Modal HTML
    function createModal() {
        if (document.getElementById('certModal')) return; // Already exists

        const modalHTML = `
            <div id="certModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 10000; backdrop-filter: blur(5px); overflow-y: auto; padding: 2rem;">
                <div style="position: relative; min-height: 100%;">
                    <button onclick="closeCertModal()" style="position: fixed; top: 20px; right: 20px; background: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #0A0A0A; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.3s; z-index: 10001;">
                        <i class="fas fa-times"></i>
                    </button>
                    <div id="certModalContent" style="margin-top: 2rem; animation: slideIn 0.4s ease-out;">
                        <!-- Content will be inserted here -->
                    </div>
                </div>
            </div>
            <style>
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Open Certificate Modal
    window.openCertModal = function(type) {
        createModal();
        const modal = document.getElementById('certModal');
        const content = document.getElementById('certModalContent');

        if (certificates[type]) {
            content.innerHTML = certificates[type];
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    // Close Certificate Modal
    window.closeCertModal = function() {
        const modal = document.getElementById('certModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeCertModal();
        }
    });

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('certModal');
        if (e.target === modal) {
            window.closeCertModal();
        }
    });

    console.log('%c✅ Certificates module loaded', 'color: #2e8b57; font-weight: bold;');

})();
