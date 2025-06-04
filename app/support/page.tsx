"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { getSupportContacts } from "../../firebase/firestoreService";

interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

interface ProfessionalHelp {
  id: string;
  category: string;
  name: string;
  contact: ContactInfo;
  location?: string;
  description: string;
}

export default function Support() {
  const [contacts, setContacts] = useState<ProfessionalHelp[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getSupportContacts();
        setContacts(data);
      } catch (err) {
        console.error("Error fetching support contacts:", err);
        setError("Failed to load support contacts.");
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl w-full space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4">Support Resources</h1>

          {error && (
            <div className="bg-red-100 text-red-800 p-2 rounded text-center">
              {error}
            </div>
          )}

          <section className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center">No support contacts available.</p>
            ) : (
              contacts.map((item: ProfessionalHelp) => (
                <div
                  key={item.id}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md space-y-2"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {item.name}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Category:</strong> {item.category}
                  </p>
                  {item.location && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Location:</strong> {item.location}
                    </p>
                  )}
                  <div className="flex flex-col space-y-1">
                    {item.contact.phone && (
                      <p className="text-blue-500">
                        <a href={`tel:${item.contact.phone}`}>{item.contact.phone}</a>
                      </p>
                    )}
                    {item.contact.email && (
                      <p className="text-blue-500">
                        <a href={`mailto:${item.contact.email}`}>{item.contact.email}</a>
                      </p>
                    )}
                    {item.contact.website && (
                      <p className="text-blue-500">
                        <a href={item.contact.website} target="_blank" rel="noopener noreferrer">
                          {item.contact.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
