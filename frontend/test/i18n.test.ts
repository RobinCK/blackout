import { describe, expect, it } from 'vitest';

import { createTranslator, normalizeLanguage } from '../src/i18n';
import { en } from '../src/i18n/en';
import { uk } from '../src/i18n/uk';

describe('i18n', () => {
  it('normalizes languages and falls back to English', () => {
    expect(normalizeLanguage('uk-UA')).toBe('uk');
    expect(normalizeLanguage('de')).toBe('en');
    expect(normalizeLanguage(undefined)).toBe('en');
  });

  it('interpolates parameters and applies overrides', () => {
    const t = createTranslator('uk', { 'hero.outage_in': 'Вимкнуть через' });

    expect(t.t('title.queue', { group: '5.1' })).toBe('Черга 5.1');
    expect(t.t('hero.outage_in')).toBe('Вимкнуть через');
  });

  it('uses Ukrainian plural forms', () => {
    const t = createTranslator('uk');

    expect(t.plural('unit.days', 1)).toBe('1 день');
    expect(t.plural('unit.days', 3)).toBe('3 дні');
    expect(t.plural('unit.days', 7)).toBe('7 днів');
  });

  it('has every English key in Ukrainian', () => {
    const missing = Object.keys(en).filter((key) => !(key in uk) && !key.startsWith('unit.days'));

    expect(missing).toEqual([]);
  });
});
