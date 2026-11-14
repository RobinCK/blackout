import { describe, expect, it } from 'vitest';

import { readBattery, runtimeMs, socAt } from '../src/data/battery';
import type { HassEntity, HomeAssistant } from '../src/types/ha';

const HOUR = 3_600_000;

function entity(entityId: string, state: string, unit: string): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: { unit_of_measurement: unit },
    last_changed: '',
    last_updated: '',
  };
}

const hass: HomeAssistant = {
  states: {
    'sensor.soc': entity('sensor.soc', '80', '%'),
    'sensor.battery': entity('sensor.battery', '2', 'kW'),
    'sensor.load': entity('sensor.load', '2000', 'W'),
  },
  callWS: () => Promise.reject(new Error('unused')),
};

describe('battery', () => {
  const battery = readBattery(hass, {
    soc: 'sensor.soc',
    power: 'sensor.battery',
    load: 'sensor.load',
    capacity: 20,
  });

  it('reads entities with their units', () => {
    expect(battery?.dischargeW).toBe(2000);
    expect(battery?.loadW).toBe(2000);
  });

  it('computes runtime above the reserve', () => {
    expect(battery && runtimeMs(battery)).toBe(7 * HOUR);
  });

  it('projects the state of charge and stops at the given moment', () => {
    if (!battery) {
      throw new Error('no battery');
    }

    expect(socAt(battery, 2 * HOUR, 0)).toBe(60);
    expect(socAt(battery, 2 * HOUR, 0, HOUR)).toBe(70);
  });
});
