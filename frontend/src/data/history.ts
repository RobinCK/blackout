import type { HomeAssistant } from '../types/ha';

export interface Sample {
  readonly time: number;
  readonly value: number;
}

interface CompressedState {
  readonly s: string;
  readonly lu?: number;
  readonly lc?: number;
}

export async function fetchNumericHistory(
  hass: HomeAssistant,
  entityId: string,
  start: number,
  end: number,
): Promise<Sample[]> {
  const response = await hass.callWS<Record<string, CompressedState[]>>({
    type: 'history/history_during_period',
    start_time: new Date(start).toISOString(),
    end_time: new Date(end).toISOString(),
    entity_ids: [entityId],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });

  return (response[entityId] ?? []).flatMap((row) => {
    const value = Number.parseFloat(row.s);
    const seconds = row.lu ?? row.lc;

    if (!Number.isFinite(value) || seconds === undefined) {
      return [];
    }

    return [{ time: Math.max(start, seconds * 1000), value }];
  });
}
