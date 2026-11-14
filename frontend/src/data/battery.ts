import { DEFAULT_MORNING_HOUR, DEFAULT_RESERVE } from '../defaults';
import type { BatteryConfig } from '../types/config';
import type { HassEntity, HomeAssistant } from '../types/ha';
import { HOUR_MS } from './timeline';

export interface BatteryState {
  readonly soc: number;
  readonly capacityKwh: number;
  readonly reserve: number;
  readonly loadW: number | null;
  readonly dischargeW: number | null;
  readonly morningHour: number;
}

function numeric(entity: HassEntity | undefined): number | null {
  if (!entity) {
    return null;
  }

  const value = Number.parseFloat(entity.state);

  return Number.isFinite(value) ? value : null;
}

function watts(entity: HassEntity | undefined): number | null {
  const value = numeric(entity);

  if (value === null || !entity) {
    return null;
  }

  return entity.attributes.unit_of_measurement?.toLowerCase() === 'kw' ? value * 1000 : value;
}

function capacity(hass: HomeAssistant, value: number | string | undefined): number | null {
  if (typeof value === 'number') {
    return value > 0 ? value : null;
  }

  if (!value) {
    return null;
  }

  const entity = hass.states[value];
  const kwh = numeric(entity);

  if (kwh === null || !entity) {
    return null;
  }

  return entity.attributes.unit_of_measurement?.toLowerCase() === 'wh' ? kwh / 1000 : kwh;
}

export function readBattery(
  hass: HomeAssistant,
  config: BatteryConfig | undefined,
): BatteryState | null {
  if (!config?.soc) {
    return null;
  }

  const soc = numeric(hass.states[config.soc]);
  const capacityKwh = capacity(hass, config.capacity);

  if (soc === null || capacityKwh === null) {
    return null;
  }

  const batteryW = config.power ? watts(hass.states[config.power]) : null;
  const sign = config.power_positive === 'charge' ? -1 : 1;

  return {
    soc,
    capacityKwh,
    reserve: config.reserve ?? DEFAULT_RESERVE,
    loadW: config.load ? watts(hass.states[config.load]) : null,
    dischargeW: batteryW === null ? null : batteryW * sign,
    morningHour: config.morning_hour ?? DEFAULT_MORNING_HOUR,
  };
}

export function batteryEntities(config: BatteryConfig | undefined): string[] {
  if (!config) {
    return [];
  }

  return [config.soc, config.power, config.load, config.capacity].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );
}

export function usableKwh(battery: BatteryState, soc = battery.soc): number {
  return (battery.capacityKwh * Math.max(0, soc - battery.reserve)) / 100;
}

export function socAt(battery: BatteryState, at: number, now: number, changeUntil = at): number {
  const until = Math.min(at, changeUntil);

  if (battery.dischargeW === null || until <= now) {
    return battery.soc;
  }

  const hours = (until - now) / HOUR_MS;
  const change = ((battery.dischargeW / 1000) * hours * 100) / battery.capacityKwh;

  return Math.min(100, Math.max(battery.reserve, battery.soc - change));
}

export function runtimeMs(battery: BatteryState, soc = battery.soc): number | null {
  if (battery.loadW === null || battery.loadW <= 0) {
    return null;
  }

  return (usableKwh(battery, soc) / (battery.loadW / 1000)) * HOUR_MS;
}

export function allowedLoadKw(battery: BatteryState, untilMs: number, now: number): number | null {
  const hours = (untilMs - now) / HOUR_MS;

  return hours > 0 ? usableKwh(battery) / hours : null;
}
