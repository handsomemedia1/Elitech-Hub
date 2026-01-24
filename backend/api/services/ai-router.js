/**
 * AI Router - Intelligent Multi-Provider Routing
 * Routes chatbot requests across 5 AI providers with failover
 */

export class AIRouter {
    constructor() {
        this.providers = {
            groq: {
                name: 'Groq',
                priority: 1,
                enabled: true,
                failures: 0,
                avgLatency: 0,
                totalRequests: 0,
                model: 'llama-3.1-70b-versatile',
                endpoint: 'https://api.groq.com/openai/v1/chat/completions'
            },
            gemini: {
                name: 'Gemini 2.0',
                priority: 2,
                enabled: true,
                failures: 0,
                avgLatency: 0,
                totalRequests: 0,
                model: 'gemini-2.0-flash-exp',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'
            },
            sambanova: {
                name: 'SambaNova',
                priority: 3,
                enabled: true,
                failures: 0,
                avgLatency: 0,
                totalRequests: 0,
                model: 'Meta-Llama-3.1-70B-Instruct',
                endpoint: 'https://api.sambanova.ai/v1/chat/completions'
            },
            cloudflare: {
                name: 'Cloudflare',
                priority: 4,
                enabled: true,
                failures: 0,
                avgLatency: 0,
                totalRequests: 0,
                model: '@cf/meta/llama-3.1-8b-instruct',
                endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`
            },
            openrouter: {
                name: 'OpenRouter',
                priority: 5,
                enabled: true,
                failures: 0,
                avgLatency: 0,
                totalRequests: 0,
                model: 'meta-llama/llama-3.1-70b-instruct:free',
                endpoint: 'https://openrouter.ai/api/v1/chat/completions'
            }
        };

        this.lastUsedProvider = null;
        this.failureThreshold = 3; // Auto-disable if 3 failures in 5 min
        this.failureWindow = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Generate response using best available provider
     */
    async generate(message, options = {}) {
        const { history = [], context = '' } = options;

        // Get providers sorted by priority
        const availableProviders = this.getAvailableProviders();

        if (availableProviders.length === 0) {
            throw new Error('All AI providers are currently unavailable');
        }

        // Try each provider in order
        for (const providerName of availableProviders) {
            try {
                const startTime = Date.now();
                const response = await this.callProvider(providerName, message, context, history);
                const latency = Date.now() - startTime;

                // Update metrics
                this.updateMetrics(providerName, latency, true);
                this.lastUsedProvider = providerName;

                return {
                    response,
                    provider: providerName,
                    latency
                };

            } catch (error) {
                console.error(`[${providerName}] Error:`, error.message);
                this.updateMetrics(providerName, 0, false);
                // Continue to next provider
            }
        }

        // All providers failed
        throw new Error('All providers failed to generate response');
    }

    /**
     * Call specific provider
     */
    async callProvider(providerName, message, context, history) {
        const provider = this.providers[providerName];

        switch (providerName) {
            case 'groq':
                return await this.callGroq(message, context, history);
            case 'gemini':
                return await this.callGemini(message, context, history);
            case 'sambanova':
                return await this.callSambaNova(message, context, history);
            case 'cloudflare':
                return await this.callCloudflare(message, context, history);
            case 'openrouter':
                return await this.callOpenRouter(message, context, history);
            default:
                throw new Error(`Unknown provider: ${providerName}`);
        }
    }

    /**
     * Groq API (OpenAI-compatible)
     */
    async callGroq(message, context, history) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new Error('GROQ_API_KEY not configured');

        const messages = [
            { role: 'system', content: context },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq API error: ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response generated';
    }

    /**
     * Gemini 2.0 API
     */
    async callGemini(message, context, history) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

        const conversationHistory = [
            { role: 'user', parts: [{ text: context }] },
            { role: 'model', parts: [{ text: 'I understand. I will provide accurate, helpful responses based on this context.' }] },
            ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
            { role: 'user', parts: [{ text: message }] }
        ];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: conversationHistory,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Gemini API error: ${error}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    }

    /**
     * SambaNova API (OpenAI-compatible)
     */
    async callSambaNova(message, context, history) {
        const apiKey = process.env.SAMBANOVA_API_KEY;
        if (!apiKey) throw new Error('SAMBANOVA_API_KEY not configured');

        const messages = [
            { role: 'system', content: context },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'Meta-Llama-3.1-70B-Instruct',
                messages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`SambaNova API error: ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response generated';
    }

    /**
     * Cloudflare Workers AI
     */
    async callCloudflare(message, context, history) {
        const apiKey = process.env.CLOUDFLARE_API_KEY;
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        if (!apiKey || !accountId) throw new Error('Cloudflare credentials not configured');

        const messages = [
            { role: 'system', content: context },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: message }
        ];

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Cloudflare API error: ${error}`);
        }

        const data = await response.json();
        return data.result?.response || 'No response generated';
    }

    /**
     * OpenRouter API (Multi-model fallback)
     */
    async callOpenRouter(message, context, history) {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

        const messages = [
            { role: 'system', content: context },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://elitechhub.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-70b-instruct:free',
                messages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter API error: ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response generated';
    }

    /**
     * Get available providers sorted by priority
     */
    getAvailableProviders() {
        return Object.entries(this.providers)
            .filter(([name, provider]) => provider.enabled)
            .sort((a, b) => a[1].priority - b[1].priority)
            .map(([name]) => name);
    }

    /**
     * Update provider metrics
     */
    updateMetrics(providerName, latency, success) {
        const provider = this.providers[providerName];
        provider.totalRequests++;

        if (success) {
            // Update average latency
            provider.avgLatency = ((provider.avgLatency * (provider.totalRequests - 1)) + latency) / provider.totalRequests;
            // Reset failures on success
            provider.failures = 0;
        } else {
            provider.failures++;

            // Auto-disable if too many failures
            if (provider.failures >= this.failureThreshold) {
                console.warn(`[${providerName}] Auto-disabled due to ${provider.failures} failures`);
                provider.enabled = false;

                // Re-enable after 5 minutes
                setTimeout(() => {
                    provider.enabled = true;
                    provider.failures = 0;
                    console.log(`[${providerName}] Re-enabled after cooldown`);
                }, this.failureWindow);
            }
        }
    }

    /**
     * Get provider stats
     */
    getStats() {
        return Object.entries(this.providers).map(([name, provider]) => ({
            name: provider.name,
            enabled: provider.enabled,
            totalRequests: provider.totalRequests,
            avgLatency: Math.round(provider.avgLatency),
            failures: provider.failures
        }));
    }
}

export const aiRouter = new AIRouter();
