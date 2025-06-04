'use client';

import Navbar from '@/components/navbar';
import { useState } from 'react';
import StoryList from '@/components/storyList';

import {
  addQuoteToMood,
  addStory,
  getQuotesByMood,
} from '../../firebase/firestoreService';
import { useGeminiQuota } from '@/hooks/useGeminiQuota';
import { useAuth } from '@/hooks/useAuth';
import AudioPlayer from '@/components/audioPlayer';
import { uploadAudioFile } from '../../firebase/storageService';

type Mood = 'calm' | 'motivation' | 'focus' | 'positivity';

export default function Quotes() {
  const [storySaved, setStorySaved] = useState(false);
  const [saveOption, setSaveOption] = useState<'text' | 'text-audio'>('text');
  const [selectedMood, setSelectedMood] = useState<Mood | ''>('');
  const [quote, setQuote] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStories, setShowStories] = useState(false);

  const { user } = useAuth();

  const { quota, refreshQuota } = useGeminiQuota();
  const canGenerate = quota?.remaining > 0;

  const handleGetQuote = async () => {
    if (!selectedMood) return;

    setQuote(''); // clear previous quote
    setLoading(true);

    try {
      if (canGenerate) {
        const res = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: `Generate a short motivational quote based on the mood: "${selectedMood}".`,
          }),
        });

        const data = await res.json();
        const generatedQuote = data.reply?.trim();

        if (data.error || !generatedQuote) {
          setQuote(' Failed to generate quote.');
        } else {
          setQuote(generatedQuote);
          await addQuoteToMood(selectedMood, generatedQuote);
          refreshQuota();
        }
      } else {
        const quotes = await getQuotesByMood(selectedMood);
        if (quotes.length > 0) {
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          setQuote(randomQuote);
        } else {
          setQuote('No quotes found for this mood.');
        }
      }
    } catch (err) {
      console.error('Quote fetch error:', err);
      setQuote('Error fetching quote.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIStory = async () => {
    if (!aiPrompt.trim()) return;

    if (!canGenerate) {
      setAiResponse('Daily AI story limit reached. Please try again tomorrow.');
      return;
    }

    setAiResponse('');
    setStorySaved(false);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: `Write a 100 word or less long, supportive story for someone dealing with: "${aiPrompt}".`,
        }),
      });

      const data = await res.json();
      const generatedStory = data.reply?.trim();

      if (data.error || !generatedStory) {
        setAiResponse(' Error generating story.');
      } else {
        setAiResponse(generatedStory);
      }
    } catch (err) {
      console.error('AI story error:', err);
      setAiResponse('Error generating story.');
    } finally {
      setLoading(false);
      refreshQuota();
    }
  };

  const handleSaveStory = async () => {
    if (!user?.uid || !aiResponse) return;

    let audioUrl: string | null = null;

    if (saveOption === 'text-audio') {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          body: JSON.stringify({ text: aiResponse }),
        });

        const data = await res.json();
        const base64Data = data.audioUrl.split(',')[1];
        const audioBlob = new Blob(
          [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
          { type: 'audio/wav' }
        );

        const filename = `story_${Date.now()}.wav`;
        audioUrl = await uploadAudioFile(audioBlob, `audioStories/${filename}`);
      } catch (err) {
        console.error('TTS save error:', err);
        alert('Failed to save audio. Story will be saved without audio.');
      }
    }

    try {
      await addStory(aiResponse, user.uid, aiPrompt, audioUrl);
      alert('Story saved successfully.');
      setStorySaved(true);
      setAiPrompt('');
    } catch (err) {
      console.error('Save story failed:', err);
      alert('Failed to save story.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-xl w-full space-y-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Quotes & Stories
          </h1>

          {/* Mood-based Static Quote */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Get a Quote by Mood</h2>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value as Mood)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full"
            >
              <option value="">-- Select Mood --</option>
              <option value="calm">Calm</option>
              <option value="motivation">Motivation</option>
              <option value="focus">Focus</option>
              <option value="positivity">Positivity</option>
            </select>

            <button
              onClick={handleGetQuote}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              disabled={!selectedMood}
            >
              Get Quote
            </button>

            {quote && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow text-center">
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  {quote}
                </p>
                <AudioPlayer text={quote}></AudioPlayer>
              </div>
            )}
          </section>

          {/* AI Generated Story Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Generate a Personalized Story
            </h2>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., overcoming anxiety."
              className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full"
              disabled={loading}
            />
            <button
              onClick={handleGenerateAIStory}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
              disabled={loading || !canGenerate}
            >
              {'Generate Story'}
            </button>

            {aiResponse && (
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow text-center">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {aiResponse}
                  </p>
                  <AudioPlayer text={aiResponse}></AudioPlayer>
                </div>

                {/* Save Story Section */}
                {!storySaved && (
                  <div className="border-t border-gray-300 pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      Would you like to save this story?
                    </p>
                    <div className="flex justify-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="saveOption"
                          value="text"
                          checked={saveOption === 'text'}
                          onChange={() => setSaveOption('text')}
                        />
                        <span className="text-sm">Text only</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="saveOption"
                          value="text-audio"
                          checked={saveOption === 'text-audio'}
                          onChange={() => setSaveOption('text-audio')}
                        />
                        <span className="text-sm">Text + Audio</span>
                      </label>
                    </div>
                    <button
                      onClick={handleSaveStory}
                      className="bg-indigo-500 text-white py-1 px-4 rounded hover:bg-indigo-600 w-full"
                    >
                      Save Story
                    </button>
                  </div>
                )}
              </div>
            )}
            {quota && (
              <p className="text-sm text-gray-500 text-center">
                {quota.remaining} / {quota.max} Gemini uses left today
              </p>
            )}
          </section>

          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-center">
              My Saved Stories
            </h2>

            <div className="text-center">
              <button
                onClick={() => setShowStories((prev) => !prev)}
                className="text-blue-600 hover:underline text-sm"
              >
                {showStories ? 'Hide My Stories' : 'Show My Stories'}
              </button>
            </div>

            {showStories && (
              <div className="pt-4">
                <StoryList />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
