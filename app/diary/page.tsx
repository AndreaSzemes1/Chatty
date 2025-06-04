'use client';

import Navbar from '@/components/navbar';
import { useEffect, useRef, useState } from 'react';
import {
  addDiaryEntry,
  getDiaryEntries,
  getVoiceMemos,
  addVoiceMemo,
} from '../../firebase/firestoreService';
import { useAuth } from '@/hooks/useAuth';
import AudioPlayer from '@/components/audioPlayer';
import { uploadAudioFile } from '../../firebase/storageService';

interface DiaryEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  audioUrl?: string;
}

interface VoiceMemo {
  id: string;
  userId: string;
  createdAt: string;
  audioUrl: string;
  transcription?: string;
}

export default function Diary() {
  const { user } = useAuth();
  const userId = user?.uid || '';

  const [textEntries, setTextEntries] = useState<DiaryEntry[]>([]);
  const [voiceMemos, setVoiceMemos] = useState<VoiceMemo[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [saveOption, setSaveOption] = useState<'text' | 'text-audio'>('text');
  const [showEntries, setShowEntries] = useState(false);
  const [showVoiceMemos, setShowVoiceMemos] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const entries = await getDiaryEntries(userId);
      const memos = await getVoiceMemos(userId);
      setTextEntries(entries);
      setVoiceMemos(memos);
    };

    fetchData();
  }, [userId]);

  const handleAddTextEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Entry content cannot be empty.');
      return;
    }

    try {
      let audioUrl: string | undefined = undefined;

      if (saveOption === 'text-audio') {
        const res = await fetch('/api/tts', {
          method: 'POST',
          body: JSON.stringify({ text: content }),
        });

        const data = await res.json();
        if (data.audioUrl) {
          const audioBlob = await fetch(data.audioUrl).then((res) =>
            res.blob()
          );
          audioUrl = await uploadAudioFile(
            audioBlob,
            `diary/${userId}/${Date.now()}.mp3`
          );
        } else {
          throw new Error('Failed to generate audio.');
        }
      }

      await addDiaryEntry(userId, content, audioUrl);
      setContent('');
      setError('');
      setTextEntries(await getDiaryEntries(userId));
    } catch (err) {
      console.error('Error saving diary entry:', err);
      setError('Failed to save entry.');
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/mp3',
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      setError('Unable to access microphone.');
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSaveVoiceMemo = async () => {
    if (!audioUrl || !userId) return;
    try {
      const audioBlob = await fetch(audioUrl).then((res) => res.blob());
      const uploadedUrl = await uploadAudioFile(
        audioBlob,
        `memos/${userId}/${Date.now()}.mp3`
      );

      await addVoiceMemo(userId, uploadedUrl);

      setVoiceMemos(await getVoiceMemos(userId));
      setAudioUrl(null);
    } catch (err) {
      console.error('Voice memo save error:', err);
      setError('Failed to save voice memo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl w-full space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4">My Diary</h1>

          {error && (
            <div className="bg-red-100 text-red-800 p-2 rounded text-center">
              {error}
            </div>
          )}

          {/* Text Diary */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Text Entry</h2>
            <form onSubmit={handleAddTextEntry} className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded resize-none h-24 w-full"
                placeholder="Write your thoughts..."
              ></textarea>

              <div className="flex space-x-4 text-sm text-gray-700 dark:text-gray-300">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="text"
                    checked={saveOption === 'text'}
                    onChange={() => setSaveOption('text')}
                    className="mr-2"
                  />
                  Save text only
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="text-audio"
                    checked={saveOption === 'text-audio'}
                    onChange={() => setSaveOption('text-audio')}
                    className="mr-2"
                  />
                  Save text + audio
                </label>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Save Entry
              </button>
            </form>

            <div className="pt-4 border-t border-gray-300">
              <button
                onClick={() => setShowEntries((prev) => !prev)}
                className="text-blue-600 hover:underline text-sm text-center block mx-auto"
              >
                {showEntries ? 'Hide Saved Entries' : 'Show Saved Entries'}
              </button>
            </div>

            {showEntries && (
              <div className="space-y-4">
                {textEntries.length === 0 ? (
                  <div className="text-gray-600 dark:text-gray-400 text-center">
                    No entries yet.
                  </div>
                ) : (
                  textEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {new Date(entry.date).toLocaleString()}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {entry.content}
                      </p>
                      {entry.audioUrl && (
                        <div className="mt-2">
                          <AudioPlayer src={entry.audioUrl} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {/* Audio Diary */}
          <section className="space-y-4 border-t pt-6 border-gray-300">
            <h2 className="text-2xl font-semibold">Voice Memos</h2>

            <button
              onClick={
                isRecording ? handleStopRecording : handleStartRecording
              }
              className={`py-2 px-4 rounded w-full ${isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
                } text-white`}
            >
              {isRecording ? 'Stop Recording' : 'Record Voice Memo'}
            </button>

            {audioUrl && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md space-y-4">
                <AudioPlayer src={audioUrl} />
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveVoiceMemo}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                  >
                    Save Memo
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-300">
              <button
                onClick={() => setShowVoiceMemos((prev) => !prev)}
                className="text-blue-600 hover:underline text-sm text-center block mx-auto"
              >
                {showVoiceMemos
                  ? 'Hide Saved Voice Memos'
                  : 'Show Saved Voice Memos'}
              </button>
            </div>

            {showVoiceMemos && voiceMemos.length > 0 && (
              <div className="space-y-4">
                {voiceMemos.map((memo) => (
                  <div
                    key={memo.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {new Date(memo.createdAt).toLocaleString()}
                    </p>
                    <AudioPlayer src={memo.audioUrl} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
