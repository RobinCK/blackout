import { describe, expect, it } from 'vitest';

import type { BatteryState } from '../src/data/battery';
import { batteryDay, forecastDay } from '../src/data/battery-day';

const HOUR = 3_600_000;

const battery = (overrides: Partial<BatteryState> = {}): BatteryState => ({
  soc: 50,
  capacityKwh: 10,
  reserve: 10,
  loadW: 1000,
  dischargeW: -2000,
  morningHour: 7,
  ...overrides,
});

describe('battery day', () => {
  it('finds the lowest charge and counts energy and cycles', () => {
    const day = batteryDay(
      [
        { time: 0, value: 60 },
        { time: HOUR, value: 30 },
        { time: 2 * HOUR, value: 80 },
      ],
      10,
    );

    expect(day.min).toEqual({ time: HOUR, value: 30 });
    expect(day.charged).toBe(5);
    expect(day.discharged).toBe(3);
    expect(day.cycles).toBe(0.4);
  });

  it('leaves energy empty without a capacity', () => {
    expect(batteryDay([{ time: 0, value: 40 }], null)).toEqual({
      min: { time: 0, value: 40 },
      charged: null,
      discharged: null,
      cycles: null,
    });
  });
});

describe('battery forecast', () => {
  it('charges with the current power until full and holds', () => {
    const forecast = forecastDay(battery(), 0, 10 * HOUR, []);

    expect(forecast.full).toBe(2.5 * HOUR);
    expect(forecast.points.at(-1)).toEqual({ time: 10 * HOUR, soc: 100 });
  });

  it('runs the load from the battery during an outage and stays flat after it', () => {
    const forecast = forecastDay(battery({ soc: 100, dischargeW: 0 }), 0, 10 * HOUR, [
      { start: 2 * HOUR, end: 5 * HOUR, possible: false },
    ]);

    expect(forecast.full).toBeNull();
    expect(forecast.points).toContainEqual({ time: 5 * HOUR, soc: 70 });
    expect(forecast.points.at(-1)).toEqual({ time: 10 * HOUR, soc: 70 });
  });

  it('stops at the reserve', () => {
    const forecast = forecastDay(battery({ soc: 20, dischargeW: 2000 }), 0, 4 * HOUR, []);

    expect(forecast.points).toContainEqual({ time: 0.5 * HOUR, soc: 10 });
    expect(forecast.points.at(-1)).toEqual({ time: 4 * HOUR, soc: 10 });
  });
});
