'use client';

import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../../firebase/firebase.config';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string | null;
  user: User | null;
  logout: () => void;
  updateUserName: (newName: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserName(currentUser?.displayName || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserName(null);
      console.log('User logged out');
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserName = async (newName: string) => {
    if (user) {
      try {
        await updateProfile(user, { displayName: newName });
        await auth.updateCurrentUser(user);
        setUserName(newName);
        console.log('User name updated:', newName);
      } catch (error) {
        console.error('Error updating display name:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        userName,
        user,
        logout,
        updateUserName,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
