import type { BatteryState } from './battery';
import type { Sample } from './history';
import { HOUR_MS, type Window } from './timeline';

export interface BatteryDay {
  readonly min: Sample | null;
  readonly charged: number | null;
  readonly discharged: number | null;
  readonly cycles: number | null;
}

export interface ForecastPoint {
  readonly time: number;
  readonly soc: number;
}

export interface BatteryForecast {
  readonly points: readonly ForecastPoint[];
  readonly full: number | null;
}

export function batteryDay(samples: readonly Sample[], capacityKwh: number | null): BatteryDay {
  let min: Sample | null = null;
  let rise = 0;
  let fall = 0;

  for (const [index, sample] of samples.entries()) {
    if (min === null || sample.value < min.value) {
      min = sample;
    }

    const previous = samples[index - 1];

    if (previous) {
      const delta = sample.value - previous.value;

      rise += Math.max(0, delta);
      fall += Math.max(0, -delta);
    }
  }

  if (capacityKwh === null) {
    return { min, charged: null, discharged: null, cycles: null };
  }

  const charged = (rise * capacityKwh) / 100;
  const discharged = (fall * capacityKwh) / 100;

  return { min, charged, discharged, cycles: (charged + discharged) / 2 / capacityKwh };
}

function boundaries(now: number, end: number, outages: readonly Window[]): number[] {
  const inside = outages
    .flatMap((outage) => [outage.start, outage.end])
    .filter((time) => time > now && time < end);

  return [...new Set([now, ...inside, end])].sort((a, b) => a - b);
}

export function forecastDay(
  battery: BatteryState,
  now: number,
  end: number,
  outages: readonly Window[],
): BatteryForecast {
  const capacity = battery.capacityKwh;
  const points: ForecastPoint[] = [{ time: now, soc: battery.soc }];
  const times = boundaries(now, end, outages);
  let soc = battery.soc;
  let full: number | null = null;
  let trend = true;

  for (const [index, from] of times.entries()) {
    const to = times[index + 1];

    if (to === undefined) {
      break;
    }

    const outage = outages.some((window) => window.start <= from && from < window.end);

    if (outage) {
      trend = false;
    }

    const watts = outage
      ? (battery.loadW ?? Math.max(0, battery.dischargeW ?? 0))
      : trend
        ? (battery.dischargeW ?? 0)
        : 0;
    const rate = (watts / 1000 / capacity) * (100 / HOUR_MS);
    const target = rate > 0 ? battery.reserve : 100;
    const moving = rate > 0 ? soc > target : rate < 0 && soc < target;

    if (!moving) {
      points.push({ time: to, soc });
      continue;
    }

    const reached = from + (soc - target) / rate;

    if (reached < to) {
      if (target === 100) {
        full = full ?? reached;
      }

      soc = target;
      points.push({ time: reached, soc }, { time: to, soc });
      continue;
    }

    soc -= rate * (to - from);
    points.push({ time: to, soc });
  }

  return { points, full };
}
