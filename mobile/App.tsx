import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/supabaseClient';
import RecordScreen from './src/screens/RecordScreen';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn() {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e: any) {
      Alert.alert('Sign in failed', e.message ?? String(e));
    } finally {
      setAuthLoading(false);
    }
  }

  async function signUp() {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      Alert.alert('Check email', 'If email confirmations are on, confirm your address.');
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message ?? String(e));
    } finally {
      setAuthLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (session) {
    return <RecordScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: '100%', maxWidth: 420 }}>
        <Text style={styles.title}>ThoughtDump</Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity onPress={signIn} disabled={authLoading} style={styles.button}>
            <Text style={styles.buttonText}>{authLoading ? '...' : 'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signUp} disabled={authLoading} style={[styles.button, styles.secondary]}>
            <Text style={[styles.buttonText, { color: '#111' }]}>{authLoading ? '...' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff'
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8
  },
  button: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    flexGrow: 1,
    alignItems: 'center'
  },
  buttonText: { color: 'white', fontWeight: '600' },
  secondary: { backgroundColor: '#f3f4f6' }
});


