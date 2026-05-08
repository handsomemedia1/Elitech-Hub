const fs = require('fs');

const file = 'about.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Portfolio button to Elijah Adeyeye
const elijahButtonsStr = `<div style="display: flex; gap: 1rem;">
                            <a href="mailto:Elijahadeyeye@proton.me" class="btn btn-primary"
                                style="flex: 1; justify-content: center;"><i class="fas fa-envelope"></i> Email</a>
                            <a href="https://wa.me/2347081968062" class="btn btn-outline"
                                style="flex: 1; justify-content: center;"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                        </div>`;

const elijahButtonsNew = `<div style="display: flex; gap: 1rem;">
                            <a href="mailto:Elijahadeyeye@proton.me" class="btn btn-primary"
                                style="flex: 1; justify-content: center;"><i class="fas fa-envelope"></i> Email</a>
                            <a href="https://wa.me/2347081968062" class="btn btn-outline"
                                style="flex: 1; justify-content: center;"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                            <a href="https://elijahadeyeye.vercel.app/" target="_blank" class="btn btn-outline"
                                style="flex: 1; justify-content: center; border-color: #DC2626; color: #DC2626;"
                                onmouseover="this.style.background='#DC2626'; this.style.color='white'"
                                onmouseout="this.style.background='transparent'; this.style.color='#DC2626'"><i class="fas fa-globe"></i> Portfolio</a>
                        </div>`;

// Replace dealing with possible \r differences
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\r\\n|\\n|\\r/g, '\\s*');
};

const elijahRegex = new RegExp(escapeRegExp(elijahButtonsStr), 'g');
content = content.replace(elijahRegex, elijahButtonsNew);

// 2. Add Website link for Yemi Adeyeye
const yemiButtonsStr = `<div style="display: flex; gap: 0.75rem;">
                        <a href="mailto:yemi.adeyeye@example.com"
                            style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; transition: all 0.2s;"
                            onmouseover="this.style.background='#10b981'; this.style.color='white'"
                            onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'">
                            <i class="fas fa-envelope"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/yemi-adeyeye" target="_blank"
                            style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; transition: all 0.2s;"
                            onmouseover="this.style.background='#0077b5'; this.style.color='white'"
                            onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </div>`;

const yemiButtonsNew = `<div style="display: flex; gap: 0.75rem;">
                        <a href="mailto:yemi.adeyeye@example.com"
                            style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; transition: all 0.2s;"
                            onmouseover="this.style.background='#10b981'; this.style.color='white'"
                            onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'">
                            <i class="fas fa-envelope"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/yemi-adeyeye" target="_blank"
                            style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; transition: all 0.2s;"
                            onmouseover="this.style.background='#0077b5'; this.style.color='white'"
                            onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://yemiadeyeye.com/" target="_blank"
                            style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; transition: all 0.2s;"
                            onmouseover="this.style.background='#10b981'; this.style.color='white'"
                            onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'">
                            <i class="fas fa-globe"></i>
                        </a>
                    </div>`;

const yemiRegex = new RegExp(escapeRegExp(yemiButtonsStr), 'g');
content = content.replace(yemiRegex, yemiButtonsNew);

fs.writeFileSync(file, content, 'utf8');
console.log('Update complete.');
