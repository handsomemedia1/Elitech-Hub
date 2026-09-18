"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePricing } from '@/context/PricingContext';
import styles from "./Chatbot.module.css";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = usePricing();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      content: "Hello! 👋 I'm Elitech's AI assistant. How can I help you jumpstart your cybersecurity career today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          bootcampPrice: formatPrice('bootcamp'),
          professionalPrice: formatPrice('professional'),
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      // The API returns a streaming response (Vercel AI SDK format)
      // We read it as a text stream and extract the text parts
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';
      const botMsgId = `msg-${Date.now()}-bot`;

      // Add empty bot message we'll update in real-time
      setMessages(prev => [...prev, { id: botMsgId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Vercel AI SDK streams data in lines: "0:\"text chunk\"\n" or plain text
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Extract text from format: 0:"some text"
            try {
              const jsonStr = line.slice(2);
              const parsed = JSON.parse(jsonStr);
              if (typeof parsed === 'string') fullText += parsed;
            } catch {
              // If not valid JSON, just use raw
              fullText += line.slice(2);
            }
          } else if (line.startsWith('text:')) {
            fullText += line.slice(5);
          } else if (!line.startsWith('d:') && !line.startsWith('e:') && !line.startsWith('f:') && line.trim()) {
            // Plain text fallback
            try {
              const parsed = JSON.parse(line);
              if (typeof parsed === 'string') fullText += parsed;
            } catch { /* skip meta lines */ }
          }
        }

        // Update bot message in real-time as text arrives
        const displayText = fullText || '...';
        setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: displayText } : m));
      }

      // Final message — if still empty, show error
      if (!fullText) fullText = "I received an empty response. Please try again!";
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));

    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: "Sorry, something went wrong connecting to the AI. Please try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className={styles.fab}
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.i
              key="close"
              className="fas fa-times"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            />
          ) : (
            <motion.i
              key="chat"
              className="fas fa-comment-dots"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>
                  <i className="fas fa-robot" />
                  <div className={styles.onlineDot} />
                </div>
                <div>
                  <h3 className={styles.botName}>Elitech AI</h3>
                  <span className={styles.status}>Typically replies instantly</span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={handleToggle}>
                <i className="fas fa-minus" />
              </button>
            </div>

            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${msg.role === "user" ? styles.msgUser : styles.msgBot}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.role !== "user" && (
                    <div className={styles.msgAvatar}>
                      <i className="fas fa-robot" />
                    </div>
                  )}
                  <div className={styles.messageContent}>
                    <div className={styles.messageBubble}>{msg.content}</div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  className={`${styles.messageWrapper} ${styles.msgBot}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.msgAvatar}>
                    <i className="fas fa-robot" />
                  </div>
                  <div className={styles.messageContent}>
                    <div className={`${styles.messageBubble} ${styles.typingBubble}`}>
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className={styles.inputArea}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className={styles.input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
                  <i className="fas fa-paper-plane" />
                </button>
              </div>
              <div className={styles.footerBranding}>
                ⚡ Powered by Elitech AI (Groq)
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
