// simulation.js - Hacking Simulation for Elitech Hub

// ===========================
// TERMINAL SIMULATION
// ===========================
class HackingSimulation {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.networkViz = document.getElementById('networkViz');
        this.isRunning = false;
        this.currentPhase = 0;
        
        // Simulation phases
        this.phases = [
            {
                type: 'scan',
                lines: [
                    { text: '$ nmap -sV 192.168.1.0/24', class: 'prompt', delay: 500 },
                    { text: 'Starting Nmap scan...', class: '', delay: 800 },
                    { text: '⚠ Found 3 open ports: 22, 80, 443', class: 'warning', delay: 1200 },
                    { text: '✓ Host is up (0.0012s latency)', class: 'success', delay: 600 }
                ]
            },
            {
                type: 'vulnerability',
                lines: [
                    { text: '$ ./vulnerability_scanner --deep', class: 'prompt', delay: 500 },
                    { text: 'Analyzing system vulnerabilities...', class: '', delay: 1000 },
                    { text: '✗ Critical: SQL injection detected', class: 'error', delay: 1500 },
                    { text: '✗ High: Outdated SSL certificate', class: 'error', delay: 800 },
                    { text: '⚠ Medium: Weak password policy', class: 'warning', delay: 600 }
                ]
            },
            {
                type: 'exploit',
                lines: [
                    { text: '$ msfconsole', class: 'prompt', delay: 400 },
                    { text: 'Loading Metasploit Framework...', class: '', delay: 800 },
                    { text: 'msf > use exploit/web/sql_injection', class: 'prompt', delay: 1000 },
                    { text: 'msf exploit(sql_injection) > set RHOST 192.168.1.100', class: 'prompt', delay: 800 },
                    { text: 'msf exploit(sql_injection) > exploit', class: 'prompt', delay: 600 },
                    { text: '✗ Exploit attempt detected and blocked!', class: 'error', delay: 1500 }
                ]
            },
            {
                type: 'defense',
                lines: [
                    { text: '$ sudo firewall --enable-protection', class: 'prompt', delay: 500 },
                    { text: 'Activating defensive measures...', class: '', delay: 800 },
                    { text: '✓ Firewall rules updated', class: 'success', delay: 600 },
                    { text: '✓ IDS/IPS activated', class: 'success', delay: 600 },
                    { text: '✓ Threat neutralized', class: 'success', delay: 800 }
                ]
            },
            {
                type: 'patch',
                lines: [
                    { text: '$ apt-get update && apt-get upgrade -y', class: 'prompt', delay: 500 },
                    { text: 'Fetching security updates...', class: '', delay: 1000 },
                    { text: '✓ 12 packages updated', class: 'success', delay: 800 },
                    { text: '✓ Security patches applied', class: 'success', delay: 600 },
                    { text: '✓ System hardened successfully', class: 'success', delay: 700 }
                ]
            },
            {
                type: 'monitor',
                lines: [
                    { text: '$ tail -f /var/log/security.log', class: 'prompt', delay: 500 },
                    { text: '[INFO] System monitoring active', class: '', delay: 600 },
                    { text: '[INFO] No threats detected', class: 'success', delay: 800 },
                    { text: '✓ System secure | Status: Protected', class: 'success', delay: 1000 },
                    { text: '$ _', class: 'prompt cursor', delay: 500 }
                ]
            }
        ];
        
        this.init();
    }
    
    init() {
        if (this.terminal) {
            this.startSimulation();
        }
        if (this.networkViz) {
            this.initNetworkVisualization();
        }
    }
    
    startSimulation() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.runPhase();
    }
    
    runPhase() {
        const phase = this.phases[this.currentPhase];
        this.clearTerminal();
        this.displayPhaseLines(phase.lines, 0, () => {
            // Update network visualization based on phase
            if (this.networkViz) {
                this.updateNetworkVisualization(phase.type);
            }
            
            // Move to next phase
            this.currentPhase = (this.currentPhase + 1) % this.phases.length;
            
            // Wait before starting next phase
            setTimeout(() => {
                this.runPhase();
            }, 3000);
        });
    }
    
    displayPhaseLines(lines, index, callback) {
        if (index >= lines.length) {
            callback();
            return;
        }
        
        const line = lines[index];
        setTimeout(() => {
            this.addTerminalLine(line.text, line.class);
            this.displayPhaseLines(lines, index + 1, callback);
        }, line.delay);
    }
    
    addTerminalLine(text, className = '') {
        const lineDiv = document.createElement('div');
        lineDiv.className = `terminal-line ${className}`;
        lineDiv.innerHTML = this.formatText(text);
        this.terminal.appendChild(lineDiv);
        
        // Keep only last 8 lines
        while (this.terminal.children.length > 8) {
            this.terminal.removeChild(this.terminal.firstChild);
        }
        
        // Scroll to bottom
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    formatText(text) {
        // Format special characters
        text = text.replace(/\$/g, '<span class="prompt">$</span>');
        text = text.replace(/✓/g, '<span class="success">✓</span>');
        text = text.replace(/✗/g, '<span class="error">✗</span>');
        text = text.replace(/⚠/g, '<span class="warning">⚠</span>');
        return text;
    }
    
    clearTerminal() {
        this.terminal.innerHTML = '';
    }
    
    initNetworkVisualization() {
        const svg = this.networkViz.querySelector('.network-svg');
        if (!svg) return;
        
        // Create network nodes
        const nodes = [
            { id: 'server', x: 200, y: 50, label: 'Server', color: '#3B82F6' },
            { id: 'firewall', x: 200, y: 150, label: 'Firewall', color: '#EF4444' },
            { id: 'client1', x: 100, y: 250, label: 'Client 1', color: '#10B981' },
            { id: 'client2', x: 200, y: 250, label: 'Client 2', color: '#10B981' },
            { id: 'client3', x: 300, y: 250, label: 'Client 3', color: '#10B981' },
            { id: 'attacker', x: 350, y: 150, label: 'Attacker', color: '#EF4444' }
        ];
        
        // Create connections
        const connections = [
            { from: 'server', to: 'firewall' },
            { from: 'firewall', to: 'client1' },
            { from: 'firewall', to: 'client2' },
            { from: 'firewall', to: 'client3' },
            { from: 'attacker', to: 'firewall', type: 'attack' }
        ];
        
        // Draw connections
        connections.forEach(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromNode.x);
            line.setAttribute('y1', fromNode.y);
            line.setAttribute('x2', toNode.x);
            line.setAttribute('y2', toNode.y);
            line.setAttribute('stroke', conn.type === 'attack' ? '#EF4444' : '#3B82F6');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('opacity', '0.5');
            line.classList.add('network-connection');
            if (conn.type === 'attack') {
                line.classList.add('attack-line');
            }
            svg.appendChild(line);
        });
        
        // Draw nodes
        nodes.forEach(node => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.classList.add('network-node');
            g.setAttribute('data-node', node.id);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', '20');
            circle.setAttribute('fill', node.color);
            circle.setAttribute('opacity', '0.8');
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 35);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#E2E8F0');
            text.setAttribute('font-size', '12');
            text.textContent = node.label;
            
            g.appendChild(circle);
            g.appendChild(text);
            svg.appendChild(g);
        });
    }
    
    updateNetworkVisualization(phaseType) {
        if (!this.networkViz) return;
        
        const attackerNode = this.networkViz.querySelector('[data-node="attacker"] circle');
        const firewallNode = this.networkViz.querySelector('[data-node="firewall"] circle');
        const serverNode = this.networkViz.querySelector('[data-node="server"] circle');
        const attackLine = this.networkViz.querySelector('.attack-line');
        
        // Reset all animations
        const allNodes = this.networkViz.querySelectorAll('.network-node circle');
        allNodes.forEach(node => {
            node.style.animation = '';
        });
        
        // Apply phase-specific animations
        switch(phaseType) {
            case 'scan':
                if (attackerNode) {
                    attackerNode.style.animation = 'pulse 1s infinite';
                }
                break;
            case 'vulnerability':
                if (serverNode) {
                    serverNode.style.animation = 'pulse 1s infinite';
                    serverNode.setAttribute('fill', '#F59E0B');
                }
                break;
            case 'exploit':
                if (attackLine) {
                    attackLine.style.animation = 'dataFlow 2s linear infinite';
                }
                if (attackerNode) {
                    attackerNode.style.animation = 'pulse 0.5s infinite';
                }
                break;
            case 'defense':
                if (firewallNode) {
                    firewallNode.style.animation = 'glow 1s infinite';
                    firewallNode.setAttribute('fill', '#10B981');
                }
                if (attackLine) {
                    attackLine.style.opacity = '0.1';
                }
                break;
            case 'patch':
                if (serverNode) {
                    serverNode.setAttribute('fill', '#10B981');
                    serverNode.style.animation = 'pulse 1s';
                }
                break;
            case 'monitor':
                allNodes.forEach(node => {
                    if (node.getAttribute('data-node') !== 'attacker') {
                        node.setAttribute('fill', '#10B981');
                    }
                });
                if (attackerNode) {
                    attackerNode.style.opacity = '0.3';
                }
                break;
        }
    }
}

// ===========================
// MATRIX RAIN EFFECT
// ===========================
class MatrixRain {
    constructor(container) {
        this.container = container;
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = Math.floor(window.innerWidth / this.fontSize);
        this.drops = [];
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.1';
        
        if (this.container) {
            this.container.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Initialize drops
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(window.innerWidth / this.fontSize);
    }
    
    animate() {
        // Semi-transparent black to create fade effect
        this.ctx.fillStyle = 'rgba(2, 6, 23, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set text properties
        this.ctx.fillStyle = '#3B82F6';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillText(char, x, y);
            
            // Reset drop when it reaches bottom
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===========================
// INITIALIZE ON LOAD
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Start hacking simulation
    const simulation = new HackingSimulation();
    
    // Add matrix rain to hero section (optional - can be CPU intensive)
    const heroSection = document.querySelector('.hero');
    if (heroSection && window.innerWidth > 768) {
        // Only on desktop for performance
        // new MatrixRain(heroSection);
    }
    
    // Add glitch effect to logo on hover
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.classList.add('glitch');
            setTimeout(() => {
                logo.classList.remove('glitch');
            }, 1000);
        });
    }
});

// Export for use in other scripts
window.HackingSimulation = HackingSimulation;
window.MatrixRain = MatrixRain;