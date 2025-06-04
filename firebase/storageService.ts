import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.config';

export const uploadAudioFile = async (
  file: Blob,
  path: string
): Promise<string> => {
  const audioRef = ref(storage, path);
  await uploadBytes(audioRef, file);
  const downloadUrl = await getDownloadURL(audioRef);
  return downloadUrl;
};
