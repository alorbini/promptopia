import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  currentLang: 'ar' | 'en';
  onToggle: (lang: 'ar' | 'en') => void;
};

export default function LangToggle({ currentLang, onToggle }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentLang === 'en' && styles.activeButton]}
        onPress={() => onToggle('en')}
      >
        <Text style={[styles.text, currentLang === 'en' && styles.activeText]}>
          EN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, currentLang === 'ar' && styles.activeButton]}
        onPress={() => onToggle('ar')}
      >
        <Text style={[styles.text, currentLang === 'ar' && styles.activeText]}>
          AR
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7742e2',
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  activeButton: {
    backgroundColor: '#7742e2',
  },
  text: {
    fontSize: 16,
    color: '#7742e2',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
});
