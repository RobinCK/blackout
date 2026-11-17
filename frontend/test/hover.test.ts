import { describe, expect, it } from 'vitest';

import type { RenderContext } from '../src/cards/base-card';
import { describeSlot, slotAt } from '../src/cards/hover';
import { createTranslator } from '../src/i18n';
import type { ActualOutage, QueueDay, QueuePayload, SlotState } from '../src/types/payload';
import { createFormatter } from '../src/utils/format';

const START = '2026-11-14T00:00:00+02:00';
const NOW = Date.parse('2026-11-14T15:10:00+02:00');

function day(slots: string, actual: readonly ActualOutage[] = []): QueueDay {
  return {
    date: '2026-11-14',
    start: START,
    status: 'schedule',
    slots: [...slots].map((code): SlotState => (code === '0' ? 'off' : 'on')),
    updated_at: null,
    versions: 1,
    outage_hours: null,
    possible_hours: null,
    longest_hours: null,
    actual,
    actual_hours: null,
  };
}

function context(days: readonly QueueDay[], grid: string | null): RenderContext {
  const translator = createTranslator('en');
  const payload = { days, status: 'power_on', queue: { grid_entity: grid } };

  return {
    payload: payload as unknown as QueuePayload,
    now: NOW,
    t: translator.t,
    f: createFormatter(translator, 'Europe/Kyiv'),
    size: 'auto',
  };
}

const SLOTS = '1'.repeat(28) + '0'.repeat(5) + '1'.repeat(15);

describe('hover', () => {
  it('snaps a moment to its half hour', () => {
    expect(slotAt(Date.parse('2026-11-14T14:47:00+02:00'))).toBe(
      Date.parse('2026-11-14T14:30:00+02:00'),
    );
  });

  it('describes the schedule window of a slot', () => {
    const slot = Date.parse('2026-11-14T15:00:00+02:00');
    const content = describeSlot(context([day(SLOTS)], null), slot, { title: '15:00–15:30' });

    expect(content).toEqual({
      title: '15:00–15:30',
      lines: [{ swatch: 'off', text: 'Outage · 14:00–16:30' }],
    });
  });

  it('adds the actual grid state for past slots', () => {
    const actual = [
      { start: '2026-11-14T14:05:00+02:00', end: '2026-11-14T14:50:00+02:00', hours: 0.75 },
    ];
    const ctx = context([day(SLOTS, actual)], 'binary_sensor.grid');
    const past = describeSlot(ctx, Date.parse('2026-11-14T14:30:00+02:00'), { title: '' });
    const future = describeSlot(ctx, Date.parse('2026-11-14T16:30:00+02:00'), { title: '' });

    expect(past.lines.map((line) => line.text)).toEqual([
      'Grid: no power · 14:05–14:50',
      'Schedule: outage · 14:00–16:30',
    ]);
    expect(future.lines.map((line) => line.text)).toEqual(['Schedule: power on · 16:30–24:00']);
  });

  it('marks a scheduled outage when the power stayed on', () => {
    const ctx = context([day(SLOTS)], 'binary_sensor.grid');
    const content = describeSlot(ctx, Date.parse('2026-11-14T14:30:00+02:00'), { title: '' });

    expect(content.lines).toEqual([
      { swatch: 'on', text: 'Grid: power on' },
      { swatch: 'skipped', text: 'Schedule: outage · 14:00–16:30' },
    ]);
  });

  it('skips an unknown schedule next to the grid state', () => {
    const ctx = context([{ ...day(SLOTS), status: 'waiting', slots: [] }], 'binary_sensor.grid');
    const content = describeSlot(ctx, Date.parse('2026-11-14T10:00:00+02:00'), { title: '' });

    expect(content.lines.map((line) => line.text)).toEqual(['Grid: power on']);
  });
});
