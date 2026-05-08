const fs = require('fs');

const file = 'about.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Portfolio Button
const whatsappLine = '                                style="flex: 1; justify-content: center;"><i class="fab fa-whatsapp"></i> WhatsApp</a>';
const newPortfolioBtn = `                                style="flex: 1; justify-content: center;"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                            <a href="https://elijahadeyeye.vercel.app/" target="_blank" class="btn btn-outline"
                                style="flex: 1; justify-content: center; border-color: #DC2626; color: #DC2626;"
                                onmouseover="this.style.background='#DC2626'; this.style.color='white'"
                                onmouseout="this.style.background='transparent'; this.style.color='#DC2626'"><i class="fas fa-globe"></i> Portfolio</a>`;
                                
if (content.includes(whatsappLine)) {
    content = content.replace(whatsappLine, newPortfolioBtn);
    console.log('Added Portfolio button.');
} else {
    console.log('WhatsApp line not found.');
}

// 2. Yemi Adeyeye Web Icon
const linkedinLine = '                            <i class="fab fa-linkedin-in"></i>\n                        </a>\n                    </div>';
const linkedinLine2 = '                            <i class="fab fa-linkedin-in"></i>\r\n                        </a>\r\n                    </div>';

const newWebIcon = `                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://yemiadeyeye.com/" target="_blank"
                            style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; transition: all 0.2s;"
                            onmouseover="this.style.background='#10b981'; this.style.color='white'"
                            onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'">
                            <i class="fas fa-globe"></i>
                        </a>
                    </div>`;

const newWebIcon2 = `                            <i class="fab fa-linkedin-in"></i>\r\n                        </a>\r\n                        <a href="https://yemiadeyeye.com/" target="_blank"\r\n                            style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; text-decoration: none; transition: all 0.2s;"\r\n                            onmouseover="this.style.background='#10b981'; this.style.color='white'"\r\n                            onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'">\r\n                            <i class="fas fa-globe"></i>\r\n                        </a>\r\n                    </div>`;


if (content.includes(linkedinLine)) {
    // Only replace the last occurrence (which is Yemi's)
    let parts = content.split(linkedinLine);
    let lastPart = parts.pop();
    content = parts.join(linkedinLine) + newWebIcon + lastPart;
    console.log('Added Yemi web icon (LF).');
} else if (content.includes(linkedinLine2)) {
    let parts = content.split(linkedinLine2);
    let lastPart = parts.pop();
    content = parts.join(linkedinLine2) + newWebIcon2 + lastPart;
    console.log('Added Yemi web icon (CRLF).');
} else {
    console.log('LinkedIn line not found.');
}

fs.writeFileSync(file, content, 'utf8');
