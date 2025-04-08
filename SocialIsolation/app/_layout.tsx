import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../config/firebase';
import LoadingScreen from './components/LoadingScreen';

const MINIMUM_LOADING_TIME = 3000; // 3 seconds

export default function RootLayout() {
  const [authResolved, setAuthResolved] = useState(false);
  const [layoutMounted, setLayoutMounted] = useState(false);
  const [userStatus, setUserStatus] = useState<'not-logged-in' | 'no-group' | 'has-group' | null>(null);

  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const startTime = Date.now();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserStatus('not-logged-in');
        const elapsed = Date.now() - startTime;
        const remaining = MINIMUM_LOADING_TIME - elapsed;
        setTimeout(() => setAuthResolved(true), Math.max(0, remaining));
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        setUserStatus(userData.group ? 'has-group' : 'no-group');
      } catch (err) {
        console.error('Error checking group:', err);
        setUserStatus('no-group');
      }

      const elapsed = Date.now() - startTime;
      const remaining = MINIMUM_LOADING_TIME - elapsed;
      setTimeout(() => setAuthResolved(true), Math.max(0, remaining));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setLayoutMounted(true);
  }, []);

  useEffect(() => {
    if (!authResolved || !layoutMounted || userStatus === null) return;

    setTimeout(() => {
      switch (userStatus) {
        case 'not-logged-in':
          router.replace('/(auth)/login');
          break;
        case 'no-group':
          router.replace('/(auth)/selectgroup');
          break;
        case 'has-group':
          router.replace('/(tabs)');
          break;
      }
    }, 100);
  }, [authResolved, layoutMounted, userStatus]);

  if (!authResolved) {
    return <LoadingScreen />;
  }

  return <Slot />;
}
