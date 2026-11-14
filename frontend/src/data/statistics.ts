import type {
  StatisticPeriod,
  StatisticRecordItem,
  StatisticValue,
  StreakRecordItem,
} from '../types/config';
import type { HomeAssistant } from '../types/ha';

const DAY_MS = 24 * 60 * 60_000;
const DEFAULT_DAYS = 365;

interface StatisticRow {
  readonly start: number | string;
  readonly end?: number | string;
  readonly change?: number | null;
  readonly max?: number | null;
  readonly mean?: number | null;
  readonly min?: number | null;
  readonly sum?: number | null;
  readonly state?: number | null;
}

export interface StatisticRecord {
  readonly value: number;
  readonly start: number;
}

export interface StreakRecord {
  readonly days: number;
  readonly start: number;
  readonly end: number;
}

function timestamp(value: number | string): number {
  return typeof value === 'number' ? value : Date.parse(value);
}

async function fetchRows(
  hass: HomeAssistant,
  entity: string,
  period: StatisticPeriod,
  value: StatisticValue,
  days: number,
): Promise<StatisticRow[]> {
  const end = Date.now();
  const response = await hass.callWS<Record<string, StatisticRow[]>>({
    type: 'recorder/statistics_during_period',
    start_time: new Date(end - days * DAY_MS).toISOString(),
    end_time: new Date(end).toISOString(),
    statistic_ids: [entity],
    period,
    types: [value],
  });

  return response[entity] ?? [];
}

function hourIn(
  start: number,
  hours: readonly [number, number] | undefined,
  timeZone: string,
): boolean {
  if (!hours) {
    return true;
  }

  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone }).format(start),
  );
  const [from, to] = hours;

  return from <= to ? hour >= from && hour < to : hour >= from || hour < to;
}

export async function statisticRecord(
  hass: HomeAssistant,
  item: StatisticRecordItem,
  timeZone: string,
): Promise<StatisticRecord | null> {
  const value = item.value ?? 'max';
  const rows = await fetchRows(
    hass,
    item.entity,
    item.period ?? 'day',
    value,
    item.days ?? DEFAULT_DAYS,
  );
  const pickMin = item.stat === 'min';
  let best: StatisticRecord | null = null;

  for (const row of rows) {
    const raw = row[value];
    const start = timestamp(row.start);

    if (typeof raw !== 'number' || !hourIn(start, item.hours, timeZone)) {
      continue;
    }

    if (!best || (pickMin ? raw < best.value : raw > best.value)) {
      best = { value: raw, start };
    }
  }

  return best;
}

export async function streakRecord(
  hass: HomeAssistant,
  item: StreakRecordItem,
): Promise<StreakRecord | null> {
  const value = item.value ?? 'change';
  const rows = await fetchRows(hass, item.entity, 'day', value, item.days ?? DEFAULT_DAYS);
  let best: StreakRecord | null = null;
  let current: StreakRecord | null = null;

  for (const row of rows) {
    const raw = row[value];
    const start = timestamp(row.start);
    const matches =
      typeof raw === 'number' &&
      (item.below === undefined || raw < item.below) &&
      (item.above === undefined || raw > item.above);

    if (!matches) {
      current = null;
      continue;
    }

    current = current
      ? { days: current.days + 1, start: current.start, end: start }
      : { days: 1, start, end: start };

    if (!best || current.days > best.days) {
      best = current;
    }
  }

  return best;
}
