'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../src/supabaseClient';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace('/notes');
      else router.replace('/login');
    })();
  }, [router]);
  return null;
}


