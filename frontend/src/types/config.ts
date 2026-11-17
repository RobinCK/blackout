import type { SizeSetting } from '../cards/size';

export type ColorKey = 'on' | 'off' | 'possible' | 'emergency' | 'battery' | 'unknown';

export type TapAction = 'more-info' | 'none';

export interface BatteryConfig {
  readonly soc?: string;
  readonly power?: string;
  readonly load?: string;
  readonly capacity?: number | string;
  readonly reserve?: number;
  readonly power_positive?: 'discharge' | 'charge';
  readonly morning_hour?: number;
}

export interface BaseCardConfig {
  readonly type: string;
  readonly entity?: string;
  readonly title?: string;
  readonly show_header?: boolean;
  readonly language?: string;
  readonly time_zone?: string;
  readonly labels?: Readonly<Record<string, string>>;
  readonly colors?: Readonly<Partial<Record<ColorKey, string>>>;
  readonly tap_action?: TapAction;
  readonly size?: SizeSetting;
}

export const STAT_KEYS = [
  'today',
  'longest',
  'tomorrow',
  'emergency',
  'load',
  'battery_reserve',
  'battery_at_start',
  'until_morning',
  'actual_today',
  'availability',
  'region',
  'next_outage',
  'power_back',
  'source',
] as const;

export type StatKey = (typeof STAT_KEYS)[number];

export type StatGroup = 'power_on' | 'outage' | 'emergency';

export type StatsConfig =
  readonly StatKey[] | Readonly<Partial<Record<StatGroup, readonly StatKey[]>>>;

export interface StatusCardConfig extends BaseCardConfig {
  readonly show_badge?: boolean;
  readonly show_timeline?: boolean;
  readonly show_stats?: boolean;
  readonly timeline_hours?: number;
  readonly timeline_offset?: number;
  readonly stats?: StatsConfig;
  readonly battery?: BatteryConfig;
}

export type DayKey = 'today' | 'tomorrow';

export interface ScheduleCardConfig extends BaseCardConfig {
  readonly days?: readonly DayKey[];
  readonly show_source?: boolean;
  readonly show_now?: boolean;
  readonly show_legend?: boolean;
  readonly show_windows?: boolean;
  readonly show_totals?: boolean;
  readonly battery?: BatteryConfig;
}

export interface WeekCardConfig extends BaseCardConfig {
  readonly days?: number;
  readonly show_badge?: boolean;
  readonly show_stats?: boolean;
  readonly show_schedule?: boolean;
  readonly show_legend?: boolean;
  readonly show_next?: boolean;
  readonly battery?: BatteryConfig;
}

export interface BatteryCardConfig extends BaseCardConfig {
  readonly battery?: BatteryConfig;
}

export interface VoltagePhase {
  readonly input?: string;
  readonly output?: string;
}

export interface VoltageCardConfig extends BaseCardConfig {
  readonly phases?: readonly VoltagePhase[];
  readonly voltage_min?: number;
  readonly voltage_max?: number;
}

export type OutageRecordType =
  'longest_outage' | 'longest_power_streak' | 'current_power_streak' | 'worst_day' | 'outage_count';

export type StatisticPeriod = '5minute' | 'hour' | 'day' | 'week' | 'month';

export type StatisticValue = 'change' | 'max' | 'mean' | 'min' | 'sum' | 'state';

export interface OutageRecordItem {
  readonly type: OutageRecordType;
  readonly label?: string;
  readonly icon?: string;
  readonly color?: string;
}

export interface StatisticRecordItem {
  readonly type: 'statistic';
  readonly entity: string;
  readonly label?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly period?: StatisticPeriod;
  readonly stat?: 'max' | 'min';
  readonly value?: StatisticValue;
  readonly days?: number;
  readonly hours?: readonly [number, number];
  readonly unit?: string;
  readonly decimals?: number;
  readonly scale?: number;
  readonly date_format?: 'datetime' | 'day' | 'month';
}

export interface StreakRecordItem {
  readonly type: 'streak';
  readonly entity: string;
  readonly label?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly value?: StatisticValue;
  readonly below?: number;
  readonly above?: number;
  readonly days?: number;
}

export type RecordItem = OutageRecordItem | StatisticRecordItem | StreakRecordItem;

export interface RecordsCardConfig extends BaseCardConfig {
  readonly since?: string;
  readonly columns?: number;
  readonly items?: readonly RecordItem[];
}
