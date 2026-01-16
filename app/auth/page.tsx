'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    await supabase.auth.signUp({ email, password });
    alert('Check your email to confirm your account.');
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const magicLink = async () => {
    await supabase.auth.signInWithOtp({ email });
    alert('Magic link sent to your email.');
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white shadow p-6 rounded space-y-4">
        <h1 className="text-xl font-bold">Agent Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-2 py-1"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-2 py-1"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={signIn} className="w-full bg-indigo-600 text-white py-2 rounded">
          Sign In
        </button>
        <button onClick={signUp} className="w-full bg-slate-200 py-2 rounded">
          Sign Up
        </button>
        <button onClick={magicLink} className="w-full bg-slate-100 py-2 rounded text-sm">
          Send Magic Link
        </button>
        <button onClick={signInWithGoogle} className="w-full bg-red-500 text-white py-2 rounded">
          Sign In with Google
        </button>
      </div>
    </main>
  );
}
