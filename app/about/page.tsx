"use client";

import Navbar from "@/components/navbar";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl w-full space-y-8">
          <h1 className="text-4xl font-bold text-center mb-4">About Chatty</h1>

          {/* Introduction Section */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-2">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              Chatty is a mental health support platform designed to provide a safe space for users to express their thoughts, practice mindfulness, and reflect on their daily experiences.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Features</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Explore a range of tools to help you manage your mental well-being:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <p>
                  <strong>Chat:</strong> Connect with our AI-powered chatbot for supportive and non-judgmental conversations.
                </p>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <p>
                  <strong>Support:</strong> Get professional help anytime.
                </p>
              </li>
            </ul>
          </section>

          {/* Why Register Section */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Why Register?</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Unlock more features and personalize your experience:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <p>Access exclusive meditation content and curated quotes.</p>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <p>Save your diary entries and revisit them anytime.</p>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <p>Unlock new features as we expand the platform.</p>
              </li>
            </ul>
          </section>

          {/* Final Call to Action */}
          <section className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold">Join Chatty today and take the first step towards a healthier, more balanced mind.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
