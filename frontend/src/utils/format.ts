import type { Translator } from '../i18n';

export const DEFAULT_TIME_ZONE = 'Europe/Kyiv';
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface DurationPart {
  readonly value: string;
  readonly unit: string;
}

export interface Formatter {
  readonly translator: Translator;
  readonly timeZone: string;
  number(value: number, decimals?: number): string;
  time(value: Date | string | number): string;
  dayKey(value: Date | string | number): string;
  date(value: Date | string | number): string;
  shortDate(value: Date | string | number): string;
  dayDate(value: Date | string | number): string;
  dateTime(value: Date | string | number): string;
  month(value: Date | string | number): string;
  weekday(value: Date | string | number): string;
  durationParts(ms: number): DurationPart[];
  duration(ms: number): string;
  hours(value: number, decimals?: number): string;
  relative(value: Date | string | number, now: number): string;
  power(watts: number): DurationPart;
}

function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value);
}

export function createFormatter(translator: Translator, timeZone = DEFAULT_TIME_ZONE): Formatter {
  const { locale } = translator;
  const t = translator.t;
  const timeFormat = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  });
  const keyFormat = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  });
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone,
  });
  const shortDateFormat = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone,
  });
  const dayDateFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone,
  });
  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone });
  const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone });
  const dayOfMonth = new Intl.DateTimeFormat(locale, { day: 'numeric', timeZone });
  const numberFormats = new Map<number, Intl.NumberFormat>();

  const number = (value: number, decimals = 0): string => {
    let format = numberFormats.get(decimals);

    if (!format) {
      format = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      numberFormats.set(decimals, format);
    }

    return format.format(value);
  };

  const durationParts = (ms: number): DurationPart[] => {
    const total = Math.max(0, Math.round(ms / MINUTE));
    const days = Math.floor(total / (DAY / MINUTE));
    const hours = Math.floor((total % (DAY / MINUTE)) / 60);
    const minutes = total % 60;

    if (days > 0) {
      return [
        { value: String(days), unit: t('unit.d') },
        { value: String(hours), unit: t('unit.h') },
      ];
    }

    if (hours > 0) {
      return [
        { value: String(hours), unit: t('unit.h') },
        { value: String(minutes).padStart(2, '0'), unit: t('unit.min') },
      ];
    }

    return [{ value: String(minutes), unit: t('unit.min') }];
  };

  return {
    translator,
    timeZone,
    number,
    time: (value) => timeFormat.format(toDate(value)),
    dayKey: (value) => keyFormat.format(toDate(value)),
    date: (value) => dateFormat.format(toDate(value)),
    shortDate: (value) => shortDateFormat.format(toDate(value)),
    dayDate: (value) => dayDateFormat.format(toDate(value)),
    dateTime: (value) => `${dateFormat.format(toDate(value))}, ${timeFormat.format(toDate(value))}`,
    month: (value) => monthFormat.format(toDate(value)),
    weekday: (value) => {
      const date = toDate(value);
      const weekday = weekdayFormat.format(date);

      return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${dayOfMonth.format(date)}`;
    },
    durationParts,
    duration: (ms) =>
      durationParts(ms)
        .map((part) => `${part.value} ${part.unit}`)
        .join(' '),
    hours: (value, decimals = 1) => `${number(value, decimals)} ${t('unit.hours')}`,
    relative: (value, now) => {
      const elapsed = now - toDate(value).getTime();

      if (elapsed < MINUTE) {
        return t('relative.just_now');
      }

      return t('relative.ago', {
        duration: durationParts(elapsed)
          .map((part) => `${part.value} ${part.unit}`)
          .join(' '),
      });
    },
    power: (watts) =>
      Math.abs(watts) >= 1000
        ? { value: number(watts / 1000, 1), unit: t('unit.kw') }
        : { value: number(watts, 0), unit: t('unit.w') },
  };
}

export function startOfDayIn(time: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).formatToParts(time);
  const part = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((item) => item.type === type)?.value ?? 0);
  const elapsed = ((part('hour') * 60 + part('minute')) * 60 + part('second')) * 1000;

  return time - elapsed - (time % 1000);
}
