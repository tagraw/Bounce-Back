import React, { useState } from 'react';
import { app } from '../config/firebase';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export const Auth = () => {
  // access Firebase Auth instance.
  const auth = getAuth(app);

  // keep track of form input in state.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUpUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully:', userCredential.user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const signInUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <h2>Auth Component</h2>
      <input
        type="email"
        placeholder="Email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={() => signUpUser(email, password)}>Sign Up</button>
      <button onClick={() => signInUser(email, password)}>Sign In</button>
      <button onClick={signOutUser}>Sign Out</button>
    </div>
  );
};