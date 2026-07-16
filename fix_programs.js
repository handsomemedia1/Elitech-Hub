const fs = require('fs');

function fixProgramsHtml() {
    let content = fs.readFileSync('programs.html', 'utf8');

    // 1. Weeks 5-8
    // Find: background: linear-gradient(135deg, #06B6D4, #0891B2); padding: 2rem;
    // Replace with: background: #0f172a; padding: 2rem; border: 2px solid #06B6D4;
    content = content.replace(
        'background: linear-gradient(135deg, #06B6D4, #0891B2); padding: 2rem;',
        'background: #0f172a; padding: 2rem; border: 2px solid #06B6D4; border-radius: 1rem;'
    );

    // Find: <div style="color: #64748b; font-size: 0.875rem;">Penetration testing, web app hacking</div>
    // Replace with: <div style="color: #38bdf8; font-size: 0.875rem; font-weight: bold;">Penetration testing, web app hacking</div>
    content = content.replace(
        '<div style="color: #64748b; font-size: 0.875rem;">Penetration testing, web app hacking</div>',
        '<div style="color: #38bdf8; font-size: 0.875rem; font-weight: bold;">Penetration testing, web app hacking</div>'
    );

    // 2. Industry Certifications Preparation
    // Find: style="background: #F0FDF4; border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem;"
    // Replace with: class="neon-box" style="border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem;"
    content = content.replace(
        'style="background: #F0FDF4; border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem;"',
        'class="neon-box" style="border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem;"'
    );

    // 3. Tools Badges
    // We just replace the outer background of each badge block. 
    // They look like: style="background: rgba(X, Y, Z, 0.2); border-radius: 0.75rem; padding: 1rem; display: flex; align-items: center; gap: 0.75rem;"
    
    // Kali Linux (Red)
    content = content.replace(
        /style="background:\s*rgba\(220,\s*38,\s*38,\s*0\.2\);(.*?)"/g,
        'style="background: #0f172a; border: 1px solid #ff3333;$1"'
    );
    // Replace text color inside it
    content = content.replace(
        /<span style="font-weight: 600; color: #b91c1c;">Kali Linux &amp; Command Line<\/span>/g,
        '<span style="font-weight: 600; color: #ff3333;">Kali Linux &amp; Command Line</span>'
    );

    // Nmap & Wireshark (Cyan)
    content = content.replace(
        /style="background:\s*rgba\(6,\s*182,\s*212,\s*0\.2\);(.*?)"/g,
        'style="background: #0f172a; border: 1px solid #06B6D4;$1"'
    );
    content = content.replace(
        /<span style="font-weight: 600; color: #0891b2;">Nmap &amp; Wireshark<\/span>/g,
        '<span style="font-weight: 600; color: #06B6D4;">Nmap &amp; Wireshark</span>'
    );

    // Metasploit Framework (Green)
    content = content.replace(
        /style="background:\s*rgba\(16,\s*185,\s*129,\s*0\.2\);(.*?)"/g,
        'style="background: #0f172a; border: 1px solid #39ff14;$1"'
    );
    content = content.replace(
        /<span style="font-weight: 600; color: #047857;">Metasploit Framework<\/span>/g,
        '<span class="neon-text" style="font-weight: 600;">Metasploit Framework</span>'
    );

    // Burp Suite & OWASP ZAP (Blue)
    content = content.replace(
        /style="background:\s*rgba\(59,\s*130,\s*246,\s*0\.2\);(.*?)"/g,
        'style="background: #0f172a; border: 1px solid #60A5FA;$1"'
    );
    content = content.replace(
        /<span style="font-weight: 600; color: #1d4ed8;">Burp Suite &amp; OWASP ZAP<\/span>/g,
        '<span style="font-weight: 600; color: #60A5FA;">Burp Suite &amp; OWASP ZAP</span>'
    );

    // Nessus & OpenVAS (Teal)
    content = content.replace(
        /style="background:\s*rgba\(20,\s*184,\s*166,\s*0\.2\);(.*?)"/g,
        'style="background: #0f172a; border: 1px solid #2DD4BF;$1"'
    );
    content = content.replace(
        /<span style="font-weight: 600; color: #0f766e;">Nessus &amp; OpenVAS<\/span>/g,
        '<span style="font-weight: 600; color: #2DD4BF;">Nessus &amp; OpenVAS</span>'
    );

    // Splunk & Log Analysis (Pink/Purple)
    content = content.replace(
        /style="background:\s*rgba\(236,\s*72,\s*153,\s*0\.2\);(.*?)"/g,
        'style="background: #0f172a; border: 1px solid #F472B6;$1"'
    );
    content = content.replace(
        /<span style="font-weight: 600; color: #be185d;">Splunk &amp; Log Analysis<\/span>/g,
        '<span style="font-weight: 600; color: #F472B6;">Splunk &amp; Log Analysis</span>'
    );

    fs.writeFileSync('programs.html', content, 'utf8');
}

fixProgramsHtml();
