import { describe, expect, it } from 'vitest';

import { SLOT_MS } from '../src/data/timeline';
import { fetchVoltage, voltageReport } from '../src/data/voltage';
import type { HomeAssistant } from '../src/types/ha';

const MINUTE = 60_000;

describe('voltage', () => {
  it('groups 5-minute statistics into half hours', async () => {
    const hass: HomeAssistant = {
      states: {},
      callWS: <T>() =>
        Promise.resolve({
          'sensor.in': [
            { start: 0, min: 228, max: 236, mean: 232 },
            { start: 5 * MINUTE, min: 205, max: 231, mean: 220 },
            { start: SLOT_MS, min: 230, max: 240, mean: 235 },
          ],
          'sensor.out': [
            { start: 0, mean: 229 },
            { start: 5 * MINUTE, mean: 231 },
          ],
        } as T),
    };
    const [slots] = await fetchVoltage(hass, [{ input: 'sensor.in', output: 'sensor.out' }], 0, 3);

    expect(slots).toEqual([
      { start: 0, min: 205, max: 236, output: 230 },
      { start: SLOT_MS, min: 230, max: 240, output: null },
      { start: 2 * SLOT_MS, min: null, max: null, output: null },
    ]);
  });

  it('measures the share in range and skips outages', () => {
    const report = voltageReport(
      [
        [
          { start: 0, min: 205, max: 236, output: null },
          { start: SLOT_MS, min: 230, max: 240, output: null },
          { start: 2 * SLOT_MS, min: 180, max: 190, output: null },
        ],
      ],
      { min: 207, max: 253 },
      [{ start: 2 * SLOT_MS + MINUTE, end: 3 * SLOT_MS, possible: false }],
    );

    expect(report.share).toBe(0.5);
    expect(report.low).toEqual({ value: 205, phase: 0, time: 0 });
    expect(report.high).toEqual({ value: 240, phase: 0, time: SLOT_MS });
    expect(report.phases[0]?.slots[2]?.outage).toBe(true);
  });
});
