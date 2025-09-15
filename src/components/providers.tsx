'use client';

import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/language-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider defaultLanguage="en">
      <ThemeProvider defaultTheme="light">
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}