import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import { Audio, AVPlaybackStatus, Recording } from 'expo-av';
import MicButton from '../components/MicButton';
import { uploadAudio } from '../utils/uploadAudio';
import { supabase } from '../supabaseClient';
import { StatusBar } from 'expo-status-bar';

export default function RecordScreen() {
  const recordingRef = useRef<Recording | null>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);


  useEffect(() => {
    let timer: any;
    if (recording) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(timer);
  }, [recording]);

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow microphone access.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        {
          android: { extension: '.m4a', outputFormat: Audio.AndroidOutputFormat.MPEG_4, audioEncoder: Audio.AndroidAudioEncoder.AAC, sampleRate: 44100, numberOfChannels: 1, bitRate: 128000 },
          ios: { extension: '.m4a', audioQuality: Audio.IOSAudioQuality.HIGH, sampleRate: 44100, numberOfChannels: 1, bitRate: 128000, outputFormat: Audio.IOSOutputFormat.MPEG4AAC },
          web: {},
          isMeteringEnabled: false,
        },
        undefined
      );
      recordingRef.current = recording;
      setRecording(true);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? String(e));
    }
  }

  async function stopRecording() {
    try {
      const rec = recordingRef.current;
      if (!rec) return;
      setRecording(false);
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      const status = (await rec.getStatusAsync()) as AVPlaybackStatus & { durationMillis?: number };
      const durationSec = status && 'durationMillis' in status && status.durationMillis ? Math.round(status.durationMillis / 1000) : undefined;
      if (!uri) throw new Error('No file URI');
      setBusy(true);
      await uploadAudio(uri, durationSec);
      setToast('Uploaded');
      setTimeout(() => setToast(null), 2500);
    } catch (e: any) {
      setToast('Upload failed');
      setTimeout(() => setToast(null), 2000);
    } finally {
      setBusy(false);
      recordingRef.current = null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <MicButton recording={recording} onPress={() => (recording ? stopRecording() : startRecording())} timeLabel={formatTime(time)} />
          {/* {busy ? <Text style={{ marginTop: 8, color: '#ffffff' }}>Uploading...</Text> : null} */}
        </View>
      {toast ? (
        <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>
      ) : null}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1c' },
  bg: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  toast: { fontSize: 24, position: 'absolute', bottom: 32, left: 120, right: 120, backgroundColor: '#383838', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 36, alignItems: 'center' },
  toastText: { color: '#fff' }
});


