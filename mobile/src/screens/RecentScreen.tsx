import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';

type Note = { id: string; created_at: string; status: 'open'|'completed' };

export default function RecentScreen(){
  const [recent, setRecent] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('voice_notes')
        .select('id, created_at, status')
        .order('created_at', { ascending: false })
        .limit(25);
      setRecent(data || []);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={recent}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ color: '#e5e7eb' }}>{new Date(item.created_at).toLocaleString()}</Text>
            <Text style={{ color: '#a78bfa', fontSize: 16 }}>▸</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#9ca3af', textAlign: 'center', marginTop: 24 }}>No notes yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0a12' },
  card: { borderWidth: 1, borderColor: '#2d2257', borderRadius: 12, padding: 12, marginBottom: 8, backgroundColor: '#130f1f', flexDirection:'row', justifyContent:'space-between', alignItems:'center' }
});


