export type LocalizedValue<T> = Record<string, T | null | undefined> | null | undefined;

function hasValue<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined && value !== "";
}

export function resolveLocalized<T>(
  value: LocalizedValue<T>,
  requestedLocale: string,
  defaultLocale: string,
): T | null {
  if (!value) return null;

  const requested = value[requestedLocale];
  if (hasValue(requested)) return requested;

  const fallback = value[defaultLocale];
  if (hasValue(fallback)) return fallback;

  return Object.values(value).find(hasValue) ?? null;
}
