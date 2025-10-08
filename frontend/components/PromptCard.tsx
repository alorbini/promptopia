import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Prompt } from '../lib/api';
import { useTranslate } from '../lib/i18n';

type PromptCardProps = {
  prompt: Prompt;
  onPress: () => void;
};

// This is the new, robust PromptCard, built from the ground up with core components.
// It does not use any 'react-native-paper' components to avoid production crashes.
export default function PromptCard({ prompt, onPress }: PromptCardProps) {
  const t = useTranslate();
  const imageUrl = prompt.cover_image_url || 'https://placehold.co/700x400/2f2f2f/555555?text=No+Image';
  const translation = prompt.translation;
  const title = translation?.title?.trim() || t('missingPromptTitle');
  const subtitle = translation?.subtitle?.trim() || t('missingPromptSubtitle');
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.chipContainer}>
          <View style={styles.chip}>
            <Ionicons name="hardware-chip-outline" size={14} color="#ccc" />
            <Text style={styles.chipText}>{prompt.model}</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="analytics-outline" size={14} color="#ccc" />
            <Text style={styles.chipText}>{prompt.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    height: 180,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    minHeight: 40,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  chipText: {
    color: '#ccc',
    fontSize: 12,
  },
});
