/**
 * Elitech Hub Chatbot Widget
 * Floating chat widget with AI-powered responses
 */

(function () {
    'use strict';

    // Configuration
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // Split Deployment: Frontend (Netlify) -> Backend (Vercel)
    // We assume the backend is at https://elitech-hub.vercel.app based on repo name.
    // IF THIS IS WRONG: Update this URL to your actual Vercel backend URL.
    const API_URL = isLocal
        ? 'http://localhost:3001/api/chatbot/chat'
        : 'https://elitech-hub.vercel.app/api/chatbot/chat';

    // Chat history for context
    let chatHistory = [];
    let isOpen = false;

    // Create and inject the chatbot widget
    function initChatbot() {
        // Create container
        const container = document.createElement('div');
        container.id = 'elitech-chatbot';
        container.innerHTML = `
            <!-- Chat Button -->
            <button class="chatbot-button" id="chatbotToggle" aria-label="Open chat">
                <i class="fas fa-comments chat-icon"></i>
                <i class="fas fa-times close-icon"></i>
                <span class="chatbot-badge">1</span>
            </button>
            
            <!-- Chat Window -->
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="chatbot-info">
                        <div class="chatbot-name">Eli - Your Assistant</div>
                        <div class="chatbot-status">Online • Usually replies instantly</div>
                    </div>
                </div>
                
                <div class="chatbot-messages" id="chatMessages">
                    <!-- Welcome message -->
                    <div class="chat-message bot">
                        <div class="message-avatar"><i class="fas fa-shield-alt"></i></div>
                        <div class="message-bubble">
                            Hello! 👋 I'm Eli, your Elitech Hub assistant.<br><br>
                            I can help you learn about our cybersecurity training programs. What would you like to know?
                        </div>
                    </div>
                </div>
                
                <div class="quick-actions" id="quickActions">
                    <button class="quick-action" data-message="What are the program prices?">💰 Pricing</button>
                    <button class="quick-action" data-message="Tell me about the 16-week program">📚 16-Week Program</button>
                    <button class="quick-action" data-message="How does the internship work?">💼 Internship</button>
                    <button class="quick-action" data-message="Do I need experience?">🎓 For Beginners</button>
                </div>
                
                <div class="chatbot-input">
                    <input type="text" id="chatInput" placeholder="Type your question..." autocomplete="off">
                    <button id="chatSend" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Bind events
        bindEvents();

        // Remove badge after first open
        setTimeout(() => {
            const badge = document.querySelector('.chatbot-badge');
            if (badge && !isOpen) {
                badge.style.display = 'flex';
            }
        }, 3000);
    }

    function bindEvents() {
        const toggleBtn = document.getElementById('chatbotToggle');
        const chatWindow = document.getElementById('chatbotWindow');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSend');
        const quickActions = document.querySelectorAll('.quick-action');

        // Toggle chat window
        toggleBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            toggleBtn.classList.toggle('active');
            chatWindow.classList.toggle('active');

            // Remove badge
            const badge = document.querySelector('.chatbot-badge');
            if (badge) badge.style.display = 'none';

            // Focus input when opened
            if (isOpen) {
                setTimeout(() => input.focus(), 300);
            }
        });

        // Send message on enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                sendMessage(input.value.trim());
            }
        });

        // Send button click
        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                sendMessage(input.value.trim());
            }
        });

        // Quick actions
        quickActions.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                sendMessage(message);
                // Hide quick actions after use
                document.getElementById('quickActions').style.display = 'none';
            });
        });
    }

    async function sendMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSend');

        // Clear input
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        // Add user message
        addMessage(message, 'user');

        // Add to history
        chatHistory.push({ role: 'user', content: message });

        // Show typing indicator
        const typingId = showTyping();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    history: chatHistory.slice(-10) // Last 10 messages for context
                })
            });

            const data = await response.json();

            // Remove typing indicator
            removeTyping(typingId);

            // Add bot response
            const botResponse = data.response || "I'm sorry, I couldn't process that. Please try again or contact us on WhatsApp: +234 708 196 8062";
            addMessage(botResponse, 'bot');

            // Add to history
            chatHistory.push({ role: 'assistant', content: botResponse });

        } catch (error) {
            console.error('Chat error:', error);
            removeTyping(typingId);
            addMessage("I'm having trouble connecting right now. Please try again or reach out on WhatsApp: +234 708 196 8062", 'bot');
        }

        // Re-enable input
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }

    function addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');

        // Format text (convert markdown-style formatting)
        const formattedText = formatMessage(text);

        const messageHtml = `
            <div class="chat-message ${sender}">
                <div class="message-avatar">
                    ${sender === 'bot' ? '<i class="fas fa-shield-alt"></i>' : '<i class="fas fa-user"></i>'}
                </div>
                <div class="message-bubble">${formattedText}</div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function formatMessage(text) {
        // Convert markdown-style formatting to HTML
        return text
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Line breaks
            .replace(/\n/g, '<br>')
            // Bullet points
            .replace(/• /g, '<br>• ')
            // Clean up multiple breaks
            .replace(/<br><br><br>/g, '<br><br>');
    }

    function showTyping() {
        const messagesContainer = document.getElementById('chatMessages');
        const id = 'typing-' + Date.now();

        const typingHtml = `
            <div class="chat-message bot" id="${id}">
                <div class="message-avatar"><i class="fas fa-shield-alt"></i></div>
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHtml);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return id;
    }

    function removeTyping(id) {
        const typingElement = document.getElementById(id);
        if (typingElement) {
            typingElement.remove();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
