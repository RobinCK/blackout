import { describe, expect, it } from 'vitest';

import {
  clipSegments,
  isRemoved,
  outageWindows,
  plannedDay,
  removedWindows,
  slotSegments,
  stateAt,
} from '../src/data/timeline';
import type { QueueDay, SlotState } from '../src/types/payload';

function day(date: string, start: string, slots: string): QueueDay {
  const states: Record<string, SlotState> = {
    '1': 'on',
    '0': 'off',
    '?': 'possible',
    '-': 'unknown',
  };

  return {
    date,
    start,
    status: 'schedule',
    slots: [...slots].map((code) => states[code] ?? 'unknown'),
    updated_at: null,
    versions: 1,
    outage_hours: null,
    possible_hours: null,
    longest_hours: null,
    actual: [],
    actual_hours: null,
  };
}

const TODAY = day(
  '2026-11-14',
  '2026-11-14T00:00:00+02:00',
  '1'.repeat(36) + '0'.repeat(6) + '1'.repeat(6),
);
const TOMORROW = day('2026-11-15', '2026-11-15T00:00:00+02:00', '0'.repeat(4) + '1'.repeat(44));

describe('timeline', () => {
  it('merges slots into segments across days', () => {
    const segments = slotSegments([TODAY, TOMORROW]);

    expect(segments.map((segment) => segment.state)).toEqual(['on', 'off', 'on', 'off', 'on']);
  });

  it('finds outage windows of a day', () => {
    const [window] = outageWindows(TODAY);

    expect(window?.start).toBe(Date.parse('2026-11-14T18:00:00+02:00'));
    expect(window?.end).toBe(Date.parse('2026-11-14T21:00:00+02:00'));
  });

  it('reads the state at a moment and clips segments', () => {
    expect(stateAt([TODAY], Date.parse('2026-11-14T19:00:00+02:00'))).toBe('off');

    const from = Date.parse('2026-11-14T20:00:00+02:00');
    const clipped = clipSegments(slotSegments([TODAY]), from, from + 2 * 3_600_000);

    expect(clipped[0]?.start).toBe(from);
  });

  it('keeps outages that were removed from the schedule', () => {
    const planned = day(
      '2026-11-14',
      '2026-11-14T00:00:00+02:00',
      '1'.repeat(28) + '0'.repeat(6) + '1'.repeat(2) + '0'.repeat(6) + '1'.repeat(6),
    );
    const current: QueueDay = { ...TODAY, planned: planned.slots };
    const removed = removedWindows(current);

    expect(isRemoved(current, 28)).toBe(true);
    expect(isRemoved(current, 36)).toBe(false);
    expect(removed.map((window) => (window.end - window.start) / 3_600_000)).toEqual([3]);
    expect(outageWindows(plannedDay(current))).toHaveLength(2);
    expect(removedWindows(TODAY)).toEqual([]);
  });
});
