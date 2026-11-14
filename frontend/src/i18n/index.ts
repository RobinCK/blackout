import { en, type TranslationKey } from './en';
import { uk } from './uk';

export type Dictionary = Readonly<Partial<Record<string, string>>>;

export type TranslationParams = Readonly<Record<string, string | number>>;

export interface Translator {
  readonly language: string;
  readonly locale: string;
  t(key: TranslationKey | string, params?: TranslationParams): string;
  plural(key: string, count: number): string;
}

const DICTIONARIES: Readonly<Record<string, Dictionary>> = { en, uk };
const LOCALES: Readonly<Record<string, string>> = { en: 'en-GB', uk: 'uk-UA' };
export const LANGUAGES = Object.keys(DICTIONARIES);

export function normalizeLanguage(language: string | undefined): string {
  const base = (language ?? 'en').toLowerCase().split(/[-_]/)[0] ?? 'en';

  return base in DICTIONARIES ? base : 'en';
}

function interpolate(template: string, params: TranslationParams | undefined): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export function createTranslator(
  language: string | undefined,
  overrides: Dictionary = {},
): Translator {
  const code = normalizeLanguage(language);
  const dictionary = DICTIONARIES[code] ?? en;
  const rules = new Intl.PluralRules(code);

  const lookup = (key: string): string | undefined =>
    overrides[key] ?? dictionary[key] ?? (en as Dictionary)[key];

  return {
    language: code,
    locale: LOCALES[code] ?? code,
    t: (key, params) => interpolate(lookup(key) ?? key, params),
    plural: (key, count) => {
      const form = lookup(`${key}_${rules.select(count)}`) ?? lookup(`${key}_other`) ?? key;

      return interpolate(form, { count });
    },
  };
}
