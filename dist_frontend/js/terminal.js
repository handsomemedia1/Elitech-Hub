// terminal.js - Interactive Terminal Simulation for Elitech Hub
// Provides realistic terminal experience with command execution and animations

class Terminal {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`Terminal element with id '${elementId}' not found`);
            return;
        }

        // Configuration
        this.options = {
            prompt: options.prompt || 'user@elitech-hub:~$',
            welcomeMessage: options.welcomeMessage || this.getDefaultWelcome(),
            maxHistory: options.maxHistory || 50,
            typeSpeed: options.typeSpeed || 30,
            commandDelay: options.commandDelay || 100,
            theme: options.theme || 'dark',
            allowInput: options.allowInput !== false,
            commands: options.commands || this.getDefaultCommands(),
            ...options
        };

        // State
        this.history = [];
        this.historyIndex = -1;
        this.commandQueue = [];
        this.isProcessing = false;
        this.currentLine = '';

        // Initialize
        this.init();
    }

    init() {
        this.createTerminalStructure();
        this.applyTheme();
        if (this.options.allowInput) {
            this.setupInputHandlers();
        }
        this.displayWelcomeMessage();
    }

    createTerminalStructure() {
        this.element.innerHTML = `
            <div class="terminal-container" data-theme="${this.options.theme}">
                <div class="terminal-header">
                    <div class="terminal-buttons">
                        <span class="terminal-button terminal-button-close"></span>
                        <span class="terminal-button terminal-button-minimize"></span>
                        <span class="terminal-button terminal-button-maximize"></span>
                    </div>
                    <div class="terminal-title">Elitech Hub Terminal</div>
                </div>
                <div class="terminal-body">
                    <div class="terminal-output" id="${this.element.id}-output"></div>
                    ${this.options.allowInput ? `
                        <div class="terminal-input-line">
                            <span class="terminal-prompt">${this.options.prompt}</span>
                            <input type="text" class="terminal-input" id="${this.element.id}-input" autocomplete="off" spellcheck="false">
                            <span class="terminal-cursor"></span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        this.output = document.getElementById(`${this.element.id}-output`);
        if (this.options.allowInput) {
            this.input = document.getElementById(`${this.element.id}-input`);
        }
    }

    applyTheme() {
        const themes = {
            dark: {
                background: '#0F172A',
                text: '#E2E8F0',
                prompt: '#10B981',
                accent: '#C41E3A',
                border: '#1E293B'
            },
            light: {
                background: '#FFFFFF',
                text: '#1F2937',
                prompt: '#059669',
                accent: '#DC2626',
                border: '#E5E7EB'
            },
            matrix: {
                background: '#000000',
                text: '#00FF00',
                prompt: '#00FF00',
                accent: '#00FF00',
                border: '#003300'
            }
        };

        const theme = themes[this.options.theme] || themes.dark;
        const container = this.element.querySelector('.terminal-container');
        
        Object.entries(theme).forEach(([key, value]) => {
            container.style.setProperty(`--terminal-${key}`, value);
        });
    }

    getDefaultWelcome() {
        return `
╔═══════════════════════════════════════════════════════════╗
║           Welcome to Elitech Hub Terminal v1.0            ║
║         Cybersecurity Training & Education Platform        ║
╚═══════════════════════════════════════════════════════════╝

System Information:
- Company: Elitech Hub Limited (RC: 8693883)
- Location: Lagos, Nigeria
- Specialization: Cybersecurity Education & Training
- Status: ONLINE ✓

Type 'help' for available commands.
Type 'about' to learn more about our programs.
        `.trim();
    }

    getDefaultCommands() {
        return {
            help: {
                description: 'Display available commands',
                execute: () => this.showHelp()
            },
            clear: {
                description: 'Clear the terminal screen',
                execute: () => this.clear()
            },
            about: {
                description: 'Information about Elitech Hub',
                execute: () => this.showAbout()
            },
            programs: {
                description: 'List available training programs',
                execute: () => this.showPrograms()
            },
            contact: {
                description: 'Display contact information',
                execute: () => this.showContact()
            },
            whoami: {
                description: 'Display current user information',
                execute: () => 'Guest User - Visitor'
            },
            date: {
                description: 'Display current date and time',
                execute: () => new Date().toLocaleString()
            },
            echo: {
                description: 'Echo the input text',
                execute: (args) => args.join(' ')
            },
            ls: {
                description: 'List available sections',
                execute: () => `
total 6
drwxr-xr-x  2 elitech elitech 4096 Nov 17  2025 programs/
drwxr-xr-x  2 elitech elitech 4096 Nov 17  2025 services/
drwxr-xr-x  2 elitech elitech 4096 Nov 17  2025 about/
drwxr-xr-x  2 elitech elitech 4096 Nov 17  2025 blog/
-rw-r--r--  1 elitech elitech 1024 Nov 17  2025 README.md
-rw-r--r--  1 elitech elitech 2048 Nov 17  2025 contact.txt
                `.trim()
            },
            scan: {
                description: 'Run a security scan simulation',
                execute: () => this.runSecurityScan()
            },
            skills: {
                description: 'List cybersecurity skills taught',
                execute: () => this.showSkills()
            }
        };
    }

    setupInputHandlers() {
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', () => this.updateCursor());
        this.input.focus();

        // Refocus input when clicking on terminal
        this.element.addEventListener('click', () => this.input.focus());
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.processCommand(this.input.value.trim());
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory('down');
                break;
            case 'Tab':
                e.preventDefault();
                this.autocomplete();
                break;
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.interrupt();
                }
                break;
        }
    }

    processCommand(command) {
        if (!command) {
            this.newPrompt();
            return;
        }

        // Add to history
        this.addToHistory(command);

        // Display command
        this.writeOutput(`<span class="terminal-prompt">${this.options.prompt}</span> ${this.escapeHtml(command)}`);

        // Parse and execute
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.options.commands[cmd]) {
            const result = this.options.commands[cmd].execute(args);
            if (result instanceof Promise) {
                result.then(output => {
                    if (output) this.writeOutput(output);
                    this.newPrompt();
                });
            } else {
                if (result) this.writeOutput(result);
                this.newPrompt();
            }
        } else {
            this.writeOutput(`<span class="terminal-error">Command not found: ${this.escapeHtml(cmd)}</span>`);
            this.writeOutput(`Type 'help' for available commands.`);
            this.newPrompt();
        }

        this.input.value = '';
        this.historyIndex = -1;
    }

    writeOutput(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    }

    async typeOutput(text, speed = this.options.typeSpeed) {
        return new Promise((resolve) => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            this.output.appendChild(line);

            let i = 0;
            const typeChar = () => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                    this.scrollToBottom();
                    setTimeout(typeChar, speed);
                } else {
                    resolve();
                }
            };
            typeChar();
        });
    }

    newPrompt() {
        this.input.value = '';
        this.input.focus();
    }

    displayWelcomeMessage() {
        this.writeOutput(`<pre class="terminal-welcome">${this.options.welcomeMessage}</pre>`);
        if (this.options.allowInput) {
            this.newPrompt();
        }
    }

    clear() {
        this.output.innerHTML = '';
    }

    addToHistory(command) {
        this.history.unshift(command);
        if (this.history.length > this.options.maxHistory) {
            this.history.pop();
        }
    }

    navigateHistory(direction) {
        if (direction === 'up') {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (direction === 'down') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = -1;
                this.input.value = '';
            }
        }
    }

    autocomplete() {
        const partial = this.input.value.toLowerCase();
        const matches = Object.keys(this.options.commands).filter(cmd => 
            cmd.startsWith(partial)
        );

        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.writeOutput(`<span class="terminal-info">Possible commands:</span>`);
            this.writeOutput(matches.join('  '));
            this.newPrompt();
        }
    }

    interrupt() {
        this.writeOutput('^C');
        this.newPrompt();
    }

    updateCursor() {
        // Cursor position tracking (for visual feedback)
    }

    scrollToBottom() {
        this.output.parentElement.scrollTop = this.output.parentElement.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Built-in Command Implementations
    showHelp() {
        let output = '<div class="terminal-help">';
        output += '<strong>Available Commands:</strong><br><br>';
        
        Object.entries(this.options.commands).forEach(([cmd, info]) => {
            output += `<span class="terminal-command">${cmd.padEnd(15)}</span> - ${info.description}<br>`;
        });
        
        output += '</div>';
        return output;
    }

    showAbout() {
        return `
<strong>Elitech Hub Limited</strong>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span class="terminal-info">Official Information:</span>
• Company: Elitech Hub Limited
• Registration: RC 8693883 (CAC Registered)
• SMEDAN ID: SME/TR/2025/8693883
• Location: Lagos, Nigeria
• Founded: August 2025

<span class="terminal-info">Mission:</span>
Transforming Africa's cybersecurity landscape through 
comprehensive education and hands-on training programs.

<span class="terminal-info">Achievements:</span>
• 100+ Students Trained
• 95% Job Placement Rate
• Industry-Recognized Certifications
• Corporate Partnership Network

Type 'programs' to see our training offerings.
        `.trim();
    }

    showPrograms() {
        return `
<strong>Training Programs</strong>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span class="terminal-success">1. 6-Week Intensive Bootcamp</span>
   Duration: 6 weeks
   Format: Online/Hybrid
   Focus: Foundations of Cybersecurity
   Investment: ₦50,000

<span class="terminal-success">2. 16-Week Professional Program</span>
   Duration: 16 weeks
   Format: Online/Hybrid
   Focus: Advanced Cybersecurity + Internship
   Investment: ₦75,000
   Includes: Guaranteed internship placement

<span class="terminal-info">Key Features:</span>
✓ Hands-on Labs & Real Projects
✓ Industry Expert Instructors
✓ Certification Preparation
✓ Career Support & Mentorship
✓ Lifetime Access to Materials

Visit: https://elitechhub.com/programs
Contact: +234-708-196-8062
        `.trim();
    }

    showContact() {
        return `
<strong>Contact Information</strong>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span class="terminal-info">Phone:</span>
+234-708-196-8062

<span class="terminal-info">Email:</span>
info@elitechhub.com

<span class="terminal-info">Social Media:</span>
LinkedIn: /company/elitech-hub
Twitter: @elitechhub
Medium: @elijahadeyeye

<span class="terminal-info">Office:</span>
Lagos, Nigeria

<span class="terminal-info">Business Hours:</span>
Monday - Friday: 9:00 AM - 6:00 PM WAT
Saturday: 10:00 AM - 3:00 PM WAT
        `.trim();
    }

    showSkills() {
        return `
<strong>Cybersecurity Skills Covered</strong>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span class="terminal-category">Core Security Skills:</span>
• Network Security & Architecture
• Ethical Hacking & Penetration Testing
• Security Operations (SOC)
• Incident Response & Forensics
• Risk Assessment & Management

<span class="terminal-category">Technical Tools:</span>
• Kali Linux, Metasploit, Burp Suite
• Wireshark, Nmap, Nessus
• SIEM Tools (Splunk, ELK Stack)
• Python for Security Automation
• Cloud Security (AWS, Azure)

<span class="terminal-category">Certifications Prep:</span>
• CompTIA Security+
• CEH (Certified Ethical Hacker)
• CISSP Foundation
• Network+ & Linux+

<span class="terminal-category">Soft Skills:</span>
• Security Awareness Training
• Report Writing & Documentation
• Communication & Teamwork
• Problem-Solving & Critical Thinking
        `.trim();
    }

    async runSecurityScan() {
        const steps = [
            { msg: 'Initializing security scanner...', delay: 500 },
            { msg: '[✓] Network interface detected', delay: 300, class: 'terminal-success' },
            { msg: '[✓] Loading vulnerability database', delay: 400, class: 'terminal-success' },
            { msg: '[~] Scanning open ports...', delay: 600, class: 'terminal-info' },
            { msg: '    Port 22: SSH (Open)', delay: 200 },
            { msg: '    Port 80: HTTP (Open)', delay: 200 },
            { msg: '    Port 443: HTTPS (Open)', delay: 200 },
            { msg: '[✓] Port scan complete', delay: 400, class: 'terminal-success' },
            { msg: '[~] Analyzing security posture...', delay: 800, class: 'terminal-info' },
            { msg: '[!] 0 critical vulnerabilities found', delay: 400, class: 'terminal-success' },
            { msg: '[✓] System security status: PROTECTED', delay: 300, class: 'terminal-success' },
            { msg: '\nScan completed successfully!', delay: 200, class: 'terminal-success' }
        ];

        for (const step of steps) {
            await this.delay(step.delay);
            this.writeOutput(step.msg, step.class || '');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API Methods
    execute(command) {
        this.processCommand(command);
    }

    write(text, className = '') {
        this.writeOutput(text, className);
    }

    async type(text, speed) {
        return this.typeOutput(text, speed);
    }

    addCommand(name, description, callback) {
        this.options.commands[name] = {
            description,
            execute: callback
        };
    }

    removeCommand(name) {
        delete this.options.commands[name];
    }

    setTheme(theme) {
        this.options.theme = theme;
        this.applyTheme();
    }

    reset() {
        this.clear();
        this.displayWelcomeMessage();
    }

    destroy() {
        if (this.input) {
            this.input.removeEventListener('keydown', this.handleKeyDown);
            this.input.removeEventListener('input', this.updateCursor);
        }
        this.element.innerHTML = '';
    }
}

// Auto-initialize terminals with data-terminal attribute
document.addEventListener('DOMContentLoaded', function() {
    const terminals = document.querySelectorAll('[data-terminal]');
    
    terminals.forEach(element => {
        const options = {
            theme: element.dataset.terminalTheme || 'dark',
            allowInput: element.dataset.terminalInput !== 'false',
            prompt: element.dataset.terminalPrompt || 'user@elitech-hub:~$'
        };
        
        new Terminal(element.id, options);
    });
});

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Terminal;
}