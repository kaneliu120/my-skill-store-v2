import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh', 'tl', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'tr', 'vi', 'th', 'id', 'hi', 'nl', 'pl'] as const;
export const localePrefix = 'always'; // Default

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix });
