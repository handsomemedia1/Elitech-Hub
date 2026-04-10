/**
 * Lab GitLab Integration
 * Fetches dynamic lab artifacts from the public Elitech-Hub/Lab repository
 */

document.addEventListener('DOMContentLoaded', () => {
    // Project ID or encoded path for the public GitLab repository
    const PROJECT_PATH = 'elitech-hub%2FLab';
    const API_BASE = `https://gitlab.com/api/v4/projects/${PROJECT_PATH}`;

    const grid = document.getElementById('artifactsGrid');
    if (!grid) return;

    fetchGitLabArtifacts();

    async function fetchGitLabArtifacts() {
        try {
            // First, get the repository tree (recursive) to find artifact files
            const res = await fetch(`${API_BASE}/repository/tree?recursive=true&per_page=100`);
            
            if (!res.ok) {
                console.warn('GitLab API returned status:', res.status, '- displaying fallback cards.');
                return; // Fallback cards remain in HTML
            }

            const files = await res.json();
            
            // Filter out purely administrative files (README, CONTRIBUTING) or directories
            const artifacts = files.filter(f => 
                f.type === 'blob' && 
                !f.name.toLowerCase().includes('readme.md') && 
                !f.name.toLowerCase().includes('contributing.md')
            );

            if (artifacts.length === 0) {
                console.log('No artifacts found in GitLab yet. Keeping fallback cards.');
                return;
            }

            // We have real artifacts! Let's clear the static fallbacks
            grid.innerHTML = '';
            
            // Let's take up to 6 recent artifacts to display
            const displayArtifacts = artifacts.slice(0, 6);

            for (const item of displayArtifacts) {
                // Determine icon and tag based on path
                let icon = 'fas fa-file-code';
                let tag = 'Lab Artifact';
                
                if (item.path.includes('detection')) {
                    icon = 'fas fa-crosshairs';
                    tag = 'Detection Engineering';
                } else if (item.path.includes('threat')) {
                    icon = 'fas fa-spider';
                    tag = 'Threat Analysis';
                } else if (item.path.includes('infrastructure')) {
                    icon = 'fas fa-shield-alt';
                    tag = 'Defensive Infrastructure';
                } else if (item.path.includes('devsecops')) {
                    icon = 'fas fa-code-branch';
                    tag = 'DevSecOps';
                }

                // Create card
                const card = document.createElement('div');
                card.className = 'artifact-card';
                card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                
                // Formulate direct raw link
                const rawLink = `https://gitlab.com/elitech-hub/Lab/-/blob/main/${item.path}`;

                card.innerHTML = `
                    <div class="artifact-card-header">
                        <i class="${icon}"></i>
                        <h3 style="font-size:1.1rem; margin-left:0.5rem; word-break: break-all;">${item.name}</h3>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--gray); margin-bottom: 1rem;">
                        View source code and implementation documentation directly on GitLab.
                    </p>
                    <a href="${rawLink}" target="_blank" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.5rem 1rem;">
                        <i class="fab fa-gitlab"></i> View File
                    </a>
                    <span class="artifact-tag" style="margin-top:1rem; display:inline-block;">${tag}</span>
                `;
                
                grid.appendChild(card);
            }

        } catch (err) {
            console.error('Failed to fetch from GitLab:', err);
            // On network error, the fallback cards simply remain gracefully
        }
    }
});
