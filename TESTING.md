# Testing the Multi-AI Chatbot & Pricing System

## ✅ Quick Start (2 Steps)

### 1. Start Live Server (VS Code)
1. Open `index.html` in VS Code
2. Right-click → **"Open with Live Server"**
3. Opens at: `http://localhost:5500` or `http://127.0.0.1:5500`

### 2. Backend is Already Running
✅ Backend API: `http://localhost:3001`
- Chatbot: `/api/chatbot/chat`
- Pricing: `/api/services/prices`

---

## 🧪 Testing the Chatbot

### Test Questions to Ask:

1. **Basic:** "Hello" or "Hi"
2. **Pricing:** "How much is the 16-week program?"
3. **Comparison:** "Why should I choose Elitech Hub over other academies?"
4. **Details:** "Tell me about the guaranteed internship"
5. **Beginner:** "Do I need experience to enroll?"
6. **Payment:** "Can I pay in installments?"

### What to Expect:
- **Intelligent responses** using AI Router (Groq → Gemini → SambaNova → Cloudflare → OpenRouter)
- **Detailed answers** about programs, pricing, competitive advantages
- **Fallback responses** if all AI providers fail

---

## 🎨 Testing Service Pricing (Optional)

### Setup Database (One-Time):
```bash
cd backend
node setup-pricing-db.js
```

### Test API:
Open browser: `http://localhost:3001/api/services/prices`

Should return:
```json
{
  "success": true,
  "prices": [
    {
      "service_name": "Corporate Training",
      "price_ngn": 500000,
      "price_usd": 500,
      "unit": "per day"
    },
    ...
  ]
}
```

---

## 🐛 Troubleshooting

### Chatbot not responding?
1. **Check backend:** Backend terminal should show "🚀 Elitech Hub API running on http://localhost:3001"
2. **Check browser console:** F12 → Console tab for errors
3. **Check API URL:** In `js/chatbot.js`, should point to `http://localhost:3001/api/chatbot/chat`

### Live Server not on port 5500?
- Check bottom-right of VS Code for port number
- Update `js/chatbot.js` API_URL if needed

---

## 📊 AI Provider Priority

The chatbot tries providers in this order:

1. **Groq** (fastest - Llama 3.1 70B) ← Default
2. **Gemini 2.0** (reliable, context-aware)
3. **SambaNova** (enterprise-grade)
4. **Cloudflare** (edge-optimized)
5. **OpenRouter** (multi-model fallback)
6. **Static FAQs** (if all fail)

---

## ✨ Features Implemented

### Chatbot Intelligence
✅ Comprehensive knowledge base (programs, pricing, FAQs)
✅ Competitive advantages ("Why choose Elitech Hub?")
✅ 5 AI provider failover chain
✅ Conversation context management
✅ Fallback to static responses

### Service Pricing
✅ Supabase database schema
✅ Admin API (update prices)
✅ Public API (fetch prices)
✅ Multi-currency support (NGN/USD/EUR/GBP)

---

**Ready to test!** Open Live Server and click the chat widget in the bottom-right corner. 🚀
