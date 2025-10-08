import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PromptDetail, fetchPromptDetail } from '../lib/api';
import { useTranslate } from '../lib/i18n';
import useGlobalStore from '../lib/store';

export default function PromptModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lang = useGlobalStore((state) => state.lang);
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslate();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadPrompt = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchPromptDetail(id, lang);
        setPrompt(data);
      } catch (e) {
        console.error('Failed to fetch prompt detail', e);
      } finally {
        setLoading(false);
      }
    };
    loadPrompt();
  }, [id, lang]);

  const handleCopy = () => {
    const promptText = prompt?.translation?.prompt_text?.trim();
    if (!promptText) {
      alert(t('missingPromptText'));
      return;
    }
  };

  const handleShare = async () => {
    const promptText = prompt?.translation?.prompt_text?.trim();
    if (!promptText) {
      alert(t('missingPromptText'));
      return;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }
  if (!prompt) {
    return <Text style={styles.centered}>Prompt not found.</Text>;
  }

  const imageUrl = prompt.cover_image_url || 'https://placehold.co/700x400/2f2f2f/555555?text=No+Image';
  const translation = prompt.translation;
  const promptTitle = translation?.title?.trim() || t('missingPromptTitle');
  const promptSubtitle = translation?.subtitle?.trim() || t('missingPromptSubtitle');
  const promptText = translation?.prompt_text?.trim() || t('missingPromptText');

  return (
    // THE FIX: SafeAreaView now applies insets to all sides by default
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={[styles.closeButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
        <Ionicons name="close-circle" size={32} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        // THE FIX: Add padding to the bottom so the last lines aren't hidden by the floating buttons
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: imageUrl }}
            style={styles.imageBackground}
            resizeMode="cover"
            blurRadius={15}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{promptTitle}</Text>
          <Text style={styles.subtitle}>{promptSubtitle}</Text>
          <View style={styles.promptBox}>
            <Text style={styles.promptText}>{promptText}</Text>
          </View>
        </View>
      </ScrollView>

      {/* THE FIX: Floating action buttons are now outside the ScrollView */}
      <View style={[styles.floatingActions, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
          <Ionicons name="copy-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>{t('copy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>{t('share')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#fff' },
  subtitle: { fontSize: 18, color: '#ccc', marginBottom: 20 },
  promptBox: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 20 },
  promptText: { fontSize: 16, lineHeight: 24, color: '#eee' },
  
  // NEW STYLES for the floating action bar
  floatingActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#7742e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

