import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
});

export async function POST(req: Request) {
  try {
    const { messages, bootcampPrice, professionalPrice } = await req.json();

    const dynamicPrompt = `You are Elitech Hub's friendly AI Admissions Counselor. 
Your goal is to answer questions about the bootcamp, masterclass, and services, and ultimately encourage the user to apply.

Programs:
1. 6-Week Bootcamp: Fast-paced fundamentals. Cost: ${bootcampPrice || '₦75,000'}. 100% virtual. No split payments allowed.
2. 16-Week Professional Masterclass: Advanced training, hands-on labs, unpaid internship experience. Cost: ${professionalPrice || '₦200,000'}. 100% virtual. Split payments allowed (Maximum of exactly 2 installments).

Tone: Professional, highly encouraging, enthusiastic. Use emojis sparingly.

CRITICAL RULES:
- Never offer discounts. 
- State explicitly that all payments are strictly NON-REFUNDABLE.
- NEVER promise job placement or employment. We offer an unpaid internship experience only.
- Keep responses under 3 sentences. Be friendly, slightly edgy (hacker vibe).
- If asked about contacting humans, tell them to email info@elitechub.com or use WhatsApp +2347081968062.
If they ask for something you don't know, tell them to use the Contact form.`;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages: [
        { role: 'system', content: dynamicPrompt },
        ...(messages as any[]),
      ],
      temperature: 0.7,
    });

    // ai v7 compatible: stream raw text chunks as a plain text stream
    // The Chatbot component reads lines prefixed with "0:" (Vercel AI data stream format)
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.textStream) {
            // Encode as Vercel AI SDK data stream format: 0:"text chunk"\n
            const line = `0:${JSON.stringify(chunk)}\n`;
            controller.enqueue(encoder.encode(line));
          }
          // Send finish signal
          controller.enqueue(encoder.encode('d:{"finishReason":"stop"}\n'));
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error) }, { status: 500 });
  }
}

