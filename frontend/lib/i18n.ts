import useGlobalStore from './store';

const translations = {
  en: {
    homeTitle: 'Discover Prompts',
    settingsTitle: 'Settings',
    language: 'Language',
    copy: 'Copy',
    share: 'Share',
    copiedToClipboard: 'Copied to clipboard!',
    error: 'An error occurred',
    retry: 'Retry',
    noResults: 'No prompts found.',
    privacyPolicy: 'Privacy Policy',
    appVersion: 'App Version',
    developer: 'Developer',
    // New keys for the home screen
    appName: 'Promptopia',
    homeSubtitle: 'Explore prompts for your next creative photo.',
    searchPlaceholderCategories: 'Search categories...',
    allCategories: 'All Categories',
  },
ar: {
    homeTitle: 'اكتشف الأوامر',
    settingsTitle: 'الإعدادات',
    language: 'اللغة',
    copy: 'نسخ',
    share: 'مشاركة',
    copiedToClipboard: 'تم النسخ إلى الحافظة!',
    error: 'حدث خطأ',
    retry: 'إعادة المحاولة',
    noResults: 'لم يتم العثور على أوامر.',
    privacyPolicy: 'سياسة الخصوصية',
    appVersion: 'إصدار التطبيق',
    developer: 'المطور',
    // New keys for the home screen (translated)
    appName: 'برومبتوبيا',
    homeSubtitle: 'استلهم أفكارك وابدأ رحلتك لصورة مذهلة.',
    searchPlaceholderCategories: 'ابحث في الفئات...',
    allCategories: 'كل الفئات',
  },
};

export const useTranslate = () => {
  const lang = useGlobalStore((state) => state.lang);

  return (key: keyof (typeof translations)['en']) => {
    return translations[lang][key] || translations.en[key];
  };
};

