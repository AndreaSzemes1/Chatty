'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { useAuth } from '@/hooks/useAuth';
import AudioPlayer from './audioPlayer';

interface StoryEntry {
  id: string;
  story: string;
  prompt: string;
  createdAt: number;
  audioUrl?: string;
}

export default function StoryList() {
  const { user } = useAuth();
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, 'stories'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data: StoryEntry[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StoryEntry[];
        setStories(data);
      } catch (err) {
        console.error('Failed to fetch stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [user]);

  if (!user?.uid) return <p className="text-center">You must be logged in.</p>;

  if (loading)
    return <p className="text-center text-gray-500">Loading stories...</p>;

  if (stories.length === 0)
    return <p className="text-center text-gray-500">No stories saved yet.</p>;

  return (
    <div className="space-y-6">
      {stories.map((entry) => (
        <div
          key={entry.id}
          className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 italic">
            Prompt: {entry.prompt}
          </p>
          <p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">
            {entry.story}
          </p>
          {entry.audioUrl && <AudioPlayer src={entry.audioUrl} />}
        </div>
      ))}
    </div>
  );
}
