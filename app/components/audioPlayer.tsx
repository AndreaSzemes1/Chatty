'use client';

import { useState } from 'react';

interface AudioPlayerProps {
  text?: string; // Use for dynamic TTS
  src?: string; // Use for static audio file
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, src }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(src || null);
  const [loading, setLoading] = useState(false);

  const generateTTS = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      const { audioUrl } = await res.json();
      setAudioUrl(audioUrl);
    } catch (err) {
      console.error('TTS error:', err);
      alert('Failed to generate audio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 text-center">
      {loading ? (
        <p className="text-sm text-gray-500">Generating audio...</p>
      ) : audioUrl ? (
        <audio
          controls
          src={audioUrl}
          className="w-full rounded border border-gray-300 dark:border-gray-600"
        />
      ) : text ? (
        <button
          onClick={generateTTS}
          className="text-sm text-blue-500 hover:underline"
        >
          Play Audio
        </button>
      ) : (
        <p className="text-sm text-red-500">No audio source provided.</p>
      )}
    </div>
  );
};

export default AudioPlayer;
