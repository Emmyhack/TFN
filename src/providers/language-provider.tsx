'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations } from '@/lib/translations';

type Language = 'en' | 'ha' | 'yo' | 'ig' | 'fr' | 'ar' | 'es' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'ha' as Language, name: 'Hausa', nativeName: 'Hausa' },
  { code: 'yo' as Language, name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ig' as Language, name: 'Igbo', nativeName: 'Igbo' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español' },
  { code: 'pt' as Language, name: 'Portuguese', nativeName: 'Português' }
];

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'en' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('tfn-language') as Language;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const supportedLanguages = SUPPORTED_LANGUAGES.map(l => l.code);
    
    const initialLanguage = savedLanguage || 
      (supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en');
    
    setLanguageState(initialLanguage);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Save to localStorage
    localStorage.setItem('tfn-language', language);
    
    // Set document direction for RTL languages
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, mounted]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  // Translation function with fallback
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = (translations as any)[language] || (translations as any).en;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Fallback to English if translation not found
    if (!value && language !== 'en') {
      let fallback: any = (translations as any).en;
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      value = fallback;
    }
    
    return value || key;
  };

  // Prevent flash of untranslated content
  if (!mounted) {
    // Provide default context during initial render
    const defaultContext: LanguageContextType = {
      language: defaultLanguage,
      setLanguage: () => {},
      t: (key: string) => key,
      languages: SUPPORTED_LANGUAGES
    };
    
    return (
      <LanguageContext.Provider value={defaultContext}>
        <div suppressHydrationWarning>{children}</div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}