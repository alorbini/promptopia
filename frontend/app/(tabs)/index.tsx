import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryCard from '../../components/CategoryCard';
import { Category, fetchCategories } from '../../lib/api';
import { useTranslate } from '../../lib/i18n';
// THE FIX: Import the global store to get the current language
import useGlobalStore from '../../lib/store';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const t = useTranslate();
  // THE FIX: Get the current language from the store
  const lang = useGlobalStore((state) => state.lang);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // THE FIX: Pass the current language to the fetch function
      const data = await fetchCategories(lang);
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      setError('Failed to fetch categories. Check your connection and IP address.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // THE FIX: Re-run loadCategories whenever the language changes
  useEffect(() => {
    loadCategories();
  }, [lang]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: '/category',
      params: { id: category.id, name: category.name },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Ionicons name="flash" size={28} color="#9D72FF" />
              <Text style={styles.appName}>{t('appName')}</Text>
            </View>
            <Text style={styles.subtitle}>{t('homeSubtitle')}</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              mode="outlined"
              placeholder={t('searchPlaceholderCategories')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              left={<TextInput.Icon icon="magnify" />}
              style={styles.searchInput}
              outlineStyle={styles.searchOutline}
              placeholderTextColor="#888"
              textColor="#fff"
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('allCategories')}</Text>
          </View>

          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => handleCategoryPress(item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.errorText}>No categories match your search.</Text>
              </View>
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#1e1e1e',
  },
  searchOutline: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#333',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  errorText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});

