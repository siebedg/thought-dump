'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../src/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/notes');
    });
  }, [router]);

  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (!error) router.replace('/notes');
  }

  async function signUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (!error) alert('Check your email to confirm (if required), then sign in.');
  }

  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <h1>ThoughtDump</h1>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
          <button onClick={signIn} disabled={loading} style={btnPrimary}>{loading ? '...' : 'Sign In'}</button>
          <button onClick={signUp} disabled={loading} style={btnSecondary}>{loading ? '...' : 'Sign Up'}</button>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e5e7eb', marginTop: 8 };
const btnPrimary: React.CSSProperties = { flex: 1, padding: '12px 16px', borderRadius: 10, background: '#111827', color: '#fff', border: 'none' };
const btnSecondary: React.CSSProperties = { flex: 1, padding: '12px 16px', borderRadius: 10, background: '#f3f4f6', color: '#111', border: 'none' };


