import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ipRequests } from './ip-request';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MAX_PER_MIN = 5;
const MAX_PER_DAY = 50;

function getClientIP(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
}

function isRateLimited(ip: string): string | null {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  if (!ipRequests[ip]) ipRequests[ip] = [];
  ipRequests[ip] = ipRequests[ip].filter((t) => t > oneDayAgo); // prune old entries

  const recent = ipRequests[ip];
  const recentMin = recent.filter((t) => t > oneMinuteAgo);

  if (recent.length >= MAX_PER_DAY)
    return '❌ Daily limit reached. Try again tomorrow.';
  if (recentMin.length >= MAX_PER_MIN)
    return '⚠️ Too many messages. Wait a moment and try again.';

  ipRequests[ip].push(now); // record current request
  return null;
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const rateError = isRateLimited(ip);
  if (rateError) {
    return NextResponse.json({ error: rateError }, { status: 429 });
  }

  try {
    const { message } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(message);
    const response = await result.response;

    return NextResponse.json({ reply: response.text() });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
