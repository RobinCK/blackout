import type { HomeAssistant } from '../types/ha';
import type { QueuePayload } from '../types/payload';

const MAX_AGE_MS = 15_000;

interface CacheEntry {
  readonly at: number;
  readonly version: string;
  readonly promise: Promise<QueuePayload>;
}

const cache = new Map<string, CacheEntry>();

export class QueueNotFoundError extends Error {}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && 'code' in error && error.code === 'not_found'
  );
}

export function fetchQueue(
  hass: HomeAssistant,
  entityId: string,
  days: number,
  version: string,
): Promise<QueuePayload> {
  const key = `${entityId}|${days}`;
  const cached = cache.get(key);

  if (cached && cached.version === version && Date.now() - cached.at < MAX_AGE_MS) {
    return cached.promise;
  }

  const promise = hass
    .callWS<QueuePayload>({ type: 'blackout/queue', entity_id: entityId, days })
    .catch((error: unknown) => {
      cache.delete(key);

      throw isNotFound(error) ? new QueueNotFoundError(entityId) : error;
    });

  cache.set(key, { at: Date.now(), version, promise });

  return promise;
}
