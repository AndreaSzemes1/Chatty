import { NextRequest, NextResponse } from 'next/server';
import { ipRequests } from '../ip-request'; // make sure this is exported from main route

const MAX_PER_DAY = 50;

function getClientIP(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
}

export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const history = ipRequests[ip] || [];
  const dailyUsage = history.filter((t) => t > oneDayAgo).length;

  return NextResponse.json({
    used: dailyUsage,
    remaining: Math.max(0, MAX_PER_DAY - dailyUsage),
    max: MAX_PER_DAY,
  });
}
