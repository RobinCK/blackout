import type { VoltagePhase } from '../types/config';
import type { HomeAssistant } from '../types/ha';
import { SLOT_MS, type Window } from './timeline';

export interface VoltageSlot {
  readonly start: number;
  readonly min: number | null;
  readonly max: number | null;
  readonly output: number | null;
}

export interface SlotView extends VoltageSlot {
  readonly outage: boolean;
  readonly ok: boolean | null;
}

export interface PhaseReport {
  readonly slots: readonly SlotView[];
  readonly share: number | null;
}

export interface Extreme {
  readonly value: number;
  readonly phase: number;
  readonly time: number;
}

export interface VoltageReport {
  readonly phases: readonly PhaseReport[];
  readonly share: number | null;
  readonly low: Extreme | null;
  readonly high: Extreme | null;
}

export interface VoltageLimits {
  readonly min: number;
  readonly max: number;
}

interface StatisticRow {
  readonly start: number | string;
  readonly min?: number | null;
  readonly max?: number | null;
  readonly mean?: number | null;
}

function timestamp(value: number | string): number {
  return typeof value === 'number' ? value : Date.parse(value);
}

function present(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function buckets(
  rows: readonly StatisticRow[] | undefined,
  start: number,
  count: number,
): StatisticRow[][] {
  const result: StatisticRow[][] = Array.from({ length: count }, () => []);

  for (const row of rows ?? []) {
    const index = Math.floor((timestamp(row.start) - start) / SLOT_MS);

    result[index]?.push(row);
  }

  return result;
}

function slotsOf(
  input: readonly StatisticRow[] | undefined,
  output: readonly StatisticRow[] | undefined,
  start: number,
  count: number,
): VoltageSlot[] {
  const inputs = buckets(input, start, count);
  const outputs = buckets(output, start, count);

  return inputs.map((rows, index) => {
    const lows = rows.map((row) => row.min ?? row.mean).filter(present);
    const highs = rows.map((row) => row.max ?? row.mean).filter(present);
    const means = (outputs[index] ?? []).map((row) => row.mean).filter(present);

    return {
      start: start + index * SLOT_MS,
      min: lows.length > 0 ? Math.min(...lows) : null,
      max: highs.length > 0 ? Math.max(...highs) : null,
      output: means.length > 0 ? means.reduce((sum, value) => sum + value, 0) / means.length : null,
    };
  });
}

export async function fetchVoltage(
  hass: HomeAssistant,
  phases: readonly VoltagePhase[],
  start: number,
  count: number,
): Promise<VoltageSlot[][]> {
  const ids = [
    ...new Set(
      phases
        .flatMap((phase) => [phase.input, phase.output])
        .filter((id): id is string => typeof id === 'string' && id.length > 0),
    ),
  ];
  const response =
    ids.length === 0
      ? {}
      : await hass.callWS<Record<string, StatisticRow[]>>({
          type: 'recorder/statistics_during_period',
          start_time: new Date(start).toISOString(),
          end_time: new Date(start + count * SLOT_MS).toISOString(),
          statistic_ids: ids,
          period: '5minute',
          types: ['min', 'max', 'mean'],
        });

  return phases.map((phase) =>
    slotsOf(
      phase.input ? response[phase.input] : undefined,
      phase.output ? response[phase.output] : undefined,
      start,
      count,
    ),
  );
}

function overlaps(slot: VoltageSlot, outages: readonly Window[]): boolean {
  return outages.some((outage) => outage.start < slot.start + SLOT_MS && outage.end > slot.start);
}

function extreme(
  current: Extreme | null,
  value: number | null,
  phase: number,
  time: number,
  lower: boolean,
): Extreme | null {
  if (value === null) {
    return current;
  }

  if (current && (lower ? value >= current.value : value <= current.value)) {
    return current;
  }

  return { value, phase, time };
}

export function voltageReport(
  phases: readonly (readonly VoltageSlot[])[],
  limits: VoltageLimits,
  outages: readonly Window[],
): VoltageReport {
  let low: Extreme | null = null;
  let high: Extreme | null = null;
  let good = 0;
  let total = 0;

  const reports = phases.map((slots, phase) => {
    let phaseGood = 0;
    let phaseTotal = 0;

    const views = slots.map((slot): SlotView => {
      const outage = overlaps(slot, outages);

      if (outage || slot.min === null || slot.max === null) {
        return { ...slot, outage, ok: null };
      }

      const ok = slot.min >= limits.min && slot.max <= limits.max;

      phaseTotal += 1;
      phaseGood += ok ? 1 : 0;
      low = extreme(low, slot.min, phase, slot.start, true);
      high = extreme(high, slot.max, phase, slot.start, false);

      return { ...slot, outage, ok };
    });

    good += phaseGood;
    total += phaseTotal;

    return { slots: views, share: phaseTotal > 0 ? phaseGood / phaseTotal : null };
  });

  return { phases: reports, share: total > 0 ? good / total : null, low, high };
}
