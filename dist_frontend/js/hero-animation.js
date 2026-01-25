// ============================================
// ELITECH HUB - ADVANCED HERO ANIMATION
// Particle Network + Matrix Effect
// ============================================

class HeroAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? '#DC2626' : '#008751'
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.vx -= (dx / distance) * force * 0.1;
                    particle.vy -= (dy / distance) * force * 0.1;
                }
            }

            // Speed limit
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 2) {
                particle.vx = (particle.vx / speed) * 2;
                particle.vy = (particle.vy / speed) * 2;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(220, 38, 38, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();
        this.drawConnections();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// Matrix Rain Effect
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

        this.init();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#DC2626';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        setTimeout(() => requestAnimationFrame(() => this.animate()), 50);
    }
}

// Terminal Typing Animation
class TerminalTyping {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.lines = [
            { text: '$ nmap -sS -Pn target.com', color: '#008751', delay: 0 },
            { text: 'Starting Nmap scan...', color: '#008751', delay: 800 },
            { text: 'PORT     STATE SERVICE', color: '#008751', delay: 1200 },
            { text: '22/tcp   open  ssh', color: '#008751', delay: 1600 },
            { text: '80/tcp   open  http', color: '#008751', delay: 2000 },
            { text: '443/tcp  open  https', color: '#008751', delay: 2400 },
            { text: '', color: '#008751', delay: 2800 },
            { text: '$ nikto -h target.com', color: '#DC2626', delay: 3200 },
            { text: 'Scanning for vulnerabilities...', color: '#F59E0B', delay: 3800 },
            { text: '+ Found: /admin (200 OK)', color: '#F59E0B', delay: 4400 },
            { text: '+ OSVDB-3233: /phpinfo.php', color: '#DC2626', delay: 5000 },
            { text: '+ Possible backup: /backup.zip', color: '#DC2626', delay: 5600 },
            { text: '', color: '#008751', delay: 6200 },
            { text: '$ msfconsole', color: '#DC2626', delay: 6800 },
            { text: 'Loading modules...', color: '#F59E0B', delay: 7400 },
            { text: 'msf6 > use exploit/multi/handler', color: '#008751', delay: 8000 }
        ];

        this.currentLine = 0;
        this.animate();
    }

    animate() {
        if (this.currentLine >= this.lines.length) {
            setTimeout(() => {
                this.element.innerHTML = '';
                this.currentLine = 0;
                this.animate();
            }, 3000);
            return;
        }

        const line = this.lines[this.currentLine];

        setTimeout(() => {
            const div = document.createElement('div');
            div.style.color = line.color;
            div.style.marginBottom = '0.5rem';
            div.textContent = line.text;
            this.element.appendChild(div);

            // Auto scroll
            this.element.scrollTop = this.element.scrollHeight;

            this.currentLine++;
            this.animate();
        }, line.delay);
    }
}

// Counter Animation
class CounterAnimation {
    constructor(elementId, target, duration = 2000, suffix = '') {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.target = target;
        this.duration = duration;
        this.suffix = suffix;
        this.started = false;

        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.started) {
                    this.started = true;
                    this.animate();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animate() {
        const start = 0;
        const increment = this.target / (this.duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= this.target) {
                current = this.target;
                clearInterval(timer);
            }
            this.element.textContent = Math.floor(current) + this.suffix;
        }, 16);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hero particle animation
    if (document.getElementById('heroCanvas')) {
        new HeroAnimation('heroCanvas');
    }

    // Matrix rain effect (optional, can be added to hero)
    if (document.getElementById('matrixCanvas')) {
        new MatrixRain('matrixCanvas');
    }

    // Terminal typing
    if (document.getElementById('terminalContent')) {
        new TerminalTyping('terminalContent');
    }

    // Counter animations
    if (document.getElementById('stat-weeks')) {
        new CounterAnimation('stat-weeks', 16);
    }
    if (document.getElementById('stat-job-rate')) {
        new CounterAnimation('stat-job-rate', 85, 2000, '%');
    }
    if (document.getElementById('stat-cost')) {
        new CounterAnimation('stat-cost', 75, 2000, 'K');
    }
    if (document.getElementById('stat-students')) {
        new CounterAnimation('stat-students', 300, 2000, '+');
    }
});
