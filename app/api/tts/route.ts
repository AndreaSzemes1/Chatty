import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
  }

  const apiKey = process.env.VOICERSS_API_KEY;
  const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-gb&src=${encodeURIComponent(
    text
  )}&c=MP3`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('TTS request failed');
    }

    const audioBuffer = await res.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
    });
  } catch (err) {
    console.error('TTS error:', err);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
