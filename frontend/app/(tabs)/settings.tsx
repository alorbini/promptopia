import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LangToggle from '../../components/LangToggle';
import { useTranslate } from '../../lib/i18n';
import useGlobalStore from '../../lib/store';

export default function SettingsScreen() {
  const { lang, setLang } = useGlobalStore();
  const t = useTranslate();

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const developerUrl = 'https://hsan.dev/';
  const privacyPolicyUrl = 'https://www.google.com/policies/privacy/'; // Placeholder

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settingsTitle')}</Text>
      </View>
      <View style={styles.content}>
        {/* Language Setting */}
        <View style={styles.settingRow}>
          <Text style={styles.label}>{t('language')}</Text>
          <LangToggle currentLang={lang} onToggle={setLang} />
        </View>

        {/* Developer Link */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => Linking.openURL(developerUrl)}
        >
          <Text style={styles.label}>{t('developer')}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>Hasan Alorbini</Text>
            <Ionicons name="open-outline" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>


        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            {t('appVersion')} {appVersion}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    color: '#fff',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 18,
    color: '#ccc',
  },
  versionContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
});

