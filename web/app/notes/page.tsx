'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../src/supabaseClient';

type Note = { id: string; storage_path: string; status: 'open'|'completed'; created_at: string };

export default function NotesPage(){
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<'all'|'open'|'completed'>('all');
  const [urls, setUrls] = useState<Record<string,string>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (!data.session) router.replace('/login'); });
    supabase.from('voice_notes').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setNotes(data || []));
  }, [router]);

  useEffect(() => {
    (async () => {
      const out: Record<string,string> = {};
      for (const n of notes) {
        const { data } = await supabase.storage.from('recordings').createSignedUrl(n.storage_path, 60*60);
        if (data?.signedUrl) out[n.id] = data.signedUrl;
      }
      setUrls(out);
    })();
  }, [notes]);

  const shown = useMemo(() => notes.filter(n => filter==='all' ? true : n.status===filter), [notes, filter]);

  async function toggleStatus(id: string, next: 'open'|'completed'){
    await supabase.from('voice_notes').update({ status: next }).eq('id', id);
    setNotes(prev => prev.map(n => n.id===id ? { ...n, status: next } : n));
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1>My Voice Notes</h1>
        <button onClick={() => supabase.auth.signOut().then(() => router.replace('/login'))} style={btnSecondary}>Sign out</button>
      </header>
      <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
        <button onClick={()=>setFilter('all')} style={filterBtn(filter==='all')}>All</button>
        <button onClick={()=>setFilter('open')} style={filterBtn(filter==='open')}>Open</button>
        <button onClick={()=>setFilter('completed')} style={filterBtn(filter==='completed')}>Completed</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {shown.map(n => (
          <li key={n.id} style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <small>{new Date(n.created_at).toLocaleString()}</small>
              <span style={pill}>{n.status}</span>
            </div>
            <audio controls src={urls[n.id]} style={{ width:'100%', marginTop:8 }} />
            <div style={{ marginTop:8 }}>
              {n.status==='open' ? (
                <button onClick={()=>toggleStatus(n.id,'completed')} style={btnPrimary}>Mark Complete</button>
              ) : (
                <button onClick={()=>toggleStatus(n.id,'open')} style={btnSecondary}>Reopen</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

const card: React.CSSProperties = { border:'1px solid #eee', borderRadius:12, padding:16, marginTop:12 };
const pill: React.CSSProperties = { background:'#f3f4f6', color:'#111', borderRadius: 999, padding: '4px 8px', fontSize: 12 };
const btnPrimary: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, background: '#111827', color: '#fff', border: 'none' };
const btnSecondary: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, background: '#f3f4f6', color: '#111', border: '1px solid #e5e7eb' };
const filterBtn = (active: boolean): React.CSSProperties => ({ padding: '6px 10px', borderRadius: 999, border: '1px solid #e5e7eb', background: active ? '#111827' : '#fff', color: active ? '#fff' : '#111' });


