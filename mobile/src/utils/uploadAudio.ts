import { supabase } from '../supabaseClient';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import * as FileSystem from 'expo-file-system';
import { decode as decodeBase64 } from 'base64-arraybuffer';

export async function uploadAudio(uri: string, durationSec?: number) {
  const id = uuid();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error('No user');
  const storagePath = `recordings/${user.id}/${id}.m4a`;
  // Read file as base64 to avoid Android fetch(file://) networking issues
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const arrayBuffer = decodeBase64(base64);
  const { error: upErr } = await supabase.storage.from('recordings').upload(storagePath, arrayBuffer, {
    contentType: 'audio/m4a',
    upsert: false,
  });
  if (upErr) throw upErr;
  const { error: insErr } = await supabase.from('voice_notes').insert({
    id,
    user_id: user.id,
    storage_path: storagePath,
    duration_seconds: durationSec ?? null,
  });
  if (insErr) throw insErr;
  return { id, storagePath };
}


