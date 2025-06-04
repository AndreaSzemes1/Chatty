'use client';

import Navbar from '@/components/navbar';
import { useState } from 'react';

interface MediaLink {
  id: string;
  title: string;
  url: string;
  platform: string;
}

const placeholderData: MediaLink[] = [
  {
    id: '1',
    title: '5 Minute Guided Morning Meditation for Positive Energy',
    url: 'https://www.youtube.com/watch?v=j734gLbQFbU',
    platform: 'YouTube',
  },
  {
    id: '2',
    title: 'WHEN LIFE BREAKS YOU - Powerful Motivational Speech',
    url: 'https://www.youtube.com/watch?v=0cwtNOq_k4w',
    platform: 'YouTube',
  },
  {
    id: '3',
    title:
      'Evening Meditation for Gratitude, Positive Energy & Deep Relaxation',
    url: 'https://www.youtube.com/watch?v=YlQLs17NfJE',
    platform: 'YouTube',
  },
];

export default function Meditation() {
  const [mediaLinks] = useState<MediaLink[]>(placeholderData);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl w-full space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4">
            Meditation & Motivation
          </h1>

          {mediaLinks.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No content available yet.
            </div>
          ) : (
            <div className="space-y-4">
              {mediaLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {link.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Platform: {link.platform}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Open Link
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
