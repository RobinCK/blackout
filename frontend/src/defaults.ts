import { RECORDS_CARD_TYPE, SCHEDULE_CARD_TYPE, STATUS_CARD_TYPE, WEEK_CARD_TYPE } from './const';
import type { BatteryConfig, DayKey } from './types/config';

export type ConfigValues = Readonly<Record<string, unknown>>;

export const DEFAULT_TIMELINE_HOURS = 8;
export const DEFAULT_TIMELINE_OFFSET = 1;
export const DEFAULT_WEEK_DAYS = 7;
export const DEFAULT_SCHEDULE_DAYS: readonly DayKey[] = ['today', 'tomorrow'];
export const DEFAULT_RECORD_COLUMNS = 2;
export const DEFAULT_RESERVE = 10;
export const DEFAULT_MORNING_HOUR = 7;

const COMMON: ConfigValues = { show_header: true, tap_action: 'more-info' };

export const CARD_DEFAULTS: Readonly<Record<string, ConfigValues>> = {
  [STATUS_CARD_TYPE]: {
    ...COMMON,
    show_badge: true,
    show_timeline: true,
    timeline_hours: DEFAULT_TIMELINE_HOURS,
    timeline_offset: DEFAULT_TIMELINE_OFFSET,
    show_stats: true,
  },
  [SCHEDULE_CARD_TYPE]: {
    ...COMMON,
    days: DEFAULT_SCHEDULE_DAYS,
    show_source: true,
    show_now: true,
    show_legend: true,
    show_windows: true,
    show_totals: true,
  },
  [WEEK_CARD_TYPE]: {
    ...COMMON,
    days: DEFAULT_WEEK_DAYS,
    show_badge: true,
    show_stats: true,
    show_schedule: true,
    show_legend: true,
    show_next: true,
  },
  [RECORDS_CARD_TYPE]: { ...COMMON, columns: DEFAULT_RECORD_COLUMNS },
};

export const BATTERY_DEFAULTS: Readonly<BatteryConfig> = {
  reserve: DEFAULT_RESERVE,
  power_positive: 'discharge',
  morning_hour: DEFAULT_MORNING_HOUR,
};
