import type { HomeAssistant } from '../types/ha';

export function findQueueEntity(hass: HomeAssistant): string | undefined {
  return Object.values(hass.states).find(
    (entity) =>
      entity.entity_id.startsWith('sensor.') &&
      typeof entity.attributes.group === 'string' &&
      'today_status' in entity.attributes,
  )?.entity_id;
}
