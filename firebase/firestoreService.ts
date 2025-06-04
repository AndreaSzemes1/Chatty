import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase.config';

// COLLECTION NAMES
const DIARY_COLLECTION = 'diary';
const SUPPORT_COLLECTION = 'supportContacts';
const QUOTE_COLLECTION = 'quotes';
const STORIES_COLLECTION = 'stories';

// diary CRUD
export const addDiaryEntry = async (
  userId: string,
  content: string,
  audioUrl?: string,
  transcription?: string
) => {
  try {
    const newEntry = {
      userId,
      date: new Date().toISOString(),
      content,
      audioUrl: audioUrl || '',
      transcription: transcription || '',
    };

    const docRef = await addDoc(collection(db, DIARY_COLLECTION), newEntry);
    console.log('Diary entry added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding diary entry:', error);
  }
};

export const getDiaryEntries = async (userId: string) => {
  try {
    const q = query(
      collection(db, DIARY_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId,
      date: doc.data().date,
      content: doc.data().content,
      audioUrl: doc.data().audioUrl,
    }));
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateDiaryEntry = async (id: string, data: any) => {
  try {
    const docRef = doc(db, DIARY_COLLECTION, id);
    await updateDoc(docRef, data);
    console.log('Diary entry updated:', id);
  } catch (error) {
    console.error('Error updating diary entry:', error);
  }
};

export const deleteDiaryEntry = async (id: string) => {
  try {
    const docRef = doc(db, DIARY_COLLECTION, id);
    await deleteDoc(docRef);
    console.log('Diary entry deleted:', id);
  } catch (error) {
    console.error('Error deleting diary entry:', error);
  }
};

// support CRUD
export const getSupportContacts = async () => {
  try {
    const snapshot = await getDocs(collection(db, SUPPORT_COLLECTION));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      category: doc.data().category,
      name: doc.data().name,
      contact: {
        phone: doc.data().contact.phone,
        email: doc.data().contact.email,
        website: doc.data().contact.website,
      },
      location: doc.data().location,
      description: doc.data().description,
    }));
  } catch (error) {
    console.error('Error fetching support contacts:', error);
    return [];
  }
};

export const addSupportContact = async (contact: {
  category: string;
  name: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  location?: string;
  description: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, SUPPORT_COLLECTION), contact);
    console.log('Support contact added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding support contact:', error);
    throw error;
  }
};

// quotes, stories CRUD
export const getQuotesByMood = async (mood: string): Promise<string[]> => {
  const ref = doc(db, QUOTE_COLLECTION, mood);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    return snapshot.data().quotes || [];
  }
  return [];
};

export const addQuoteToMood = async (mood: string, quote: string) => {
  const ref = doc(db, QUOTE_COLLECTION, mood);
  await updateDoc(ref, {
    quotes: arrayUnion(quote),
  });
};

export const addStory = async (
  story: string,
  userId: string,
  prompt: string,
  audioUrl: string | null = null
) => {
  await addDoc(collection(db, STORIES_COLLECTION), {
    story,
    prompt,
    userId,
    audioUrl,
    createdAt: serverTimestamp(),
  });
};

//voice memo CRUD
export const addVoiceMemo = async (
  userId: string,
  audioUrl: string,
  transcription?: string
) => {
  await addDoc(collection(db, 'voiceMemos'), {
    userId,
    audioUrl,
    transcription: transcription || null,
    createdAt: new Date().toISOString(),
  });
};

export const getVoiceMemos = async (userId: string) => {
  const q = query(collection(db, 'voiceMemos'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as {
    id: string;
    userId: string;
    audioUrl: string;
    transcription?: string;
    createdAt: string;
  }[];
};
