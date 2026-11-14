import { describe, expect, it } from 'vitest';

import { createTranslator } from '../src/i18n';
import { createFormatter } from '../src/utils/format';

const MINUTE = 60_000;

describe('formatter', () => {
  const uk = createFormatter(createTranslator('uk'));
  const en = createFormatter(createTranslator('en'));

  it('formats durations with padded minutes', () => {
    expect(uk.duration(110 * MINUTE)).toBe('1 г 50 хв');
    expect(uk.duration(34 * MINUTE)).toBe('34 хв');
    expect(en.duration(245 * MINUTE)).toBe('4 h 05 min');
    expect(en.duration(31 * 60 * MINUTE)).toBe('1 d 7 h');
  });

  it('formats times in Kyiv time', () => {
    expect(uk.time('2026-11-14T16:00:00Z')).toBe('18:00');
  });

  it('uses the decimal separator of the language', () => {
    expect(uk.number(3, 1)).toBe('3,0');
    expect(en.number(3, 1)).toBe('3.0');
  });

  it('formats relative times', () => {
    const now = Date.parse('2026-11-14T10:00:00Z');

    expect(en.relative('2026-11-14T09:59:30Z', now)).toBe('just now');
    expect(uk.relative('2026-11-14T09:59:00Z', now)).toBe('1 хв тому');
  });
});
