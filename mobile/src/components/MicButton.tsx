import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
// Fallback to CSS-drawn mic to avoid native SVG build issues

type Props = {
  recording: boolean;
  onPress: () => void;
  timeLabel: string;
};

export default function MicButton({ recording, onPress, timeLabel }: Props) {
  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.circle, recording && styles.circleActive]}>
        {recording ? (
          <Text style={{ color: 'white', fontSize: 28 }}>■</Text>
        ) : null}
      </TouchableOpacity>
      <Text style={{ fontSize: 20, marginTop: 20, fontVariant: ['tabular-nums'], color: '#fff' }}>{timeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 5
  },
  circleActive: {
    backgroundColor: '#dc2626'
  }
});


