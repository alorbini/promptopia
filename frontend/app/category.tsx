import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import PromptCard from '../components/PromptCard';
import { PaginatedResponse, Prompt, fetchPrompts } from '../lib/api';
import { useTranslate } from '../lib/i18n';
import useGlobalStore from '../lib/store';

export default function CategoryScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const lang = useGlobalStore((state) => state.lang);
  const t = useTranslate();
  const theme = useTheme();
  const navigation = useNavigation();
  const router = useRouter(); // THE FIX: Get the router for navigation

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [navigation, name]);

  const loadPrompts = async (isInitial = false) => {
    if ((loadingMore || !hasNextPage) && !isInitial) return;

    const targetPage = isInitial ? 1 : page;
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response: PaginatedResponse<Prompt> = await fetchPrompts({
        categoryId: id,
        lang,
        page: targetPage,
      });

      setPrompts((prev) =>
        isInitial ? response.data : [...prev, ...response.data]
      );
      setPage(response.meta.current_page + 1);
      setHasNextPage(!!response.links.next);
    } catch (err) {
      setError(t('error'));
      console.error(err);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    loadPrompts(true);
  }, [lang, id]);

  // THE FIX: Implemented the navigation logic here
  const handlePromptPress = (promptId: string) => {
    router.push({
      pathname: '/prompt-modal',
      params: { id: promptId },
    });
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={prompts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // THE FIX: The onPress prop now correctly calls the handlePromptPress function
          <PromptCard prompt={item} onPress={() => handlePromptPress(item.id)} />
        )}
        onEndReached={() => loadPrompts()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={{ margin: 20 }} /> : null
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>{t('noResults')}</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
});

