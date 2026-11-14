import { describe, expect, it } from 'vitest';

import { CARD_DEFAULTS } from '../src/defaults';
import { layoutFor, stripDefaults, type HaFormSchema } from '../src/editor/schema';

const t = (key: string): string => key;

function names(schema: readonly HaFormSchema[]): string[] {
  return schema.flatMap((field) => ('schema' in field ? names(field.schema) : [field.name]));
}

describe('editor layout', () => {
  it('shows only the battery fields the schedule card uses', () => {
    const layout = layoutFor('custom:blackout-schedule-card', { entity: 'sensor.queue' }, t);

    expect(layout.battery?.sensors).toEqual(['soc', 'power']);
    expect(names(layout.battery?.schema ?? [])).toEqual(['capacity', 'reserve']);
  });

  it('asks for the power sign only with a power sensor', () => {
    const layout = layoutFor(
      'custom:blackout-week-card',
      { entity: 'sensor.queue', battery: { power: 'sensor.battery_power' } },
      t,
    );

    expect(layout.battery?.sensors).toEqual(['soc', 'power', 'load']);
    expect(names(layout.battery?.schema ?? [])).toEqual(['capacity', 'reserve', 'power_positive']);
  });

  it('hides options of disabled parts', () => {
    const layout = layoutFor(
      'custom:blackout-status-card',
      { entity: 'sensor.queue', show_header: false, show_timeline: false, show_stats: false },
      t,
    );

    expect(names(layout.main)).toEqual(['show_header', 'show_timeline', 'show_stats']);
    expect(layout.battery).toBeNull();
    expect(names(layout.advanced)).not.toContain('tap_action');
  });

  it('hides the battery when the schedule card shows no windows', () => {
    const layout = layoutFor('custom:blackout-schedule-card', { show_windows: false }, t);

    expect(layout.battery).toBeNull();
  });

  it('drops values equal to the defaults', () => {
    const defaults = CARD_DEFAULTS['blackout-schedule-card'] ?? {};
    const value = stripDefaults(
      { type: 'x', show_header: true, show_now: false, days: ['today', 'tomorrow'] },
      defaults,
    );

    expect(value).toEqual({ type: 'x', show_now: false });
  });
});
