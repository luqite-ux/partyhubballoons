export const defaultLocale = "en" as const;
export const supportedLocales = [defaultLocale] as const;
export type Locale = (typeof supportedLocales)[number];

export function isSupportedLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}
